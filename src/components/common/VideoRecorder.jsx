import React, { useRef, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const VideoRecorder = ({ onRecordingComplete }) => {
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [recording, setRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [stream, setStream] = useState(null);
    const [timeLeft, setTimeLeft] = useState(10);

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            toast.error("Could not access camera. Please check permissions.");
        }
    };

    const startRecording = () => {
        if (!stream) return;

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        const chunks = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunks.push(e.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            setRecordedBlob(blob);
            onRecordingComplete(blob);
        };

        mediaRecorder.start();
        setRecording(true);
        setTimeLeft(10);

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    stopRecording();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        setRecording(false);
    };

    const reset = () => {
        setRecordedBlob(null);
        setTimeLeft(10);
    };

    return (
        <div className="flex flex-col items-center space-y-4 p-4 border rounded-xl bg-gray-50">
            {!stream ? (
                <button 
                    onClick={startCamera}
                    className="btn btn-primary px-6"
                >
                    Enable Camera
                </button>
            ) : (
                <>
                    <div className="relative w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden border-4 border-white shadow-lg">
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            muted 
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        {recording && (
                            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse flex items-center">
                                <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                                REC {timeLeft}s
                            </div>
                        )}
                    </div>

                    {!recordedBlob ? (
                        <button 
                            disabled={recording}
                            onClick={startRecording}
                            className={`btn ${recording ? 'bg-gray-400' : 'btn-primary'} px-8 flex items-center space-x-2`}
                        >
                            <span>{recording ? 'Recording...' : 'Start 10s Recording'}</span>
                        </button>
                    ) : (
                        <div className="flex flex-col items-center space-y-2">
                            <p className="text-green-600 font-medium flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Video Recorded Successfully!
                            </p>
                            <div className="flex space-x-2">
                                <button onClick={reset} className="text-sm text-gray-500 underline">Record Again</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default VideoRecorder;
