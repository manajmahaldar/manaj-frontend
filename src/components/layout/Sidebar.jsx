import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    User, 
    Settings, 
    Users, 
    ShieldCheck, 
    LogOut,
    PlusCircle,
    ArrowDownRight,
    ArrowUpRight,
    Package,
    Images,
    Filter,
    BarChart3,
    Wrench,
    GraduationCap,
    ChevronDown,
    ChevronUp,
    Tractor,
    Store,
    TrendingUp,
    Fish,
    Sparkles,
    Bot
} from 'lucide-react';
import { useState, useContext, useMemo, useCallback, memo } from 'react';
import { AuthContext, AuthActionsContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getDashboardPath } from '../../utils/roleUtils';
import logoImg from '../../assets/logo/logo.png';
import AIAssistantButton from '../ai/AIAssistantButton';

const Sidebar = memo(({ isOpen, toggleSidebar, onOpenAIAgent, onOpenFarmingAIAgent }) => {
    const { user } = useContext(AuthContext);
    const { logout } = useContext(AuthActionsContext);
    const { t } = useLanguage();
    const [isLearningHubOpen, setIsLearningHubOpen] = useState(false);
    const location = useLocation();

    const roleLabels = useMemo(() => ({
        farmer: t.farmer,
        seller: t.seller,
        trader: t.trader,
        hatchery: t.hatchery,
        admin: t.admin || 'Admin',
    }), [t]);

    if (!user) return null;

    // Prefetch the Learning Hub chunk on hover
    const prefetchLearningHub = useCallback(() => {
        import('../../features/learning/pages/LearningHub').catch(() => {});
    }, []);

    const navItems = useMemo(() => [
        { 
            name: t.dashboard || 'Dashboard', 
            path: getDashboardPath(user.role), 
            icon: <LayoutDashboard size={18} />, 
            roles: ['farmer', 'seller', 'trader', 'hatchery', 'admin'] 
        },
        { 
            name: t.myListings || 'My Listings', 
            path: '/profile/listings', 
            icon: <ShoppingBag size={18} />, 
            roles: ['farmer', 'seller', 'hatchery', 'trader'] 
        },
        { 
            name: t.myEquipment || 'My Equipment', 
            path: '/profile/equipment', 
            icon: <Wrench size={18} />, 
            roles: ['farmer', 'seller', 'hatchery', 'trader'] 
        },
        { 
            name: t.buyingPosts || 'Buying Demands', 
            path: '/profile/posts', 
            icon: <PlusCircle size={18} />, 
            roles: ['farmer', 'seller', 'trader', 'hatchery', 'admin'] 
        },
        { 
            name: t.ordersReceived || 'Orders Received', 
            path: '/profile/orders-received', 
            icon: <ArrowDownRight size={18} />, 
            roles: ['farmer', 'seller', 'hatchery', 'trader'] 
        },
        { 
            name: t.myOrders || 'My Orders', 
            path: '/profile/my-orders', 
            icon: <ArrowUpRight size={18} />, 
            roles: ['trader'] 
        },
        { 
            name: t.userManagement || 'User Management', 
            path: '/admin/dashboard', 
            icon: <Users size={18} />, 
            roles: ['admin'] 
        },
        { 
            name: t.farmers || 'Farmers', 
            path: '/admin/dashboard/farmers', 
            icon: <Tractor size={18} />, 
            roles: ['admin'] 
        },
        { 
            name: t.sellers || 'Sellers', 
            path: '/admin/dashboard/sellers', 
            icon: <Store size={18} />, 
            roles: ['admin'] 
        },
        { 
            name: t.traders || 'Traders', 
            path: '/admin/dashboard/traders', 
            icon: <TrendingUp size={18} />, 
            roles: ['admin'] 
        },
        { 
            name: t.hatcheries || 'Hatcheries', 
            path: '/admin/dashboard/hatcheries', 
            icon: <Fish size={18} />, 
            roles: ['admin'] 
        },
        { 
            name: t.buyingPostsApproval || 'Buying Posts Approval', 
            path: '/admin/dashboard/buying-approvals', 
            icon: <PlusCircle size={18} />, 
            roles: ['admin'] 
        },
        { 
            name: t.equipmentListingsApproval || 'Equipment & Listings Approval', 
            path: '/admin/dashboard/listings-approval', 
            icon: <Package size={18} />, 
            roles: ['admin'] 
        },
        { 
            name: t.adminStats || 'Platform Stats', 
            path: '/admin/dashboard/stats', 
            icon: <ShieldCheck size={18} />, 
            roles: ['admin'] 
        },
        { 
            name: t.mediaLibrary || 'Media Library', 
            path: '/admin/dashboard/media', 
            icon: <Images size={18} />, 
            roles: ['admin'] 
        },
        { 
            name: t.advancedUsers || 'Advanced Users', 
            path: '/admin/dashboard/user-management', 
            icon: <Filter size={18} />, 
            roles: ['admin'] 
        },
        { 
            name: t.analytics || 'Analytics', 
            path: '/admin/dashboard/analytics', 
            icon: <BarChart3 size={18} />, 
            roles: ['admin'] 
        },
        { 
            name: t.profileSettings || 'Profile Settings', 
            path: '/profile/settings', 
            icon: <Settings size={18} />, 
            roles: ['farmer', 'seller', 'trader', 'hatchery', 'admin'] 
        },
    ], [user.role, t]);

    const filteredItems = useMemo(
        () => navItems.filter(item => item.roles.includes(user.role)),
        [navItems, user.role]
    );

    const handleLearningHubToggle = useCallback(
        () => setIsLearningHubOpen(prev => !prev),
        []
    );

    const avatarInitial = user.name ? user.name.charAt(0).toUpperCase() : '?';

    return (
        <aside className={`fixed inset-y-0 left-0 bg-white border-r border-border w-64 transform transition-transform duration-300 z-50 lg:relative lg:translate-x-0 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

            {/* Sidebar Header */}
            <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border flex-shrink-0">
                <img src={logoImg} alt="MatsyaLink" className="h-7 w-auto object-contain" />
                <span className="text-sm font-bold text-text-primary tracking-tight">MatsyaLink</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto min-h-0">
                {/* Create with AI Sidebar Action */}
                <button
                    onClick={() => {
                        onOpenAIAgent?.();
                        toggleSidebar?.();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700 active:scale-98 transition-all mb-2"
                >
                    <Sparkles size={18} className="animate-pulse text-amber-300" />
                    <span>{t.aiAgentTitle || 'Create with AI'}</span>
                </button>

                {filteredItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link 
                            key={`${item.name}-${item.path}`}
                            to={item.path}
                            onClick={toggleSidebar}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                                isActive 
                                ? 'bg-primary-muted text-primary font-semibold' 
                                : 'text-text-secondary hover:bg-surface-1 hover:text-text-primary'
                            }`}
                        >
                            <span className={isActive ? 'text-primary' : 'text-text-tertiary'}>
                                {item.icon}
                            </span>
                            <span>{item.name}</span>
                            {isActive && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                        </Link>
                    );
                })}

                {/* Learning Hub Collapsible */}
                <div className="pt-0.5">
                    <button
                        onClick={handleLearningHubToggle}
                        onMouseEnter={prefetchLearningHub}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                            location.pathname.startsWith('/learning') 
                                ? 'bg-primary-muted text-primary font-semibold' 
                                : 'text-text-secondary hover:bg-surface-1 hover:text-text-primary'
                        }`}
                    >
                        <span className={location.pathname.startsWith('/learning') ? 'text-primary' : 'text-text-tertiary'}>
                            <GraduationCap size={18} />
                        </span>
                        <span className="flex-1 text-left">{t.learningHub || 'Learning Hub'}</span>
                        <span className="text-text-tertiary">
                            {isLearningHubOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </span>
                    </button>

                    {isLearningHubOpen && (
                        <div className="ml-6 mt-1 space-y-0.5 border-l border-border pl-3">
                            {[
                                { name: t.learningArticles || 'Articles',         path: '/learning/articles' },
                                { name: t.learningVideos || 'Videos',           path: '/learning/videos' },
                                { name: t.learningProblemsStory || 'Problems Story (Videos)', path: '/learning/problems-story' },
                                { name: t.learningWebinars || 'Webinars',         path: '/learning/webinars' },
                                { name: t.learningGovtSchemes || 'Govt. Schemes',    path: '/learning/schemes' },
                            ].map((sub) => (
                                <Link
                                    key={sub.path}
                                    to={sub.path}
                                    onClick={toggleSidebar}
                                    className={`block px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                                        location.pathname === sub.path
                                            ? 'text-primary bg-primary-muted'
                                            : 'text-text-tertiary hover:text-text-primary hover:bg-surface-1'
                                    }`}
                                >
                                    {sub.name}
                                </Link>
                            ))}
                            {user?.role === 'admin' && (
                                <Link
                                    to="/learning/admin"
                                    onClick={toggleSidebar}
                                    className="block px-3 py-2 rounded-md text-xs font-medium text-accent hover:bg-accent-muted transition-colors"
                                >
                                    {t.cmsDashboard || 'CMS Dashboard'}
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            {/* Sidebar Footer */}
            <div className="px-3 py-4 border-t border-border flex-shrink-0 space-y-2">
                {/* User card */}
                <div className="flex items-center gap-3 px-3 py-2.5 bg-surface-1 rounded-lg border border-border">
                    <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {avatarInitial}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
                        <p className="text-2xs font-medium text-text-tertiary uppercase tracking-wider">
                            {roleLabels[user.role] || user.role}
                        </p>
                    </div>
                </div>

                {/* Logout */}
                <button 
                    onClick={logout}
                    className="btn btn-danger-ghost btn-sm w-full justify-start gap-3"
                >
                    <LogOut size={16} />
                    <span>{t.signOut || 'Sign Out'}</span>
                </button>
            </div>
        </aside>
    );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
