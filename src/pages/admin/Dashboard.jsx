import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { 
    User as UserIcon, Package, MessageSquare, ShieldCheck, 
    Check, X, AlertCircle, BarChart3, Users, ThumbsUp, ThumbsDown, Image, Clock
} from 'lucide-react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const { t, language, formatDigit } = useLanguage();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [pendingListings, setPendingListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const [statsRes, usersRes, pendingRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/stats', { headers: { 'x-auth-token': token } }),
                axios.get('http://localhost:5000/api/admin/users', { headers: { 'x-auth-token': token } }),
                axios.get('http://localhost:5000/api/admin/pending-listings', { headers: { 'x-auth-token': token } })
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setPendingListings(pendingRes.data);
        } catch (err) {
            toast.error(t.loadFail);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyUser = async (userId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/admin/users/${userId}/verify`, {}, { headers: { 'x-auth-token': token } });
            toast.success(t.updateSuccess);
            fetchData();
        } catch (err) { toast.error(t.updateFail); }
    };

    const handleApproveListing = async (listingId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/admin/listings/${listingId}/approve`, {}, { headers: { 'x-auth-token': token } });
            toast.success(t.updateSuccess);
            fetchData();
        } catch (err) { toast.error(t.updateFail); }
    };

    const handleRejectListing = async (listingId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/admin/listings/${listingId}/reject`, {}, { headers: { 'x-auth-token': token } });
            toast.success(t.updateSuccess);
            fetchData();
        } catch (err) { toast.error(t.updateFail); }
    };

    const handleApproveUser = async (userId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/admin/users/${userId}/status`, { accountStatus: 'active' }, { headers: { 'x-auth-token': token } });
            toast.success(t.updateSuccess);
            fetchData();
        } catch (err) { toast.error(t.updateFail); }
    };

    const handleRejectUser = async (userId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/admin/users/${userId}/status`, { accountStatus: 'suspended' }, { headers: { 'x-auth-token': token } });
            toast.success(t.updateSuccess);
            fetchData();
        } catch (err) { toast.error(t.updateFail); }
    };

    const handleUpdateStatus = async (userId, status) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/admin/users/${userId}/status`, { accountStatus: status }, { headers: { 'x-auth-token': token } });
            toast.success(t.updateSuccess);
            fetchData();
        } catch (err) { toast.error(t.updateFail); }
    };

    if (loading) return <div className="flex justify-center items-center h-96 animate-pulse text-primary font-black text-xl">{t.dataLoading}</div>;

    const StatsView = () => (
        <div className="space-y-12">
            <header className="space-y-2">
                <h1 className="text-4xl font-black text-gray-900 leading-tight">{t.adminStats.split(' ')[0]} <span className="text-primary">{t.adminStats.split(' ')[1] || ''}</span></h1>
                <p className="text-gray-500 font-medium">{t.adminStatsDesc}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: t.totalUsers, value: stats?.totalUsers || 0, icon: <Users size={24} />, col: 'bg-blue-600 shadow-blue-500/20' },
                    { label: t.totalListings, value: stats?.totalListings || 0, icon: <Package size={24} />, col: 'bg-green-600 shadow-green-500/20' },
                    { label: t.activePosts, value: stats?.activePosts || 0, icon: <MessageSquare size={24} />, col: 'bg-purple-600 shadow-purple-500/20' },
                    { label: t.verifiedUsers, value: stats?.verifiedUsers || 0, icon: <ShieldCheck size={24} />, col: 'bg-orange-600 shadow-orange-500/20' },
                ].map((stat, i) => (
                    <div key={i} className={`rounded-[2rem] p-8 text-white ${stat.col} shadow-2xl relative overflow-hidden group transition-all hover:scale-[1.02]`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 transform group-hover:scale-[2] transition-transform duration-500">
                            {stat.icon}
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest opacity-80">{stat.label}</p>
                        <p className="text-5xl font-black mt-4">{formatDigit(stat.value)}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                        <AlertCircle size={40} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">{t.pendingApprovals}</h2>
                        <p className="text-gray-500 font-bold">{formatDigit(stats?.pendingApprovals || 0)} {t.waitingApproval}</p>
                    </div>
                    <Link to="/listings" className="text-primary font-black hover:underline underline-offset-8">{t.goToListingsDashboard}</Link>
                </div>
            </div>
        </div>
    );

    const UsersView = () => (
        <div className="space-y-8">
            <header className="space-y-2">
                <h1 className="text-4xl font-black text-gray-900 leading-tight">{t.userManagement.split(' ')[0]} <span className="text-primary">{t.userManagement.split(' ')[1] || ''}</span></h1>
                <p className="text-gray-500 font-medium">{t.userManagementDesc}</p>
            </header>

            <div className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">{t.userInfoTable}</th>
                                <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">{t.roleTable}</th>
                                <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">{t.statusTable}</th>
                                <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">{t.actionTable}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((u) => (
                                <tr key={u._id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xl uppercase overflow-hidden ring-2 ring-white">
                                                {u.profilePicture ? <img src={u.profilePicture} className="w-full h-full object-cover" /> : u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-black text-gray-900 flex items-center gap-2">
                                                    {u.name}
                                                    {u.verifiedStatus && <ShieldCheck size={16} className="text-primary" />}
                                                </div>
                                                <div className="text-xs text-gray-400 font-bold tracking-tight">{formatDigit(u.phone)} • {t.districts?.[u.district] || u.district}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            u.role === 'farmer' ? 'bg-blue-50 text-blue-700' :
                                            u.role === 'seller' ? 'bg-green-50 text-green-700' :
                                            'bg-purple-50 text-purple-700'
                                        }`}>
                                            {u.role === 'farmer' ? t.farmer : u.role === 'seller' ? t.seller : t.trader}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${u.accountStatus === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                            <span className="font-bold text-gray-700 capitalize">{u.accountStatus === 'active' ? t.active : u.accountStatus === 'pending' ? t.pending : t.suspended}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            {/* Approve / Reject for pending users */}
                                            {u.accountStatus === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApproveUser(u._id)}
                                                        className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm text-xs font-bold"
                                                        title="Approve User"
                                                    >
                                                        <ThumbsUp size={14} /> {t.approve}
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectUser(u._id)}
                                                        className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm text-xs font-bold"
                                                        title="Reject User"
                                                    >
                                                        <ThumbsDown size={14} /> {t.reject}
                                                    </button>
                                                </>
                                            )}

                                            {/* For active/suspended users — verify and toggle status */}
                                            {u.accountStatus !== 'pending' && (
                                                <>
                                                    {!u.verifiedStatus && u.role !== 'admin' && (
                                                        <button onClick={() => handleVerifyUser(u._id)} className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm text-xs font-bold">
                                                            <Check size={14} /> {t.verify}
                                                        </button>
                                                    )}
                                                    {u.role !== 'admin' && (
                                                        <button onClick={() => handleUpdateStatus(u._id, u.accountStatus === 'active' ? 'suspended' : 'active')} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all shadow-sm text-xs font-bold ${u.accountStatus === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'}`}>
                                                            <X size={14} /> {u.accountStatus === 'active' ? t.suspend : t.active}
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const ListingApprovalsView = () => (
        <div className="space-y-8">
            <header className="space-y-2">
                <h1 className="text-4xl font-black text-gray-900 leading-tight">{t.listingApprovalsTable.split(' ')[0]} <span className="text-primary">{t.listingApprovalsTable.split(' ')[1] || ''}</span></h1>
                <p className="text-gray-500 font-medium">{t.listingApprovalsDesc}</p>
            </header>

            <div className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">{t.listingInfoTable}</th>
                                <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">{t.postedByTable}</th>
                                <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">{t.dateTable}</th>
                                <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">{t.actionTable}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {pendingListings.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-10 text-gray-500 font-medium">{t.noPendingListings}</td>
                                </tr>
                            ) : (
                                pendingListings.map((listing) => (
                                    <tr key={listing._id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xl uppercase overflow-hidden ring-2 ring-white">
                                                    {listing.photos && listing.photos.length > 0 ? <img src={listing.photos[0]} className="w-full h-full object-cover" alt={listing.productName} /> : <Image size={24} />}
                                                </div>
                                                <div>
                                                    <div className="font-black text-gray-900">{listing.productName}</div>
                                                    <div className="text-xs text-gray-400 font-bold tracking-tight">{listing.category} • {language === 'bn' ? 'টাকা' : '₹'}{formatDigit(listing.price)}/{listing.unit}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2">
                                                <UserIcon size={16} className="text-gray-400" />
                                                <span className="font-bold text-gray-700">{formatDigit(listing.phoneNumber)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-gray-400" />
                                                <span className="font-bold text-gray-700">{new Date(listing.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : language === 'hi' ? 'hi-IN' : 'en-IN')}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleApproveListing(listing._id)}
                                                    className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm text-xs font-bold"
                                                    title="Approve Listing"
                                                >
                                                    <ThumbsUp size={14} /> {t.approve}
                                                </button>
                                                <button
                                                    onClick={() => handleRejectListing(listing._id)}
                                                    className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm text-xs font-bold"
                                                    title="Reject Listing"
                                                >
                                                    <ThumbsDown size={14} /> {t.reject}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full">
            <Routes>
                <Route path="/" element={<UsersView />} />
                <Route path="/stats" element={<StatsView />} />
                <Route path="/listings-approval" element={<ListingApprovalsView />} />
                <Route path="*" element={<div className="text-center py-20 font-black text-2xl text-gray-300">{t.adminPageNotFound}</div>} />
            </Routes>
        </div>
    );
};

export default AdminDashboard;
