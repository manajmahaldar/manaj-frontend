import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { AuthContext, AuthActionsContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Languages, LayoutDashboard, ChevronDown } from 'lucide-react';
import logoImg from '../../assets/logo/logo.png';
import { getDashboardPath } from '../../utils/roleUtils';
import api from '../../utils/api';

const LANGS = [
    { code: 'bn', label: 'বাংলা',  sub: 'Bengali' },
    { code: 'en', label: 'English', sub: 'English' },
    { code: 'hi', label: 'हिंदी',   sub: 'Hindi'   },
    { code: 'or', label: 'ଓଡ଼ିଆ',   sub: 'Odia'    },
];

const Navbar = () => {
    const { user } = useContext(AuthContext);
    const { logout } = useContext(AuthActionsContext);
    const { t, language, changeLanguage } = useLanguage();
    const [isDesktopLangOpen, setIsDesktopLangOpen] = useState(false);
    const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    // Separate refs for desktop and mobile — MUST NOT share a single ref
    const desktopLangRef = useRef(null);
    const mobileLangRef  = useRef(null);

    const handleLogout = useCallback(() => {
        logout();
        navigate('/login');
    }, [logout, navigate]);

    // Close desktop dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (desktopLangRef.current && !desktopLangRef.current.contains(e.target)) {
                setIsDesktopLangOpen(false);
            }
        };
        if (isDesktopLangOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isDesktopLangOpen]);

    // Close mobile dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (mobileLangRef.current && !mobileLangRef.current.contains(e.target)) {
                setIsMobileLangOpen(false);
            }
        };
        if (isMobileLangOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isMobileLangOpen]);

    // Subtle shadow on scroll
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 8);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prefetch listings data on hover for instant navigation
    const prefetchListings = useCallback(() => {
        if (sessionStorage.getItem('prefetch_listings')) return;
        api.get('/listings?page=1&limit=12').then(() => {
            sessionStorage.setItem('prefetch_listings', '1');
        }).catch(() => {});
    }, []);

    const prefetchPosts = useCallback(() => {
        if (sessionStorage.getItem('prefetch_posts')) return;
        api.get('/posts?page=1&limit=12').then(() => {
            sessionStorage.setItem('prefetch_posts', '1');
        }).catch(() => {});
    }, []);

    const navLinks = useMemo(() => [
        { name: t.home, path: '/' },
    ], [t.home]);

    const handleLanguageSelect = useCallback((code) => {
        changeLanguage(code);
        setIsDesktopLangOpen(false);
        setIsMobileLangOpen(false);
    }, [changeLanguage]);

    return (
        <nav className={`bg-white sticky top-0 z-50 transition-shadow duration-200 ${isScrolled ? 'shadow-sm border-b border-border' : 'border-b border-border-subtle'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center gap-4">

                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
                        <img
                            loading="eager"
                            fetchpriority="high"
                            src={logoImg}
                            alt="MatsyaLink Logo"
                            className="h-9 w-auto object-contain"
                        />
                        <span className="text-base font-bold text-text-primary tracking-tight">
                            MatsyaLink
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="px-3.5 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-1 rounded-lg transition-all duration-150"
                                onMouseEnter={link.path === '/listings' ? prefetchListings : link.path === '/posts' ? prefetchPosts : undefined}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop right section */}
                    <div className="hidden md:flex items-center gap-2">
                        {/* Desktop Language Dropdown — uses its own ref */}
                        <div className="relative" ref={desktopLangRef}>
                            <button
                                onClick={() => setIsDesktopLangOpen(prev => !prev)}
                                className="btn btn-ghost btn-sm gap-1.5 text-text-secondary"
                                title="Change Language"
                                aria-haspopup="listbox"
                                aria-expanded={isDesktopLangOpen}
                            >
                                <Languages size={16} />
                                <span className="font-semibold uppercase text-xs">{language}</span>
                                <ChevronDown size={14} className={`transition-transform duration-200 ${isDesktopLangOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isDesktopLangOpen && (
                                <div
                                    className="absolute top-full right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-border py-1.5 z-50"
                                    role="listbox"
                                >
                                    {LANGS.map((lang) => (
                                        <button
                                            key={lang.code}
                                            role="option"
                                            aria-selected={language === lang.code}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => handleLanguageSelect(lang.code)}
                                            className={`w-full text-left px-4 py-2.5 flex items-center justify-between transition-colors duration-150 ${
                                                language === lang.code
                                                    ? 'bg-primary-muted text-primary'
                                                    : 'text-text-primary hover:bg-surface-1'
                                            }`}
                                        >
                                            <span className="font-semibold text-sm">{lang.label}</span>
                                            <span className="text-2xs font-medium text-text-tertiary uppercase tracking-wider">{lang.sub}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Auth CTA */}
                        {!user ? (
                            <Link to="/register" className="btn btn-primary btn-sm">
                                {t.register}
                            </Link>
                        ) : (
                            <Link
                                to={getDashboardPath(user.role)}
                                className="btn btn-ghost btn-sm text-primary hover:bg-primary-muted"
                            >
                                <LayoutDashboard size={16} />
                                {t.dashboard}
                            </Link>
                        )}
                    </div>

                    {/* Mobile section */}
                    <div className="md:hidden flex items-center gap-2">
                        {/* Mobile Language Dropdown — uses its own ref */}
                        <div className="relative" ref={mobileLangRef}>
                            <button
                                onClick={() => setIsMobileLangOpen(prev => !prev)}
                                className="btn-icon btn-ghost text-text-secondary w-9 h-9"
                                title="Change Language"
                                aria-label="Change Language"
                            >
                                <Languages size={18} />
                            </button>

                            {isMobileLangOpen && (
                                <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-border py-1.5 z-50">
                                    {LANGS.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => handleLanguageSelect(lang.code)}
                                            className={`w-full text-left px-4 py-2 text-sm font-semibold transition-colors ${
                                                language === lang.code
                                                    ? 'bg-primary-muted text-primary'
                                                    : 'text-text-primary hover:bg-surface-1'
                                            }`}
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile auth CTA */}
                        {!user ? (
                            <Link to="/register" className="btn btn-primary btn-sm">
                                {t.register}
                            </Link>
                        ) : (
                            <Link
                                to={getDashboardPath(user.role)}
                                className="btn btn-ghost btn-sm text-primary w-9 h-9 p-0"
                            >
                                <LayoutDashboard size={18} />
                            </Link>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
