import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Youtube, MessageCircle, Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import logoImg from '../../assets/logo/logo.png';

const Footer = () => {
    const { t, formatDigit, language } = useLanguage();


    return (
        <footer className="bg-gray-900 text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6 text-center md:text-left flex flex-col items-center md:items-start">
                        <Link to="/" className="flex items-center justify-center md:justify-start gap-2">
                            <img loading="lazy" src={logoImg} alt="MatsyaLink Logo" className="h-14 w-auto object-contain" />
                            <span className="text-2xl font-black text-white">MatsyaLink</span>
                        </Link>
                        <p className="text-gray-400 font-medium leading-relaxed">
                            {t.footerDesc}
                        </p>
                        <div className="flex justify-center md:justify-start gap-4">
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-all group">
                                <Facebook size={20} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-green-600 transition-all group">
                                <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-red-600 transition-all group">
                                <Youtube size={20} className="group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6 text-center md:text-left flex flex-col items-center md:items-start">
                        <h4 className="text-lg font-black uppercase tracking-widest text-blue-400">{t.company}</h4>
                        <ul className="space-y-4 w-full flex flex-col items-center md:items-start">
                            <li>
                                <Link to="/listings" className="text-gray-400 hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2 group">
                                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    {t.listings}
                                </Link>
                            </li>
                            <li>
                                <Link to="/posts" className="text-gray-400 hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2 group">
                                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    {t.buyingPosts}
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2 group">
                                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    {t.about}
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2 group">
                                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    {t.contact}
                                </Link>
                            </li>

                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div className="space-y-6 text-center md:text-left flex flex-col items-center md:items-start">
                        <h4 className="text-lg font-black uppercase tracking-widest text-green-400">{t.legal}</h4>
                        <ul className="space-y-2.5 w-full flex flex-col items-center md:items-start text-xs font-medium">
                            <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</Link></li>
                            <li><Link to="/cookie-policy" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link></li>
                            <li><Link to="/data-deletion-policy" className="text-gray-400 hover:text-white transition-colors">Data Deletion Policy</Link></li>
                            <li><Link to="/refund-policy" className="text-gray-400 hover:text-white transition-colors">Refund Policy</Link></li>
                            <li><Link to="/shipping-policy" className="text-gray-400 hover:text-white transition-colors">Shipping Policy</Link></li>
                            <li><Link to="/community-guidelines" className="text-gray-400 hover:text-white transition-colors">Community Guidelines</Link></li>
                            <li><Link to="/grievance" className="text-gray-400 hover:text-white transition-colors">Grievance Officer</Link></li>
                            <li><Link to="/security-notice" className="text-gray-400 hover:text-white transition-colors">Security Notice</Link></li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className="space-y-6 text-center md:text-left flex flex-col items-center md:items-start">
                        <h4 className="text-lg font-black uppercase tracking-widest text-purple-400">{t.helpline}</h4>
                        <div className="space-y-4 w-full flex flex-col items-center md:items-start">
                            <div className="flex items-center justify-center md:justify-start gap-3 text-gray-400 hover:text-white transition-colors">
                                <Phone size={18} className="text-blue-500 flex-shrink-0" />
                                <span className="font-bold">{formatDigit('7432879256')}</span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-3 text-gray-400 hover:text-white transition-colors">
                                <Mail size={18} className="text-green-500 flex-shrink-0" />
                                <span className="font-medium">support@machbazar.com</span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-3 text-gray-400 hover:text-white transition-colors text-left md:text-left">
                                <MapPin size={18} className="text-purple-500 flex-shrink-0" />
                                <span className="font-medium text-sm text-center md:text-left">{t.footerAddress}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500 font-bold text-center md:text-left">
                    <p>© {formatDigit(new Date().getFullYear())} MatsyaLink। {t.allRightsReserved}। DPDP Act 2023 Compliant.</p>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                        <Link to="/privacy-policy" className="hover:text-white transition-colors whitespace-nowrap">Privacy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors whitespace-nowrap">Terms</Link>
                        <Link to="/grievance" className="hover:text-white transition-colors whitespace-nowrap">Grievance Desk</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default memo(Footer);
