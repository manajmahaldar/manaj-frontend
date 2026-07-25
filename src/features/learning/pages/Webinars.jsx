import React, { useState, useEffect } from 'react';
import { getWebinars } from '../api/learningApi';
import { Calendar, Video, Clock, Users, ArrowRight, UserCheck } from 'lucide-react';

const Webinars = () => {
    const [webinars, setWebinars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWebinars = async () => {
            try {
                setLoading(true);
                const res = await getWebinars();
                if (res.data.success) {
                    setWebinars(res.data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchWebinars();
    }, []);

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-primary" />
                    Live Webinars & Virtual Sessions
                </h1>
                <p className="text-xs font-semibold text-gray-500">
                    Interact directly with government researchers and seasoned breeders during live virtual seminars.
                </p>
            </div>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {Array(2).fill(0).map((_, i) => (
                        <div key={i} className="h-32 bg-gray-100 rounded-3xl" />
                    ))}
                </div>
            ) : webinars.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center max-w-2xl mx-auto shadow-sm space-y-4">
                    <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center text-2xl mx-auto">
                        📡
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-lg">No Live Broadcasts Scheduled</h3>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-md mx-auto">
                        We are coordinating with ministry panels for our next live webinar series. Check notifications for upcoming dates.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {webinars.map(webinar => (
                        <div key={webinar._id} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="px-3 py-1 bg-purple-50 text-purple-700 text-[10px] font-extrabold uppercase rounded-full border border-purple-100">
                                        {webinar.type === 'training_program' ? 'Training Program' : 'Live Webinar'}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400">
                                        Max: {webinar.maxRegistrations || 100} Seats
                                    </span>
                                </div>
                                <h3 className="font-extrabold text-gray-900 text-base">{webinar.title}</h3>
                                <p className="text-xs text-gray-500 font-semibold">Instructor: {webinar.instructor}</p>
                                <p className="text-xs text-gray-500 line-clamp-2">{webinar.description}</p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-4">
                                <div className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-primary" />
                                    {new Date(webinar.scheduledDate).toLocaleString()}
                                </div>

                                {webinar.meetingUrl ? (
                                    <a 
                                        href={webinar.meetingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-xl flex items-center gap-1 hover:bg-blue-700"
                                    >
                                        <Video className="w-3.5 h-3.5" />
                                        Join Session
                                    </a>
                                ) : (
                                    <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-xl">
                                        Scheduled
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Webinars;
