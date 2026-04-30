import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Search, 
    User, 
    Settings, 
    Users, 
    ShieldCheck, 
    FileText,
    LogOut,
    PlusCircle,
    ArrowDownRight,
    ArrowUpRight,
    Package
} from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

import { getDashboardPath } from '../../utils/roleUtils';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    if (!user) return null;

    const navItems = [
        { 
            name: 'Dashboard', 
            path: getDashboardPath(user.role), 
            icon: <LayoutDashboard size={20} />, 
            roles: ['farmer', 'seller', 'trader', 'hatchery', 'admin'] 
        },
        { 
            name: 'My Listings', 
            path: '/profile/listings', 
            icon: <ShoppingBag size={20} />, 
            roles: ['farmer', 'seller', 'hatchery'] 
        },
        { 
            name: 'Buying Demands', 
            path: '/profile/posts', 
            icon: <PlusCircle size={20} />, 
            roles: ['trader'] 
        },
        { 
            name: 'Orders Received', 
            path: '/profile/orders-received', 
            icon: <ArrowDownRight size={20} />, 
            roles: ['farmer', 'seller', 'hatchery'] 
        },
        { 
            name: 'My Orders', 
            path: '/profile/my-orders', 
            icon: <ArrowUpRight size={20} />, 
            roles: ['trader'] 
        },
        { 
            name: 'User Management', 
            path: '/admin/dashboard', 
            icon: <Users size={20} />, 
            roles: ['admin'] 
        },
        { 
            name: 'Listing Approval', 
            path: '/admin/dashboard/listings-approval', 
            icon: <Package size={20} />, 
            roles: ['admin'] 
        },
        { 
            name: 'Platform Stats', 
            path: '/admin/dashboard/stats', 
            icon: <ShieldCheck size={20} />, 
            roles: ['admin'] 
        },
        { 
            name: 'Knowledge Base', 
            path: '/knowledge', 
            icon: <FileText size={20} />, 
            roles: ['farmer', 'seller', 'trader', 'hatchery', 'admin'] 
        },
        { 
            name: 'Profile Settings', 
            path: '/profile/settings', 
            icon: <Settings size={20} />, 
            roles: ['farmer', 'seller', 'trader', 'hatchery', 'admin'] 
        },
    ];

    const filteredItems = navItems.filter(item => item.roles.includes(user.role));

    return (
        <aside className={`fixed inset-y-0 left-0 bg-white border-r border-gray-100 w-64 transform transition-transform duration-300 z-50 lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="h-full flex flex-col p-6 space-y-8">
                <div className="flex items-center gap-2 text-primary font-black text-2xl px-2">
                    <LayoutDashboard size={28} />
                    <span>DASHBOARD</span>
                </div>

                <nav className="flex-1 space-y-1">
                    {filteredItems.map((item) => (
                        <Link 
                            key={item.path}
                            to={item.path}
                            onClick={toggleSidebar}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                                location.pathname === item.path 
                                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="pt-6 border-t border-gray-100">
                    <button 
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-red-500 hover:bg-red-50 w-full transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                    
                    <div className="mt-6 flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 truncate">
                            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user.role}</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
