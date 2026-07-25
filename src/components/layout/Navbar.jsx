import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { AuthContext, AuthActionsContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Languages, LayoutDashboard } from 'lucide-react';
import logoImg from '../../assets/logo/logo.png';
import { getDashboardPath } from '../../utils/roleUtils';
import api from '../../utils/api';

const Navbar = () => {
    const { user } = useContext(AuthContext);
    const { logout } = useContext(AuthActionsContext);
    const { t, language, changeLanguage } = useLanguage();
    const [isLangOpen, setIsLangOpen] = useState(false);
    const navigate = useNavigate();
    const langDropdownRef = useRef(null);

    const handleLogout = useCallback(() => {
        logout();
        navigate('/login');
    }, [logout, navigate]);

    // Close language dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
                setIsLangOpen(false);
            }
        };
        if (isLangOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isLangOpen]);

    const navLinks = useMemo(() => [
        { name: t.home, path: '/' },
    ], [t.home]);

    // Prefetch listings/posts data on hover for instant navigation
    const prefetchListings = useCallback(() => {
        if (sessionStorage.getItem('prefetch_listings')) return;
        api.get('/listings?page=1&limit=12').then(res => {
            sessionStorage.setItem('prefetch_listings', '1');
        }).catch(() => {});
    }, []);

    const prefetchPosts = useCallback(() => {
        if (sessionStorage.getItem('prefetch_posts')) return;
        api.get('/posts?page=1&limit=12').then(() => {
            sessionStorage.setItem('prefetch_posts', '1');
        }).catch(() => {});
    }, []);

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <img loading="eager" fetchpriority="high" src={logoImg} alt="Logo" className="h-12 md:h-20 w-auto object-contain" />
                        <span className="text-lg md:text-xl font-bold text-primary">MatsyaLink</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link key={link.path} to={link.path} className="text-gray-600 hover:text-primary font-medium">
                                {link.name}
                            </Link>
                        ))}
                        <Link to="/listings" onMouseEnter={prefetchListings} className="text-gray-600 hover:text-primary font-medium">{t.listings}</Link>
                        <Link to="/posts" onMouseEnter={prefetchPosts} className="text-gray-600 hover:text-primary font-medium">{t.buyingPosts}</Link>

                        {/* Language Dropdown */}
                        <div className="relative" ref={langDropdownRef}>
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 border-2 border-primary/20 hover:border-primary text-primary rounded-xl font-bold text-sm transition-all hover:bg-primary/5 active:scale-95"
                                title="Change Language"
                            >
                                <Languages size={18} />
                                <span className="uppercase">{language}</span>
                            </button>

                            {isLangOpen && (
                                <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200">
                                    {[
                                        { code: 'bn', label: 'বাংলা', sub: 'Bengali' },
                                        { code: 'en', label: 'English', sub: 'English' },
                                        { code: 'hi', label: 'हिंदी', sub: 'Hindi' },
                                        { code: 'or', label: 'ଓଡ଼ିଆ', sub: 'Odia' }
                                    ].map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                changeLanguage(lang.code);
                                                setIsLangOpen(false);
                                            }}
                                            className={`w-full text-left px-5 py-2.5 hover:bg-gray-50 flex flex-col transition-colors ${language === lang.code ? 'bg-blue-50 text-primary' : 'text-gray-700'}`}
                                        >
                                            <span className="font-bold text-sm">{lang.label}</span>
                                            <span className="text-[10px] font-medium opacity-60 uppercase tracking-widest">{lang.sub}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {!user ? (
                            <Link to="/register" className="bg-primary text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-95 transition-all">
                                {t.register}
                            </Link>
                        ) : (
                            <Link 
                                to={getDashboardPath(user.role)} 
                                className="flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-xl font-bold hover:bg-primary hover:text-white transition-all active:scale-95"
                            >
                                <LayoutDashboard size={18} />
                                {t.dashboard}
                            </Link>
                        )}
                    </div>

                    {/* Mobile Section */}
                    <div className="md:hidden flex items-center gap-3">
                        {/* Mobile language dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center gap-1 px-2.5 py-1.5 border border-primary/30 text-primary rounded-lg text-xs font-black uppercase tracking-widest active:scale-95"
                            >
                                <Languages size={14} />
                                {language}
                            </button>
                            
                            {isLangOpen && (
                                <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">
                                    {['bn', 'en', 'hi', 'or'].map((l) => (
                                        <button
                                            key={l}
                                            onClick={() => {
                                                changeLanguage(l);
                                                setIsLangOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest ${language === l ? 'bg-blue-50 text-primary' : 'text-gray-500'}`}
                                        >
                                            {l === 'bn' ? 'বাংলা' : l === 'en' ? 'English' : l === 'hi' ? 'हिंदी' : 'ଓଡ଼ିଆ'}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {!user ? (
                            <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-95 transition-all text-sm">
                                {t.register}
                            </Link>
                        ) : (
                            <Link 
                                to={getDashboardPath(user.role)} 
                                className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold hover:bg-primary hover:text-white transition-all active:scale-95 text-sm"
                            >
                                <LayoutDashboard size={16} />
                                {t.dashboard}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
