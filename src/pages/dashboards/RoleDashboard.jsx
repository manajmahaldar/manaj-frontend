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
    const { user } = useContext(AuthContext);
    const { t, formatDigit } = useLanguage();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get(`/${allowedRole}/dashboard`);
                setStats(res.data.stats);
            } catch (err) {
                console.error(`Failed to fetch ${allowedRole} stats`, err);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.role === allowedRole) {
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

    const statItems = allowedRole === 'trader' ? [
        { label: t.buyingRequirements, val: stats?.totalPosts || 0, icon: <PlusCircle />, col: 'bg-green-600 shadow-green-500/20' },
        { label: t.sentOrders, val: stats?.sentOrders || 0, icon: <ArrowUpRight />, col: 'bg-purple-600 shadow-purple-500/20' },
    ] : [
        { label: t.myListings, val: stats?.totalListings || 0, icon: <Package />, col: 'bg-blue-600 shadow-blue-500/20' },
        { label: t.receivedOrders, val: stats?.receivedOrders || 0, icon: <ArrowDownRight />, col: 'bg-orange-600 shadow-orange-500/20' },
    ];

    return (
        <div className="space-y-12 p-8">
            <header className="space-y-4">
                <div className="flex items-center gap-3 text-primary font-black text-sm uppercase tracking-widest">
                    <LayoutDashboard size={20} />
                    <span>{roleTitle} Dashboard</span>
                </div>
                <h1 className="text-4xl font-black text-gray-900 leading-tight">
                    {t.welcome}, <span className="text-primary">{user.name}</span>!
                </h1>
                <p className="text-lg text-gray-500 font-medium max-w-2xl">
                    Manage your {allowedRole} activities and track your progress here.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {statItems.map((stat, i) => (
                    <div key={i} className={`rounded-[2rem] p-8 text-white ${stat.col} shadow-2xl relative overflow-hidden group transition-all hover:scale-[1.02]`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 transform group-hover:scale-[2] transition-transform duration-500">
                            {stat.icon}
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest opacity-80">{stat.label}</p>
                        <p className="text-5xl font-black mt-4">{formatDigit(stat.val)}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40 flex items-start gap-6">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                    <Info size={32} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-black text-gray-900">Role Guidelines</h3>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        As a <span className="font-bold text-gray-900">{roleTitle}</span>, you can 
                        {allowedRole === 'trader' ? ' post buying requirements and connect with sellers.' : ' list products specific to your expertise and receive orders from traders.'}
                    </p>
                    <Link to="/profile" className="inline-block mt-4 text-primary font-black hover:underline">
                        Go to detailed profile &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RoleDashboard;
