import { useState, useContext } from 'react';
import Sidebar from './Sidebar';
import { Menu, X, Home, List, Heart, User, Plus, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getDashboardPath } from '../../utils/roleUtils';
import CreateListingModal from '../../features/product/components/CreateListingModal';
import CreatePostModal from '../trader/CreatePostModal';
import toast from 'react-hot-toast';

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isListingModalOpen, setIsListingModalOpen] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    const { user, logout } = useContext(AuthContext);
    const { t } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();

    if (!user) return children;

    const getListingPath = (role) => {
        if (role === 'trader') return '/profile/posts';
        if (role === 'admin') return '/admin/dashboard/listings-approval';
        return '/profile/listings';
    };

    const dashboardHomePath = getDashboardPath(user.role);
    const listingsPath = getListingPath(user.role);

    const isHomeActive = location.pathname === dashboardHomePath || location.pathname === '/profile';
    const isListingsActive = location.pathname === listingsPath;
    const isSavedActive = location.pathname === '/profile/saved';
    const isProfileActive = location.pathname === '/profile/settings';

    const handleCreateClick = () => {
        const isUnverified = user.role !== 'admin' && user.accountStatus !== 'active';
        if (isUnverified) {
            toast.error(user.role === 'trader' 
                ? "Please complete verification to post requirements" 
                : "Please complete verification to list products"
            );
            navigate('/verification');
            return;
        }

        if (user.role === 'trader') {
            setIsPostModalOpen(true);
        } else {
            setIsListingModalOpen(true);
        }
    };

    const handleSuccess = () => {
        toast.success(user.role === 'trader' 
            ? "Requirement posted successfully!" 
            : "Listing submitted successfully!"
        );
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const renderNavItem = (label, path, icon, isActive) => {
        return (
            <Link 
                to={path}
                className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
                <div className="transition-transform duration-200 active:scale-95">
                    {icon}
                </div>
                <span className="text-[10px] font-bold mt-1 tracking-wide uppercase">
                    {label}
                </span>
                {isActive ? (
                    <span 
                        style={{ 
                            display: 'block', 
                            width: '5px', 
                            height: '5px', 
                            backgroundColor: '#0066cc', // Main theme primary color
                            borderRadius: '50%', 
                            marginTop: '4px',
                            animation: 'fadeInDot 0.2s ease-out forwards'
                        }} 
                    />
                ) : (
                    <span style={{ display: 'block', width: '5px', height: '5px', marginTop: '4px', backgroundColor: 'transparent' }} />
                )}
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50/50 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 z-45 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <Sidebar 
                isOpen={isSidebarOpen} 
                toggleSidebar={() => setIsSidebarOpen(false)} 
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 lg:p-12 lg:pb-12 pb-24">
                    <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <div 
                className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-4 flex items-center justify-around z-40"
                style={{ 
                    paddingTop: '8px', 
                    paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' 
                }}
            >
                <style>{`
                    @keyframes fadeInDot {
                        from { transform: scale(0); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                `}</style>

                {renderNavItem(t.home || 'Home', dashboardHomePath, <Home size={22} />, isHomeActive)}
                {renderNavItem(t.listings || 'Listings', listingsPath, <List size={22} />, isListingsActive)}
                
                {/* Prominent Center Action Button */}
                <div className="flex flex-col items-center justify-center flex-1 relative">
                    <button 
                        onClick={handleCreateClick}
                        className="flex items-center justify-center w-14 h-14 bg-primary text-white rounded-2xl shadow-lg shadow-primary/30 -mt-8 border-4 border-white hover:bg-blue-700 active:scale-95 transition-all duration-200"
                        title={t.newListing || 'Create'}
                    >
                        <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
                            <Plus size={18} strokeWidth={3} className="text-white" />
                        </div>
                    </button>

                </div>

                {renderNavItem(t.saved || 'Saved', '/profile/saved', <Heart size={22} />, isSavedActive)}

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="flex flex-col items-center justify-center flex-1 py-1 relative transition-colors duration-200 text-red-400 hover:text-red-600"
                >
                    <div className="transition-transform duration-200 active:scale-95">
                        <LogOut size={22} />
                    </div>
                    <span className="text-[10px] font-bold mt-1 tracking-wide uppercase">
                        {t.logout || 'Logout'}
                    </span>
                    <span style={{ display: 'block', width: '5px', height: '5px', marginTop: '4px', backgroundColor: 'transparent' }} />
                </button>
            </div>

            {/* Modals */}
            <CreateListingModal 
                isOpen={isListingModalOpen} 
                onClose={() => setIsListingModalOpen(false)} 
                onSuccess={handleSuccess} 
            />
            <CreatePostModal 
                isOpen={isPostModalOpen} 
                onClose={() => setIsPostModalOpen(false)} 
                onSuccess={handleSuccess} 
            />
        </div>
    );
};

export default DashboardLayout;

