import React, { useState, useEffect } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, 
    PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer 
} from 'recharts';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Users, ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const COLORS = ['#0066cc', '#33bbff', '#ff9900', '#10b981', '#8b5cf6'];

const AdminAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { formatDigit } = useLanguage();

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/admin/users/analytics');
                setData(res.data);
            } catch (err) {
                toast.error("Failed to load analytics");
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div className="py-20 text-center text-primary font-black animate-pulse text-xl">Loading Analytics...</div>;
    if (!data) return null;

    // Format Pie Chart Data
    const roleData = Object.entries(data.byRole).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-4xl font-black text-gray-900 leading-tight">Platform <span className="text-primary">Analytics</span></h1>
                <p className="text-gray-500 font-medium mt-2">Comprehensive overview of user distribution and growth.</p>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><Users size={28} /></div>
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Users</p>
                        <p className="text-3xl font-black text-gray-900">{formatDigit(data.total)}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center"><ShieldCheck size={28} /></div>
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Verified Users</p>
                        <p className="text-3xl font-black text-gray-900">{formatDigit(data.byStatus.verified)}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center"><Clock size={28} /></div>
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Pending Verification</p>
                        <p className="text-3xl font-black text-gray-900">{formatDigit(data.byStatus.pending)}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center"><AlertCircle size={28} /></div>
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Suspended / Rejected</p>
                        <p className="text-3xl font-black text-gray-900">{formatDigit(data.byStatus.suspended + data.byStatus.rejected)}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Role Distribution Pie Chart */}
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                    <h3 className="text-xl font-black text-gray-900 mb-6">User Types Distribution</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={roleData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                                    {roleData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <RechartsTooltip 
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ fontWeight: 'bold', fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Registration Trend Line Chart */}
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                    <h3 className="text-xl font-black text-gray-900 mb-6">Registration Trend (12 Months)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.registrationTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <Line type="monotone" dataKey="count" stroke="#0066cc" strokeWidth={4} dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 8 }} />
                                <CartesianGrid stroke="#f3f4f6" strokeDasharray="5 5" />
                                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip 
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                    cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* State Distribution Bar Chart */}
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="text-xl font-black text-gray-900 mb-6">State-wise Distribution</h3>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.byState} margin={{ top: 5, right: 20, bottom: 40, left: 0 }}>
                                <CartesianGrid stroke="#f3f4f6" strokeDasharray="5 5" vertical={false} />
                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} angle={-45} textAnchor="end" />
                                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip 
                                    cursor={{ fill: '#f9fafb' }}
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="count" fill="#33bbff" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
