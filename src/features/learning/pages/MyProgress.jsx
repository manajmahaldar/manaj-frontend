import React, { useState, useEffect } from 'react';
import { getProgressStats } from '../api/learningApi';
import { Activity, Award, Flame, BookOpen } from 'lucide-react';

const MyProgress = () => {
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

    if (loading) return <div className="p-12 text-center">Loading progress analytics...</div>;

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-primary" />
                    My Learning Progress
                </h1>
                <p className="text-xs font-semibold text-gray-500">
                    Track overall completed lectures, stats, and learning streaks.
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
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Learning Streak</span>
                            <h3 className="text-2xl font-black text-gray-900">{stats.learningStreak || 0} Days</h3>
                        </div>
                    </div>

                    {/* Completed card */}
                    <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Lectures Completed</span>
                            <h3 className="text-2xl font-black text-gray-900">{stats.completedCount || 0} Items</h3>
                        </div>
                    </div>

                    {/* In progress card */}
                    <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-primary rounded-2xl flex items-center justify-center">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Active Courses</span>
                            <h3 className="text-2xl font-black text-gray-900">{stats.inProgressCount || 0} Modules</h3>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyProgress;
