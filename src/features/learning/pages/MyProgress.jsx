import React, { useState, useEffect } from 'react';
import { getProgressStats } from '../api/learningApi';
import { Activity, Award, Flame, BookOpen } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

const MyProgress = () => {
    const { t, formatDigit } = useLanguage();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const res = await getProgressStats();
                if (res.data.success) {
                    setStats(res.data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-12 text-center animate-pulse">{t.lh_loading || 'Loading progress analytics...'}</div>;

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-primary" />
                    {t.lh_nav_my_progress || 'My Learning Progress'}
                </h1>
                <p className="text-xs font-semibold text-gray-500">
                    {t.lh_my_progress_subtitle || 'Track overall completed lectures, stats, and learning streaks.'}
                </p>
            </div>

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Streak card */}
                    <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center text-xl">
                            🔥
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">{t.lh_learning_streak || 'Learning Streak'}</span>
                            <h3 className="text-2xl font-black text-gray-900">{formatDigit(stats.learningStreak || 0)} {t.lh_days || 'Days'}</h3>
                        </div>
                    </div>

                    {/* Completed card */}
                    <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">{t.lh_lectures_completed || 'Lectures Completed'}</span>
                            <h3 className="text-2xl font-black text-gray-900">{formatDigit(stats.completedCount || 0)} {t.lh_items || 'Items'}</h3>
                        </div>
                    </div>

                    {/* In progress card */}
                    <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-primary rounded-2xl flex items-center justify-center">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">{t.lh_active_courses || 'Active Courses'}</span>
                            <h3 className="text-2xl font-black text-gray-900">{formatDigit(stats.inProgressCount || 0)} {t.lh_modules || 'Modules'}</h3>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyProgress;
