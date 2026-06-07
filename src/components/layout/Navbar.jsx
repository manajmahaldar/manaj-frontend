import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Languages, LayoutDashboard } from 'lucide-react';
import logoImg from '../../assets/logo/logo.png';
import { getDashboardPath } from '../../utils/roleUtils';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { t, language, toggleLanguage, changeLanguage } = useLanguage();
    const [isLangOpen, setIsLangOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: t.home, path: '/' },
    ];

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logoImg} alt="Logo" className="h-12 md:h-20 w-auto object-contain" />
                        <span className="text-lg md:text-xl font-bold text-primary">MatsyaLink</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link key={link.path} to={link.path} className="text-gray-600 hover:text-primary font-medium">
                                {link.name}
                            </Link>
                        ))}

                        {/* Language Dropdown */}
                        <div className="relative">
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
