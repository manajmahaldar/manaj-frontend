import { useState, useContext } from 'react';
import Sidebar from './Sidebar';
import { Home, List, Heart, User, Plus } from 'lucide-react';
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

    const { user } = useContext(AuthContext);
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
        setTimeout(() => { window.location.reload(); }, 1000);
    };

    const renderNavItem = (label, path, icon, isActive) => (
        <Link
            to={path}
            className={`flex flex-col items-center justify-center flex-1 min-w-0 h-full transition-colors duration-200 ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
            }`}
        >
            <div className="transition-transform duration-200 active:scale-95">
                {icon}
            </div>
            <span className="text-[9px] font-bold mt-1 tracking-wide uppercase truncate max-w-full leading-none">
                {label}
            </span>
            <span style={{
                display: 'block', width: '4px', height: '4px', marginTop: '3px',
                backgroundColor: isActive ? '#0066cc' : 'transparent',
                borderRadius: '50%',
                transition: 'background-color 0.2s'
            }} />
        </Link>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 flex">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-45 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 lg:p-12 lg:pb-12 pb-24">
                    <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {children}
                    </div>
                </main>
            </div>

            {/* ── Mobile Bottom Navigation Bar ── */}
            <style>{`
                @keyframes fadeInDot {
                    from { transform: scale(0); opacity: 0; }
                    to   { transform: scale(1); opacity: 1; }
                }
            `}</style>

            {/* Outer wrapper: full-width, sits at bottom, clips nothing */}
            <nav
                className="lg:hidden fixed bottom-0 left-0 right-0 z-40"
                style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            >
                {/* Thin decorative top-border strip */}
                <div className="h-px bg-gray-100 w-full" />

                {/* Bar proper — 60 px tall, white background */}
                <div
                    className="bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center"
                    style={{ height: '60px' }}
                >
                    {/* HOME */}
                    {renderNavItem(t.home || 'Home', dashboardHomePath, <Home size={20} />, isHomeActive)}

                    {/* LISTINGS */}
                    {renderNavItem(t.listings || 'Listings', listingsPath, <List size={20} />, isListingsActive)}

                    {/* Center + button — floats 20 px above the bar */}
                    <div className="flex-1 flex items-center justify-center h-full relative">
                        <button
                            onClick={handleCreateClick}
                            title={t.newListing || 'Create'}
                            aria-label="Create new listing"
                            className="absolute flex items-center justify-center bg-primary hover:bg-blue-700 active:scale-95 text-white rounded-[18px] border-4 border-white shadow-xl shadow-primary/40 transition-all duration-200"
                            style={{ width: '54px', height: '54px', bottom: '14px' }}
                        >
                            <div className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center">
                                <Plus size={16} strokeWidth={3} />
                            </div>
                        </button>
                    </div>

                    {/* SAVED */}
                    {renderNavItem(t.saved || 'Saved', '/profile/saved', <Heart size={20} />, isSavedActive)}

                    {/* MY PROFILE */}
                    {renderNavItem(t.profile || 'Profile', '/profile/settings', <User size={20} />, isProfileActive)}
                </div>
            </nav>

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
