import React, { useState, useEffect } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, 
    PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer 
} from 'recharts';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Users, ShieldCheck, Clock, AlertCircle, Phone, MessageCircle, MousePointerClick, User as UserIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const COLORS = ['#0066cc', '#33bbff', '#ff9900', '#10b981', '#8b5cf6'];
const CONTACT_COLORS = ['#0284c7', '#10b981'];

const AdminAnalytics = () => {
    const [data, setData] = useState(null);
    const [clickStats, setClickStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { formatDigit } = useLanguage();

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [analyticsRes, clicksRes] = await Promise.all([
                    api.get('/admin/users/analytics'),
                    api.get('/contact-clicks/stats')
                ]);
                setData(analyticsRes.data);
                setClickStats(clicksRes.data);
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

    const contactTypeData = [
        { name: 'Call Now', value: clickStats?.totalCallClicks || 0 },
        { name: 'WhatsApp', value: clickStats?.totalWhatsappClicks || 0 }
    ];

    return (
        <div className="space-y-12">
            <header>
                <h1 className="text-4xl font-black text-gray-900 leading-tight">Platform <span className="text-primary">Analytics</span></h1>
                <p className="text-gray-500 font-medium mt-2">Comprehensive overview of user distribution, growth, and contact button engagements.</p>
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

            {/* --- CALL NOW & WHATSAPP BUTTON CLICK ANALYTICS SECTION --- */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <MousePointerClick size={22} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">User Contact Button Clicks</h2>
                        <p className="text-xs font-medium text-gray-500">Track how many users click Call Now and WhatsApp buttons to connect with sellers</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-cyan-600 to-blue-700 text-white p-6 rounded-[2.5rem] shadow-xl shadow-cyan-600/10 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest opacity-80">Call Now Clicks</p>
                            <p className="text-4xl font-black mt-2">{formatDigit(clickStats?.totalCallClicks || 0)}</p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <Phone size={28} />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 rounded-[2.5rem] shadow-xl shadow-emerald-600/10 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest opacity-80">WhatsApp Clicks</p>
                            <p className="text-4xl font-black mt-2">{formatDigit(clickStats?.totalWhatsappClicks || 0)}</p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <MessageCircle size={28} />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-6 rounded-[2.5rem] shadow-xl shadow-purple-600/10 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest opacity-80">Total Contact Clicks</p>
                            <p className="text-4xl font-black mt-2">{formatDigit(clickStats?.totalClicks || 0)}</p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <MousePointerClick size={28} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Button Distribution Donut Chart */}
                    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col justify-between">
                        <h3 className="text-xl font-black text-gray-900 mb-4">Call vs WhatsApp Share</h3>
                        <div className="h-[260px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={contactTypeData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={6} dataKey="value">
                                        {contactTypeData.map((entry, index) => (
                                            <Cell key={`contact-cell-${index}`} fill={CONTACT_COLORS[index]} />
                                        ))}
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

                    {/* Contact Clicks 30-Day Trend Chart */}
                    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 lg:col-span-2">
                        <h3 className="text-xl font-black text-gray-900 mb-4">Contact Clicks Trend (30 Days)</h3>
                        <div className="h-[260px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={clickStats?.trend || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid stroke="#f3f4f6" strokeDasharray="5 5" vertical={false} />
                                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                                    <RechartsTooltip 
                                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Legend wrapperStyle={{ fontWeight: 'bold', fontSize: '12px' }} />
                                    <Bar dataKey="call" name="Call Now" fill="#0284c7" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="whatsapp" name="WhatsApp" fill="#10b981" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent Contact Button Clicks Table */}
                <div className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-black text-gray-900">Recent Contact Click Activity</h3>
                            <p className="text-xs font-medium text-gray-400 mt-1">Real-time log of users clicking Call Now or WhatsApp buttons</p>
                        </div>
                        <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider">
                            Latest {clickStats?.recentClicks?.length || 0} clicks
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">User</th>
                                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Action</th>
                                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Target Phone</th>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {!clickStats?.recentClicks || clickStats.recentClicks.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-12 text-gray-400 font-bold">
                                            No contact button clicks recorded yet.
                                        </td>
                                    </tr>
                                ) : (
                                    clickStats.recentClicks.map((click) => (
                                        <tr key={click._id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-base overflow-hidden ring-2 ring-white">
                                                        {click.userId?.profilePicture ? (
                                                            <img loading="lazy" src={click.userId.profilePicture} className="w-full h-full object-cover" alt="" />
                                                        ) : (
                                                            click.userId?.name?.charAt(0) || <UserIcon size={18} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-gray-900 text-sm">
                                                            {click.userId?.name || 'Guest / Unregistered User'}
                                                        </div>
                                                        <div className="text-xs text-gray-400 font-medium">
                                                            {click.userId?.phone ? formatDigit(click.userId.phone) : 'Phone unavailable'} • {click.userId?.role || 'User'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                                    click.type === 'call' ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                }`}>
                                                    {click.type === 'call' ? <Phone size={14} /> : <MessageCircle size={14} />}
                                                    {click.type === 'call' ? 'Call Now' : 'WhatsApp'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-700 text-sm">
                                                {click.targetPhone ? formatDigit(click.targetPhone) : '—'}
                                            </td>
                                            <td className="px-8 py-4 text-right text-xs font-medium text-gray-400">
                                                {new Date(click.createdAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- USER DEMOGRAPHICS & TRENDS SECTION --- */}
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
