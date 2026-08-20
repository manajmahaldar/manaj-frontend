import { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import { 
    User as UserIcon, Package, MessageSquare, ShieldCheck, 
    Check, X, AlertCircle, BarChart3, Users, ThumbsUp, ThumbsDown, Image, Clock, Trash2, Eye, Flag, Mic
} from 'lucide-react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';
import MediaManager from './MediaManager';
import UserManagement from './UserManagement';
import AdminAnalytics from './AdminAnalytics';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const { t, language, formatDigit } = useLanguage();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [pendingRegistrationsCount, setPendingRegistrationsCount] = useState(0);
    const [pendingListings, setPendingListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectionReason, setRejectionReason] = useState("");
    const [rejectingUserId, setRejectingUserId] = useState(null);
    const [rejectingItemId, setRejectingItemId] = useState(null);
    const [itemRejectionReason, setItemRejectionReason] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const location = useLocation();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes, pendingRes, pendingUsersRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users'),
                api.get('/admin/pending-listings'),
                api.get('/admin/pending-users')
            ]);
            setStats(statsRes.data);
            // Handle the updated API response which now returns { users: [...], total, page... }
            setUsers(usersRes.data.users || usersRes.data || []);
            setPendingListings(pendingRes.data);
            // New API returns { users: [...], pendingRegistrationsCount: N }
            setPendingUsers(pendingUsersRes.data?.users || []);
            setPendingRegistrationsCount(pendingUsersRes.data?.pendingRegistrationsCount || 0);
        } catch (err) {
            toast.error(t.loadFail);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyUser = async (userId) => {
        try {
            await api.put(`/admin/users/${userId}/verify`, {});
            toast.success(t.updateSuccess);
            fetchData();
        } catch (err) { toast.error(t.updateFail); }
    };

    const handleApproveVerification = async (userId) => {
        try {
            await api.put(`/admin/users/${userId}/approve-verification`, {});
            toast.success("User verified and activated!");
            fetchData();
        } catch (err) { toast.error("Failed to approve verification"); }
    };

    const startSpeechRecognition = (setValue) => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error("Speech recognition is not supported in this browser. Please use Google Chrome.");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'bn' ? 'bn-BD' : language === 'hi' ? 'hi-IN' : 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        toast.success("Listening... Please speak now.");

        recognition.onresult = (event) => {
            const speechToText = event.results[0][0].transcript;
            setValue(prev => prev ? prev + " " + speechToText : speechToText);
            toast.success("Voice capture successful!");
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            toast.error("Voice capture failed. Please try again.");
        };

        recognition.start();
    };

    const handleRejectVerification = async () => {
        if (!rejectionReason) return toast.error("Please provide a reason");
        try {
            await api.put(`/admin/users/${rejectingUserId}/reject-verification`, { reason: rejectionReason });
            toast.success("Verification rejected and notified");
            setRejectingUserId(null);
            setRejectionReason("");
            fetchData();
        } catch (err) { toast.error("Failed to reject verification"); }
    };

    const handleApproveListing = async (itemId, type = 'listing') => {
        try {
            const url = type === 'listing' ? `/admin/listings/${itemId}/approve` : `/admin/posts/${itemId}/approve`;
            await api.put(url, {});
            toast.success(t.updateSuccess);
            fetchData();
        } catch (err) { toast.error(t.updateFail); }
    };

    const handleRejectListing = async (itemId, type = 'listing') => {
        setRejectingItemId(itemId);
        setItemRejectionReason("");
    };

    const handleRejectListingConfirm = async (itemId, type = 'listing') => {
        if (!itemRejectionReason.trim()) {
            return toast.error("Please provide a reason for rejection");
        }
        try {
            const url = type === 'listing' ? `/admin/listings/${itemId}/reject` : `/admin/posts/${itemId}/reject`;
            await api.put(url, { reason: itemRejectionReason });
            toast.success(t.updateSuccess);
            setRejectingItemId(null);
            setItemRejectionReason("");
            fetchData();
        } catch (err) { toast.error(t.updateFail); }
    };

    const handleApproveUser = async (userId) => {
        try {
            await api.put(`/admin/users/${userId}/status`, { accountStatus: 'active' });
            toast.success(t.updateSuccess);
            fetchData();
        } catch (err) { toast.error(t.updateFail); }
    };

    const handleRejectUser = async (userId) => {
        try {
            await api.put(`/admin/users/${userId}/status`, { accountStatus: 'suspended' });
            toast.success(t.updateSuccess);
            fetchData();
        } catch (err) { toast.error(t.updateFail); }
    };

    const handleUpdateStatus = async (userId, status) => {
        try {
            await api.put(`/admin/users/${userId}/status`, { accountStatus: status });
            toast.success(t.updateSuccess);
            fetchData();
        } catch (err) { toast.error(t.updateFail); }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to PERMANENTLY remove this user and all their data? This cannot be undone.")) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            toast.success("User removed successfully");
            fetchData();
        } catch (err) {
            toast.error("Failed to remove user");
        }
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
                    <Link to="/admin/dashboard/listings-approval" className="text-primary font-black hover:underline underline-offset-8">Review Pending Items</Link>
                </div>
                <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <ShieldCheck size={40} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Pending Verifications</h2>
                        <p className="text-gray-500 font-bold">
                            <span className="text-blue-600">{formatDigit(pendingUsers.length)}</span> submitted docs &amp; awaiting review
                        </p>
                        {pendingRegistrationsCount > 0 && (
                            <p className="text-orange-500 font-bold text-sm mt-1">
                                {formatDigit(pendingRegistrationsCount)} registered but haven't submitted documents yet
                            </p>
                        )}
                    </div>
                    <Link to="/admin/dashboard/user-verification" className="text-primary font-black hover:underline underline-offset-8">Verify Users Now</Link>
                </div>
            </div>
        </div>
    );

    const UserVerificationView = () => (
        <div className="space-y-8">
            <header className="space-y-2">
                <h1 className="text-4xl font-black text-gray-900 leading-tight">User <span className="text-primary">Verification</span></h1>
                <p className="text-gray-500 font-medium">Review submitted Aadhaar cards and live videos to grant access.</p>
            </header>

            {pendingRegistrationsCount > 0 && (
                <div className="bg-orange-50 border border-orange-100 rounded-[2rem] p-6 flex items-start gap-4">
                    <AlertCircle className="text-orange-500 shrink-0 mt-1" size={22} />
                    <div>
                        <p className="font-black text-orange-900 text-sm">{formatDigit(pendingRegistrationsCount)} user(s) registered but haven't submitted verification documents yet.</p>
                        <p className="text-orange-700 text-xs mt-1">They will appear here once they upload their Aadhaar card and record a verification video on the <strong>/verification</strong> page.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-8">
                {pendingUsers.length === 0 ? (
                    <div className="py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
                        <ShieldCheck size={48} className="text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold text-lg">No pending user profiles awaiting approval.</p>
                        <p className="text-gray-300 font-medium text-sm mt-2">All registered users have been reviewed and processed.</p>
                    </div>
                ) : (
                    pendingUsers.map(u => (
                        <div key={u._id} className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-gray-100 grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
                            {/* User Info */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center overflow-hidden ring-4 ring-white shadow-lg">
                                        {u.profilePicture ? <img loading="lazy" src={u.profilePicture} className="w-full h-full object-cover" alt={`${u.name}'s profile`} /> : <UserIcon size={32} className="text-gray-300" />}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900">{u.name}</h3>
                                        <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">
                                            {u.role === 'farmer' ? t.farmer : 
                                             u.role === 'seller' ? t.seller : 
                                             u.role === 'hatchery' ? t.hatchery : 
                                             u.role === 'delivery_partner' ? (t.deliveryPartner || 'Delivery Partner') : 
                                             t.trader}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-600 font-medium bg-gray-50 p-4 rounded-2xl">
                                        <Clock size={18} className="text-primary" />
                                        <span>{new Date(u.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-600 font-medium bg-gray-50 p-4 rounded-2xl">
                                        <AlertCircle size={18} className="text-primary mt-1" />
                                        <div className="flex flex-col text-sm space-y-1">
                                            <span><strong>Phone:</strong> {u.phone || 'Not provided'}</span>
                                            <span><strong>Email:</strong> {u.email || 'Not provided'}</span>
                                            <span><strong>State:</strong> {u.district || 'Not provided'}</span>
                                            <span><strong>District:</strong> {u.localDistrict || 'Not provided'}</span>
                                            <span><strong>Police Station:</strong> {u.policeStation || 'Not provided'}</span>
                                        </div>
                                    </div>
                                </div>
                                {rejectingUserId === u._id ? (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                                        <div className="relative">
                                            <textarea 
                                                placeholder="Reason for rejection..."
                                                className="w-full p-4 pr-12 rounded-2xl bg-red-50 border border-red-100 outline-none focus:ring-2 focus:ring-red-400 text-sm font-medium"
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => startSpeechRecognition(setRejectionReason)}
                                                className="absolute right-3 top-3 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                                                title="Speak Rejection Reason"
                                            >
                                                <Mic size={16} />
                                            </button>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={handleRejectVerification} className="btn bg-red-600 text-white flex-grow py-3 rounded-xl font-bold">Confirm Reject</button>
                                            <button onClick={() => setRejectingUserId(null)} className="btn bg-gray-100 text-gray-500 px-6 py-3 rounded-xl font-bold">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-4 pt-4">
                                        <button onClick={() => handleApproveVerification(u._id)} className="btn btn-primary flex-grow py-4 rounded-2xl font-black shadow-lg shadow-primary/25">Approve User</button>
                                        <button onClick={() => setRejectingUserId(u._id)} className="btn bg-red-50 text-red-600 px-8 py-4 rounded-2xl font-black hover:bg-red-600 hover:text-white transition-all">Reject</button>
                                    </div>
                                )}
                            </div>

                            {/* Aadhaar Card */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">Aadhaar Card</h4>
                                {u.aadhaarCard ? (
                                    <div className="rounded-[2rem] overflow-hidden border-4 border-gray-50 shadow-xl group cursor-pointer relative">
                                        <img loading="lazy" src={u.aadhaarCard} alt="Aadhaar" className="w-full aspect-video object-cover transition-transform group-hover:scale-110 duration-500" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <a href={u.aadhaarCard} target="_blank" rel="noreferrer" className="text-white font-black underline">View Full Size</a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-[2rem] border-4 border-dashed border-gray-200 aspect-video flex items-center justify-center bg-gray-50">
                                        <p className="text-gray-400 font-bold text-sm">Aadhaar not submitted</p>
                                    </div>
                                )}
                            </div>

                            {/* Video Verification */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">Verification Video</h4>
                                {u.verificationVideo ? (
                                    <div className="rounded-[2rem] overflow-hidden border-4 border-gray-50 shadow-xl bg-black aspect-video">
                                        <video src={u.verificationVideo} controls className="w-full h-full object-contain" />
                                    </div>
                                ) : (
                                    <div className="rounded-[2rem] border-4 border-dashed border-gray-200 aspect-video flex items-center justify-center bg-gray-50">
                                        <p className="text-gray-400 font-bold text-sm">Video not submitted</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
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
                                                {u.profilePicture ? <img loading="lazy" src={u.profilePicture} className="w-full h-full object-cover" alt={`${u.name}'s profile`} /> : u.name.charAt(0)}
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
                                            u.role === 'hatchery' ? 'bg-cyan-50 text-cyan-700' :
                                            u.role === 'delivery_partner' ? 'bg-amber-50 text-amber-700' :
                                            'bg-purple-50 text-purple-700'
                                        }`}>
                                            {u.role === 'farmer' ? t.farmer : 
                                             u.role === 'seller' ? t.seller : 
                                             u.role === 'hatchery' ? t.hatchery : 
                                             u.role === 'delivery_partner' ? (t.deliveryPartner || 'Delivery Partner') : 
                                             t.trader}
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
                                            {/* Approve / Reject for pending users — redirect to verification tab */}
                                            {u.accountStatus === 'pending' && (
                                                <>
                                                    <button onClick={() => setSelectedUser(u)} className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-200 transition-all shadow-sm text-xs font-bold" title="View Details">
                                                        <Eye size={14} /> {t.view || 'View'}
                                                    </button>
                                                    <Link
                                                        to="/admin/dashboard/user-verification"
                                                        className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm text-xs font-bold"
                                                    >
                                                        <ShieldCheck size={14} /> Review Verification
                                                    </Link>
                                                </>
                                            )}

                                            {/* For active/suspended users — verify and toggle status */}
                                            {u.accountStatus !== 'pending' && (
                                                <>
                                                    <button onClick={() => setSelectedUser(u)} className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-200 transition-all shadow-sm text-xs font-bold" title="View Details">
                                                        <Eye size={14} /> {t.view || 'View'}
                                                    </button>
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
                                                    {u.role !== 'admin' && (
                                                        <button onClick={() => handleDeleteUser(u._id)} className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm text-xs font-bold" title="Delete User">
                                                            <Trash2 size={14} />
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

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[3rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 animate-in fade-in zoom-in-95">
                        <div className="p-8 sm:p-12 space-y-10">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center overflow-hidden ring-4 ring-gray-50 shadow-lg">
                                        {selectedUser.profilePicture ? <img loading="lazy" src={selectedUser.profilePicture} className="w-full h-full object-cover" alt={`${selectedUser.name}'s profile`} /> : <UserIcon size={40} className="text-gray-300" />}
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-gray-900">{selectedUser.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-gray-500 font-bold uppercase tracking-widest text-sm">{selectedUser.role}</span>
                                            {selectedUser.verifiedStatus && <ShieldCheck size={18} className="text-primary" />}
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedUser(null)} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">Contact & Location</h4>
                                    <div className="bg-gray-50 p-6 rounded-[2rem] space-y-3 font-medium text-gray-600">
                                        <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
                                        <p><strong>Email:</strong> {selectedUser.email || 'N/A'}</p>
                                        <p><strong>State:</strong> {selectedUser.district || 'N/A'}</p>
                                        <p><strong>District:</strong> {selectedUser.localDistrict || 'N/A'}</p>
                                        <p><strong>Police Station:</strong> {selectedUser.policeStation || 'N/A'}</p>
                                        <p><strong>Status:</strong> <span className="capitalize">{selectedUser.accountStatus}</span></p>
                                        <p><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                
                                {selectedUser.aadhaarCard && (
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">Aadhaar Card</h4>
                                        <div className="rounded-[2rem] overflow-hidden shadow-lg border-4 border-gray-50 relative group cursor-pointer h-[200px]">
                                            <img loading="lazy" src={selectedUser.aadhaarCard} alt="Aadhaar" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <a href={selectedUser.aadhaarCard} target="_blank" rel="noreferrer" className="text-white font-black underline">View Full Size</a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {selectedUser.verificationVideo && (
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">Verification Video</h4>
                                    <div className="rounded-[2rem] overflow-hidden shadow-lg border-4 border-gray-50 bg-black max-h-[400px]">
                                        <video src={selectedUser.verificationVideo} controls className="w-full h-full object-contain" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const ListingApprovalsView = ({ filterType, customTitle, customDesc }) => {
        const filteredItems = filterType 
            ? pendingListings.filter(item => item.type === filterType) 
            : pendingListings;

        const titleText = customTitle || t.listingApprovalsTable;
        const titleParts = titleText.split(' ');
        const mainTitle = titleParts.slice(0, -1).join(' ') || titleParts[0];
        const highlightTitle = titleParts.length > 1 ? titleParts[titleParts.length - 1] : '';

        return (
            <div className="space-y-8">
                <header className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 leading-tight">
                        {mainTitle} {highlightTitle && <span className="text-primary">{highlightTitle}</span>}
                    </h1>
                    <p className="text-gray-500 font-medium">{customDesc || t.listingApprovalsDesc}</p>
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
                                {filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-10 text-gray-500 font-medium">{t.noPendingListings}</td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item) => (
                                        <React.Fragment key={item._id}>
                                            <tr className={`transition-colors ${item.isFlagged ? 'bg-red-50/50 hover:bg-red-100/50' : 'hover:bg-blue-50/30'}`}>
                                                <td className="px-10 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xl uppercase overflow-hidden ring-2 ring-white">
                                                            {item.photos && item.photos.length > 0 ? <img loading="lazy" src={item.photos[0]} className="w-full h-full object-cover" alt={item.productName || item.fishName} /> : <Image size={24} />}
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-gray-900 flex items-center gap-2">
                                                                {item.productName || item.fishName}
                                                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.type === 'listing' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                                    {item.type === 'listing' ? 'Sale' : 'Buy'}
                                                                </span>
                                                                {item.isFlagged && (
                                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                                                                        <Flag size={10} /> Flagged
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-gray-400 font-bold tracking-tight mt-1">
                                                                {item.category} • {language === 'bn' ? 'টাকা' : '₹'}{formatDigit(item.price || item.buyingPrice)}
                                                                {item.unit ? `/${item.unit}` : ''}
                                                                {item.size ? ` • ${item.size}` : ''}
                                                            </div>
                                                            {item.isFlagged && (
                                                                <div className="text-[10px] text-red-600 font-bold tracking-tight mt-1">
                                                                    Reason: {item.fraudReason}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <UserIcon size={16} className="text-gray-400" />
                                                        <span className="font-bold text-gray-700">{formatDigit(item.phoneNumber)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={16} className="text-gray-400" />
                                                        <span className="font-bold text-gray-700">{new Date(item.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : language === 'hi' ? 'hi-IN' : 'en-IN')}</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleApproveListing(item._id, item.type)}
                                                            className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm text-xs font-bold"
                                                            title="Approve"
                                                        >
                                                            <ThumbsUp size={14} /> {t.approve}
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectListing(item._id, item.type)}
                                                            className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm text-xs font-bold"
                                                            title="Reject"
                                                        >
                                                            <ThumbsDown size={14} /> {t.reject}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {rejectingItemId === item._id && (
                                                <tr className="bg-red-50/10">
                                                    <td colSpan="4" className="px-10 py-4">
                                                        <div className="space-y-3 max-w-xl animate-in fade-in slide-in-from-top-2 ml-16">
                                                            <div className="relative">
                                                                <textarea 
                                                                    placeholder="Reason for listing rejection..."
                                                                    className="w-full p-4 pr-12 rounded-2xl border border-red-100 outline-none focus:ring-2 focus:ring-red-400 text-sm font-medium"
                                                                    value={itemRejectionReason}
                                                                    onChange={(e) => setItemRejectionReason(e.target.value)}
                                                                    rows={2}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => startSpeechRecognition(setItemRejectionReason)}
                                                                    className="absolute right-3 top-3 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                                                                    title="Speak Rejection Reason"
                                                                >
                                                                    <Mic size={16} />
                                                                </button>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button 
                                                                    onClick={() => handleRejectListingConfirm(item._id, item.type)} 
                                                                    className="btn bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs"
                                                                >
                                                                    Confirm Reject
                                                                </button>
                                                                <button 
                                                                    onClick={() => {
                                                                        setRejectingItemId(null);
                                                                        setItemRejectionReason("");
                                                                    }} 
                                                                    className="btn bg-gray-100 text-gray-500 px-4 py-2.5 rounded-xl font-bold text-xs"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full">
            <Routes>
                <Route path="/" element={<UserManagement />} />
                <Route path="/farmers" element={<UserManagement forcedRole="farmer" title="Farmers Management" description="Dedicated view for managing and inspecting registered farmers." />} />
                <Route path="/sellers" element={<UserManagement forcedRole="seller" title="Sellers Management" description="Dedicated view for managing registered equipment & input sellers." />} />
                <Route path="/traders" element={<UserManagement forcedRole="trader" title="Traders Management" description="Dedicated view for managing fish traders and wholesale buyers." />} />
                <Route path="/hatcheries" element={<UserManagement forcedRole="hatchery" title="Hatcheries Management" description="Dedicated view for managing registered hatcheries & seed suppliers." />} />
                <Route path="/stats" element={<StatsView />} />
                <Route path="/buying-approvals" element={
                    <ListingApprovalsView 
                        filterType="post" 
                        customTitle="Buying Demands Approval" 
                        customDesc="Review and approve buying demand posts submitted by buyers and traders." 
                    />
                } />
                <Route path="/listings-approval" element={
                    <ListingApprovalsView 
                        filterType="listing" 
                        customTitle="Equipment & Listings Approval" 
                        customDesc="Review and approve sale listings and equipment submitted by sellers, farmers, and hatcheries." 
                    />
                } />
                <Route path="/user-verification" element={<UserVerificationView />} />
                <Route path="/media" element={<MediaManager />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/analytics" element={<AdminAnalytics />} />
                <Route path="*" element={<div className="text-center py-20 font-black text-2xl text-gray-300">{t.adminPageNotFound}</div>} />
            </Routes>
        </div>
    );
};

export default AdminDashboard;
