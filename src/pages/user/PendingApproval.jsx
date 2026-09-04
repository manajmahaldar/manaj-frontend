import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Clock, CheckCircle, LogOut, Mail, Phone, ArrowRight, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const STEPS = [
    {
        icon: CheckCircle,
        label: 'Account Created',
        desc: 'Your account has been registered successfully.',
        done: true,
    },
    {
        icon: ShieldCheck,
        label: 'Admin Review',
        desc: 'Our team is verifying your details and documents.',
        done: false,
        active: true,
    },
    {
        icon: CheckCircle,
        label: 'Access Granted',
        desc: "You'll receive full dashboard access after approval.",
        done: false,
    },
];

const PendingApproval = () => {
    const { user, logout, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleRefresh = async () => {
        try {
            const res = await api.get('/users/profile');
            updateUser(res.data);
            if (res.data.accountStatus === 'active') {
                toast.success('Your account has been approved! Welcome.');
                const paths = {
                    farmer: '/dashboard/farmer',
                    seller: '/dashboard/seller',
                    trader: '/dashboard/trader',
                    hatchery: '/dashboard/hatchery',
                    admin: '/admin/dashboard',
                };
                navigate(paths[res.data.role] || '/profile');
            } else {
                toast('Still under review. Please check back later.', { icon: '🕐' });
            }
        } catch {
            toast.error('Unable to refresh status. Please try again.');
        }
    };

    const roleLabel = user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : 'User';

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-blue-100/60 border border-blue-100/60 overflow-hidden">
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-primary to-blue-700 px-8 pt-10 pb-12 text-white relative overflow-hidden">
                        {/* decorative circles */}
                        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
                        <div className="absolute top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />

                        <div className="relative z-10 flex items-start gap-5">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                                <Clock size={32} className="text-white animate-pulse" />
                            </div>
                            <div>
                                <p className="text-blue-100 text-sm font-semibold uppercase tracking-widest mb-1">Account Status</p>
                                <h1 className="text-2xl md:text-3xl font-black leading-tight">
                                    Pending Admin Approval
                                </h1>
                                <p className="mt-2 text-blue-100 text-sm font-medium leading-relaxed">
                                    Welcome, <span className="text-white font-bold">{user?.name || 'there'}</span>! Your <span className="text-white font-bold">{roleLabel}</span> account has been created and is currently under review.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-8 py-8 space-y-8">
                        {/* Progress Steps */}
                        <div className="space-y-4">
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Approval Progress</h2>
                            <div className="space-y-3">
                                {STEPS.map((step, i) => {
                                    const Icon = step.icon;
                                    return (
                                        <div
                                            key={i}
                                            className={`flex items-start gap-4 p-4 rounded-2xl transition-all ${
                                                step.active
                                                    ? 'bg-blue-50 border border-blue-200'
                                                    : step.done
                                                    ? 'bg-green-50 border border-green-100'
                                                    : 'bg-gray-50 border border-gray-100'
                                            }`}
                                        >
                                            <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                    step.active
                                                        ? 'bg-primary text-white'
                                                        : step.done
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-200 text-gray-400'
                                                }`}
                                            >
                                                {step.active ? (
                                                    <Clock size={18} className="animate-pulse" />
                                                ) : (
                                                    <Icon size={18} />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className={`font-bold text-sm ${
                                                        step.active
                                                            ? 'text-primary'
                                                            : step.done
                                                            ? 'text-green-700'
                                                            : 'text-gray-400'
                                                    }`}
                                                >
                                                    {step.label}
                                                    {step.active && (
                                                        <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider rounded-full">
                                                            In Progress
                                                        </span>
                                                    )}
                                                </p>
                                                <p
                                                    className={`text-xs mt-0.5 ${
                                                        step.active
                                                            ? 'text-blue-600'
                                                            : step.done
                                                            ? 'text-green-600'
                                                            : 'text-gray-400'
                                                    }`}
                                                >
                                                    {step.desc}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
                            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center shrink-0 text-amber-600">
                                <ShieldCheck size={18} />
                            </div>
                            <div>
                                <p className="font-bold text-amber-900 text-sm">What happens next?</p>
                                <p className="text-amber-700 text-xs leading-relaxed mt-1">
                                    Our admin team manually reviews every new account to ensure a safe and trusted marketplace. 
                                    You will be notified once your account is approved — typically within 24–48 hours. 
                                    After approval, you will have full access to list products, post buying requirements, and interact with other users.
                                </p>
                            </div>
                        </div>

                        {/* Account Info */}
                        {(user?.email || user?.phone) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {user?.email && (
                                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                                        <Mail size={15} className="text-gray-400 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email</p>
                                            <p className="text-sm font-bold text-gray-700 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                )}
                                {user?.phone && (
                                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                                        <Phone size={15} className="text-gray-400 shrink-0" />
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phone</p>
                                            <p className="text-sm font-bold text-gray-700">+91 {user.phone}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                onClick={handleRefresh}
                                className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-bold py-3.5 px-6 rounded-2xl hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/20"
                            >
                                <RefreshCw size={16} />
                                Check Approval Status
                            </button>
                            <button
                                onClick={() => navigate('/listings')}
                                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-bold py-3.5 px-6 rounded-2xl hover:bg-gray-200 active:scale-95 transition-all"
                            >
                                Browse Marketplace
                                <ArrowRight size={16} />
                            </button>
                        </div>

                        {/* Logout */}
                        <div className="flex justify-center pt-2 border-t border-gray-100">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 font-semibold transition-colors py-2 px-4 rounded-xl hover:bg-red-50"
                            >
                                <LogOut size={14} />
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer note */}
                <p className="text-center text-xs text-gray-400 mt-5 font-medium">
                    Need help? Contact us at{' '}
                    <a href="mailto:support@matsyalink.com" className="text-primary hover:underline font-bold">
                        support@matsyalink.com
                    </a>
                </p>
            </div>
        </div>
    );
};

export default PendingApproval;
