import React, { useState, useEffect } from 'react';
import { getWebinars } from '../api/learningApi';
import { Award, Clock, ArrowRight, Play, CheckCircle } from 'lucide-react';

const TrainingPrograms = () => {
    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                setLoading(true);
                const res = await getWebinars();
                if (res.data.success) {
                    const programs = (res.data.data || []).filter(item => item.type === 'training_program' || item.type === 'webinar');
                    setTrainings(programs);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrainings();
    }, []);

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <Award className="w-6 h-6 text-primary" />
                    Government Training Programs
                </h1>
                <p className="text-xs font-semibold text-gray-500">
                    Register for offline/online government aquaculture bootcamps and vocational training courses.
                </p>
            </div>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {Array(2).fill(0).map((_, i) => (
                        <div key={i} className="h-32 bg-gray-100 rounded-3xl" />
                    ))}
                </div>
            ) : trainings.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center max-w-2xl mx-auto shadow-sm space-y-4">
                    <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center text-2xl mx-auto">
                        🎓
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-lg">No Active Training Batches</h3>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-md mx-auto">
                        There are currently no active government training cycles open for registrations. Browse our video library to learn at your own pace.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {trainings.map(t => (
                        <div key={t._id} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div className="space-y-3">
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase rounded-full border border-emerald-100">
                                    Certified Training
                                </span>
                                <h3 className="font-extrabold text-gray-900 text-base">{t.title}</h3>
                                <p className="text-xs text-gray-500 font-semibold">Instructor: {t.instructor}</p>
                                <p className="text-xs text-gray-500 line-clamp-2">{t.description}</p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-4">
                                <div className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-primary" />
                                    {new Date(t.scheduledDate).toLocaleDateString()}
                                </div>
                                <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-xl flex items-center gap-1">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    Open Batch
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TrainingPrograms;
