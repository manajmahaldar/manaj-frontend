import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getContentDetails, trackProgress } from '../api/learningApi';
import { Play, Award, CheckCircle, ChevronRight, Bookmark } from 'lucide-react';
import YouTube from 'react-youtube';

const VideoDetail = () => {
    const { slug } = useParams();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false);
    const progressInterval = useRef(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const res = await getContentDetails(slug);
                if (res.data.success) {
                    setVideo(res.data.data);
                    if (res.data.data.userProgress) {
                        setIsCompleted(res.data.data.userProgress.completed);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();

        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current);
        };
    }, [slug]);

    const handleProgressUpdate = async (player) => {
        if (!video) return;
        try {
            const currentTime = await player.getCurrentTime();
            const duration = await player.getDuration();
            const pct = Math.round((currentTime / duration) * 100);
            
            await trackProgress({
                contentId: video._id,
                progress: pct,
                watchedSeconds: Math.round(currentTime),
                lastPosition: Math.round(currentTime)
            });

            if (pct >= 95) {
                setIsCompleted(true);
            }
        } catch (err) {
            console.error('Error tracking progress', err);
        }
    };

    const handlePlayerReady = (event) => {
        const player = event.target;
        // Resume from last position if exists
        if (video?.userProgress?.lastPosition) {
            player.seekTo(video.userProgress.lastPosition, true);
        }

        // Poll progress updates every 5 seconds while video is playing
        progressInterval.current = setInterval(() => {
            const playerState = player.getPlayerState();
            if (playerState === 1) { // 1 means playing in YouTube Player API
                handleProgressUpdate(player);
            }
        }, 5000);
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="aspect-video w-full bg-gray-200 rounded-3xl" />
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="h-20 bg-gray-100 rounded-3xl" />
            </div>
        );
    }

    if (!video) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500 font-bold">Video not found</p>
                <Link to="/learning/videos" className="text-primary font-bold mt-2 inline-block">Back to Videos</Link>
            </div>
        );
    }

    const renderPlayer = () => {
        if (video.videoSource === 'youtube') {
            const match = video.videoUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
            const videoId = match ? match[1] : null;

            if (videoId) {
                return (
                    <YouTube
                        videoId={videoId}
                        className="w-full h-full rounded-3xl overflow-hidden aspect-video"
                        iframeClassName="w-full h-full border-0"
                        onReady={handlePlayerReady}
                    />
                );
            }
        }

        // HTML5 Player fallback for Cloudinary/Self Hosted MP4 links
        return (
            <video 
                src={video.videoUrl} 
                controls 
                className="w-full aspect-video rounded-3xl bg-black"
                onPlay={(e) => {
                    const player = e.target;
                    progressInterval.current = setInterval(() => {
                        handleProgressUpdate({
                            getCurrentTime: async () => player.currentTime,
                            getDuration: async () => player.duration
                        });
                    }, 5000);
                }}
                onPause={() => {
                    if (progressInterval.current) clearInterval(progressInterval.current);
                }}
            />
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                    <Link to="/learning" className="hover:text-primary">Learning Hub</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <Link to="/learning/videos" className="hover:text-primary">Videos</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-gray-900 truncate max-w-[200px]">{video.title}</span>
                </div>

                {/* Player Section */}
                <div className="relative shadow-lg rounded-3xl bg-black overflow-hidden border border-gray-900 aspect-video">
                    {renderPlayer()}
                </div>

                {/* Title & Info */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-black text-gray-900 leading-tight">{video.title}</h1>
                        {isCompleted && (
                            <span className="flex items-center gap-1 text-emerald-500 font-extrabold text-xs bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                <CheckCircle className="w-4 h-4" />
                                Completed
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                        <span>Level: <strong className="text-gray-700 uppercase">{video.level}</strong></span>
                        <span>•</span>
                        <span>Views: <strong>{video.viewCount}</strong></span>
                        <span>•</span>
                        <span>Duration: <strong>{video.duration} mins</strong></span>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed pt-2 border-t border-gray-100">
                        {video.content || 'Start watching to track your progress and work towards obtaining a certificate.'}
                    </p>
                </div>
            </div>

            {/* Sidebar Instructor Panel */}
            <div className="space-y-6">
                <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="font-extrabold text-gray-900 text-sm">Instructor</h3>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {video.author?.name ? video.author.name.charAt(0) : 'M'}
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">{video.author?.name || 'MatsyaLink Expert'}</h4>
                            <p className="text-[10px] font-semibold text-gray-400">Aquaculture Specialist</p>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        {video.author?.bio || 'Certified fisheries training consultants publishing official aquaculture guides.'}
                    </p>
                </div>

                <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50 space-y-3">
                    <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-600" />
                        Certification
                    </h4>
                    <p className="text-xs text-blue-700 leading-relaxed">
                        Complete this video and pass the corresponding quiz to receive your verified digital Certificate.
                    </p>
                    <Link 
                        to="/learning/quizzes"
                        className="w-full text-center py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-blue-700 transition-all block"
                    >
                        Go to Quizzes
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VideoDetail;
