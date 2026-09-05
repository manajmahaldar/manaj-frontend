import { useState, useContext, useCallback } from 'react';
import Sidebar from './Sidebar';
import { Home, List, Heart, User, Plus, Menu } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getDashboardPath } from '../../utils/roleUtils';
import CreateListingModal from '../../features/product/components/CreateListingModal';
import CreatePostModal from '../trader/CreatePostModal';
import AIMarketplaceAgentModal from '../ai/AIMarketplaceAgentModal';
import FarmingAIAssistantModal from '../ai/FarmingAIAssistantModal';
import AIAssistantButton from '../ai/AIAssistantButton';
import toast from 'react-hot-toast';
import logoImg from '../../assets/logo/logo.png';
import { Bot } from 'lucide-react';

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isListingModalOpen, setIsListingModalOpen] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isAIAgentOpen, setIsAIAgentOpen] = useState(false);
    const [isFarmingAIAgentOpen, setIsFarmingAIAgentOpen] = useState(false);
    const [aiInitialData, setAiInitialData] = useState(null);

    const { user } = useContext(AuthContext);
    const { t } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();

    if (!user) return children;

    const getListingPath = (role) => {
        if (role === 'admin') return '/admin/dashboard/listings-approval';
        return '/profile/listings';
    };

    const dashboardHomePath = getDashboardPath(user.role);
    const listingsPath = getListingPath(user.role);

    const isHomeActive     = location.pathname === dashboardHomePath || location.pathname === '/profile';
    const isListingsActive = location.pathname === listingsPath;
    const isSavedActive    = location.pathname === '/profile/saved';
    const isProfileActive  = location.pathname === '/profile/settings';

    const handleCreateClick = useCallback(() => {
        setAiInitialData(null);
        setIsListingModalOpen(true);
    }, []);

    const handleLaunchFormFromAI = useCallback((data) => {
        setAiInitialData(data);
        if (data.actionType === 'buying') {
            setIsPostModalOpen(true);
        } else {
            setIsListingModalOpen(true);
        }
    }, []);

    const handleSuccess = useCallback(() => {
        toast.success(t.listingSubmitSuccess || 'Listing submitted successfully!');
        navigate(0);
    }, [navigate, t.listingSubmitSuccess]);

    const NavItem = ({ label, path, icon, isActive }) => (
        <Link
            to={path}
            className={`flex flex-col items-center justify-center flex-1 min-w-0 h-full gap-1 transition-colors duration-150 ${
                isActive ? 'text-primary' : 'text-text-tertiary hover:text-text-secondary'
            }`}
        >
            <div className={`transition-transform duration-150 active:scale-90 ${isActive ? 'scale-105' : ''}`}>
                {icon}
            </div>
            <span className="text-2xs font-semibold tracking-wide uppercase truncate max-w-full leading-none">
                {label}
            </span>
            <span className={`w-1 h-1 rounded-full transition-all duration-200 ${isActive ? 'bg-primary opacity-100' : 'opacity-0'}`} />
        </Link>
    );

    return (
        <div className="min-h-screen bg-surface-1 flex">
            {/* Sidebar overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar 
                isOpen={isSidebarOpen} 
                toggleSidebar={() => setIsSidebarOpen(false)} 
                onOpenAIAgent={() => setIsAIAgentOpen(true)}
                onOpenFarmingAIAgent={() => setIsFarmingAIAgentOpen(true)}
            />

            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Mobile Top Header */}
                <header className="lg:hidden bg-white border-b border-border px-4 h-14 flex items-center justify-between sticky top-0 z-30">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="btn-icon btn-ghost -ml-1 text-text-secondary"
                        aria-label="Open navigation menu"
                    >
                        <Menu size={22} />
                    </button>
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logoImg} alt="MatsyaLink" className="h-7 w-auto object-contain" />
                        <span className="font-bold text-sm text-text-primary tracking-tight">MatsyaLink</span>
                    </Link>
                    <div className="w-9" /> {/* spacer to balance layout */}
                </header>

                {/* Main content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav
                className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border"
                style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            >
                <div className="flex items-center h-[60px]">
                    {/* HOME */}
                    <NavItem
                        label={t.home || 'Home'}
                        path={dashboardHomePath}
                        icon={<Home size={20} />}
                        isActive={isHomeActive}
                    />

                    {/* LISTINGS */}
                    <NavItem
                        label={t.listings || 'Listings'}
                        path={listingsPath}
                        icon={<List size={20} />}
                        isActive={isListingsActive}
                    />

                    {/* SAVED */}
                    <NavItem
                        label={t.saved || 'Saved'}
                        path="/profile/saved"
                        icon={<Heart size={20} />}
                        isActive={isSavedActive}
                    />

                    {/* PROFILE */}
                    <NavItem
                        label={t.profile || 'Profile'}
                        path="/profile/settings"
                        icon={<User size={20} />}
                        isActive={isProfileActive}
                    />
                </div>
            </nav>

            {/* Floating Trigger Action Button for Farming AI Assistant */}
            <button
                onClick={() => setIsFarmingAIAgentOpen(true)}
                type="button"
                className="fixed bottom-20 right-5 lg:bottom-8 lg:right-8 z-40 p-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl shadow-xl shadow-emerald-700/30 transition-all duration-200 active:scale-95 flex items-center gap-2.5 border border-emerald-400/40 backdrop-blur-md group"
                title="Ask Farming AI"
                aria-label="Ask Farming AI"
            >
                <div className="relative p-1 bg-white/20 rounded-xl">
                    <Bot size={20} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
                    </span>
                </div>
                <span className="hidden sm:inline-block font-bold text-xs pr-1 tracking-wide">
                    Ask Farming AI
                </span>
            </button>

            {/* AI Marketplace Agent Modal */}
            <AIMarketplaceAgentModal
                isOpen={isAIAgentOpen}
                onClose={() => setIsAIAgentOpen(false)}
                onLaunchForm={handleLaunchFormFromAI}
            />

            {/* Floating Farming AI Assistant Modal */}
            <FarmingAIAssistantModal
                isOpen={isFarmingAIAgentOpen}
                onClose={() => setIsFarmingAIAgentOpen(false)}
            />

            <CreateListingModal
                isOpen={isListingModalOpen}
                onClose={() => setIsListingModalOpen(false)}
                onSuccess={handleSuccess}
                initialData={aiInitialData}
            />
            <CreatePostModal
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                onSuccess={handleSuccess}
                initialData={aiInitialData}
            />
        </div>
    );
};

export default DashboardLayout;
