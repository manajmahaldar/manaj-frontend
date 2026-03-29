import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { User, LogOut, Menu, X, Languages } from 'lucide-react';
import logoImg from '../../assets/logo/logo.png';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { t, language, toggleLanguage, changeLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: t.home, path: '/' },
        { name: t.listings, path: '/listings' },
        { name: t.buyingPosts, path: '/posts' },
        { name: t.knowledge, path: '/knowledge' },
        { name: t.about, path: '/about' },
    ];

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center">
                        <img src={logoImg} alt="Logo" className="h-20 w-auto object-contain" />
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
                                        { code: 'hi', label: 'हिंदी', sub: 'Hindi' }
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

                        {user ? (
                            <div className="flex items-center gap-4 border-l pl-4">
                                <Link to="/profile" className="flex items-center gap-1 text-gray-700">
                                    <User size={20} />
                                    <span>{user.name}</span>
                                </Link>
                                <button onClick={handleLogout} className="text-red-500 hover:text-red-600">
                                    <LogOut size={20} />
                                </button>
                                {user.role === 'admin' && (
                                    <Link to="/admin/dashboard" className="bg-primary text-white px-4 py-1.5 rounded-md text-sm">{t.adminDashboard}</Link>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="bg-primary text-white px-6 py-2 rounded-lg font-medium">{t.login}</Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
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
                                    {['bn', 'en', 'hi'].map((l) => (
                                        <button
                                            key={l}
                                            onClick={() => {
                                                changeLanguage(l);
                                                setIsLangOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest ${language === l ? 'bg-blue-50 text-primary' : 'text-gray-500'}`}
                                        >
                                            {l === 'bn' ? 'বাংলা' : l === 'en' ? 'English' : 'हिंदी'}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.path} 
                            to={link.path} 
                            onClick={() => setIsOpen(false)}
                            className="block text-gray-700 font-medium text-lg"
                        >
                            {link.name}
                        </Link>
                    ))}
                    {user ? (
                        <>
                            <Link to="/profile" onClick={() => setIsOpen(false)} className="block text-gray-700 font-medium">{t.profile}</Link>
                            {user.role === 'admin' && (
                                <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="block text-primary font-bold">{t.adminDashboard}</Link>
                            )}
                            <button onClick={handleLogout} className="w-full text-left text-red-500 font-medium">{t.logout}</button>
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setIsOpen(false)} className="block bg-primary text-white text-center py-3 rounded-lg">{t.login}</Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
