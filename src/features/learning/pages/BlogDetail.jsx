import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getContentDetails, trackProgress } from '../api/learningApi';
import { Calendar, User, Eye, ChevronRight, Moon, Sun, Printer, Share2 } from 'lucide-react';

const BlogDetail = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const res = await getContentDetails(slug);
                if (res.data.success) {
                    setBlog(res.data.data);
                    // Automatically track viewed history
                    await trackProgress({
                        contentId: res.data.data._id,
                        progress: 100,
                        watchedSeconds: 0,
                        lastPosition: 0
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [slug]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: blog.title,
                url: window.location.href
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Blog link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-2/3" />
                <div className="h-6 bg-gray-200 rounded w-1/4" />
                <div className="h-64 bg-gray-100 rounded-3xl" />
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500 font-bold">Blog not found</p>
                <Link to="/learning/blogs" className="text-primary font-bold mt-2 inline-block">Back to Blogs</Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                    <Link to="/learning" className="hover:text-primary">Learning Hub</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <Link to="/learning/blogs" className="hover:text-primary">Blogs</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-gray-900 truncate max-w-[200px]">{blog.title}</span>
                </div>

                {/* Control bar */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {blog.author?.name || 'Writer'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(blog.publishAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {blog.viewCount} views</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                            title="Toggle Reader Mode"
                        >
                            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                        <button 
                            onClick={handleShare}
                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                            title="Share Link"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => window.print()}
                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                            title="Print Blog"
                        >
                            <Printer className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Blog content proper */}
                <article className={`p-8 rounded-3xl border transition-colors duration-300 leading-relaxed font-serif text-base print:border-0 print:p-0 ${
                    darkMode 
                        ? 'bg-gray-900 text-gray-100 border-gray-800' 
                        : 'bg-white text-gray-800 border-gray-100 shadow-sm'
                }`}>
                    <h1 className="text-3xl font-black font-sans leading-tight mb-6">{blog.title}</h1>
                    
                    {blog.thumbnail && (
                        <img 
                            src={blog.thumbnail} 
                            alt={blog.title} 
                            className="w-full rounded-2xl mb-6 aspect-video object-cover"
                        />
                    )}

                    <div 
                        className="space-y-4 prose max-w-none text-sm"
                        dangerouslySetInnerHTML={{ __html: blog.content }} 
                    />
                </article>
            </div>

            {/* Author Sidebar */}
            <div className="space-y-6">
                <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="font-extrabold text-gray-900 text-sm">Author</h3>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {blog.author?.name ? blog.author.name.charAt(0) : 'E'}
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">{blog.author?.name || 'MatsyaLink Author'}</h4>
                            <p className="text-[10px] font-semibold text-gray-400">Aquaculture Blogger</p>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        {blog.author?.bio || 'Regular field updates, innovation spotlights, and case studies detailing farming benchmarks.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
