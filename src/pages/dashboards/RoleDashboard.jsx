import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';
import { 
    LayoutDashboard, Package, PlusCircle, ArrowUpRight, ArrowDownRight, 
    ShoppingCart, Loader2, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

const RoleDashboard = ({ allowedRole }) => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const { t, formatDigit } = useLanguage();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                if (user?.accountStatus !== 'active') {
                    setLoading(false);
                    return;
                }
                const res = await api.get(`/${allowedRole}/dashboard`);
                setStats(res.data.stats);
            } catch (err) {
                console.error(`Failed to fetch ${allowedRole} stats`, err);
            } finally {
                setLoading(false);
            }
        };

        if (user && !authLoading && user.role === allowedRole) {
            fetchStats();
        }
    }, [user, allowedRole]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    const roleTitle = {
        farmer: t.farmer,
        seller: t.seller,
        trader: t.trader,
        hatchery: t.hatchery
    }[allowedRole];

    const statItems = [
        { label: t.myListings, val: stats?.totalListings || 0, icon: <Package />, col: 'bg-blue-600 shadow-blue-500/20', path: '/profile/listings' },
        { label: t.buyingRequirements, val: stats?.totalPosts || 0, icon: <PlusCircle />, col: 'bg-green-600 shadow-green-500/20', path: '/profile/posts' },
        { label: t.buyingRequirements, val: 'View', icon: <ShoppingCart />, col: 'bg-orange-600 shadow-orange-500/20', path: '/posts' },
    ];

    return (
        <div className="space-y-12 p-8">
            {user?.accountStatus === 'pending' && (
                <div className="bg-orange-50 border border-orange-200 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl shrink-0">
                            <Info size={24} />
                        </div>
                        <div>
                            <h4 className="font-black text-orange-900 text-lg">Account Approval Pending</h4>
                            <p className="text-orange-700 text-sm">Your profile has been submitted. Please wait for Admin approval before posting listings or conducting transactions.</p>
                        </div>
                    </div>
                    <Link to="/verification" className="btn bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 shrink-0">
                        Check Verification Status
                    </Link>
                </div>
            )}
            <header className="space-y-4 text-center md:text-left flex flex-col items-center md:items-start">
                <div className="flex items-center justify-center md:justify-start gap-3 text-primary font-black text-sm uppercase tracking-widest w-full">
                    <LayoutDashboard size={20} />
                    <span>{roleTitle} {t.dashboard}</span>
                </div>
                <h1 className="text-4xl font-black text-gray-900 leading-tight">
                    {t.welcome}, <span className="text-primary">{user.name}</span>!
                </h1>
                <p className="text-lg text-gray-500 font-medium max-w-2xl text-center md:text-left">
                    {t.manageYourActivities}
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {statItems.map((stat, i) => (
                    <Link key={i} to={stat.path} state={stat.state} className={`block rounded-[2rem] p-8 text-white ${stat.col} shadow-2xl relative overflow-hidden group transition-all hover:scale-[1.02]`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 transform group-hover:scale-[2] transition-transform duration-500">
                            {stat.icon}
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest opacity-80">{stat.label}</p>
                        <p className="text-5xl font-black mt-4">{formatDigit(stat.val)}</p>
                    </Link>
                ))}
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl flex-shrink-0">
                    <Info size={32} />
                </div>
                <div className="space-y-2 flex flex-col items-center md:items-start">
                    <h3 className="text-xl font-black text-gray-900">{t.roleGuidelines}</h3>
                    <p className="text-gray-500 font-medium leading-relaxed text-center md:text-left">
                        {t.roleDashboardDescriptionPrefix || 'As a'} <span className="font-bold text-gray-900">{roleTitle}</span>, {allowedRole === 'trader' ? t.roleDashboardTraderDesc || 'post buying requirements and connect with sellers.' : t.roleDashboardOtherDesc || 'list products specific to your expertise and receive orders from traders.'}
                    </p>
                    <Link to="/profile/settings" className="inline-block mt-4 text-primary font-black hover:underline">
                        {t.goToDetailedProfile || 'Go to detailed profile'} &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RoleDashboard;
