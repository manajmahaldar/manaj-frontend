import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Youtube, MessageCircle, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import logoImg from '../../assets/logo/logo.png';

const Footer = () => {
    const { t, formatDigit } = useLanguage();

    return (
        <footer className="bg-[#161616] text-white">
            {/* Main footer grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

                    {/* Brand */}
                    <div className="space-y-5">
                        <Link to="/" className="flex items-center gap-2.5">
                            <img loading="lazy" src={logoImg} alt="MatsyaLink Logo" className="h-9 w-auto object-contain" />
                            <span className="text-lg font-bold text-white">MatsyaLink</span>
                        </Link>
                        <p className="text-sm text-white/50 leading-relaxed font-medium">
                            {t.footerDesc}
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="#"
                                aria-label="Facebook"
                                className="w-9 h-9 rounded-lg bg-white/8 hover:bg-primary flex items-center justify-center transition-all duration-200 group"
                            >
                                <Facebook size={16} className="transition-transform group-hover:scale-110" />
                            </a>
                            <a
                                href="#"
                                aria-label="WhatsApp"
                                className="w-9 h-9 rounded-lg bg-white/8 hover:bg-secondary flex items-center justify-center transition-all duration-200 group"
                            >
                                <MessageCircle size={16} className="transition-transform group-hover:scale-110" />
                            </a>
                            <a
                                href="#"
                                aria-label="YouTube"
                                className="w-9 h-9 rounded-lg bg-white/8 hover:bg-error flex items-center justify-center transition-all duration-200 group"
                            >
                                <Youtube size={16} className="transition-transform group-hover:scale-110" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-5">
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">
                            {t.company}
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { label: t.listings, path: '/listings' },
                                { label: t.buyingPosts, path: '/posts' },
                                { label: t.about, path: '/about' },
                                { label: t.contact, path: '/contact' },
                            ].map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors duration-150 group"
                                    >
                                        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform text-white/25 group-hover:text-white/60" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-5">
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">
                            {t.legal}
                        </h4>
                        <ul className="space-y-2.5">
                            {[
                                { label: t.privacyPolicy,                        path: '/privacy-policy' },
                                { label: t.terms,                                 path: '/terms' },
                                { label: (t.cookiePolicy && t.cookiePolicy.title) || t.cookies, path: '/cookie-policy' },
                                { label: t.dataDeletionPolicy || t.dataDeletionTitle, path: '/data-deletion-policy' },
                                { label: t.refundPolicy || t.refundPolicyTitle, path: '/refund-policy' },
                                { label: t.shippingPolicy || t.shippingPolicyTitle, path: '/shipping-policy' },
                                { label: t.communityGuidelines || t.communityGuidelinesTitle, path: '/community-guidelines' },
                                { label: t.grievanceOfficer || (t.grievance && t.grievance.title) || t.grievanceOfficer, path: '/grievance' },
                                { label: t.securityNotice || t.securityNoticeTitle, path: '/security-notice' },
                            ].map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-xs text-white/40 hover:text-white/80 transition-colors duration-150"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-5">
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">
                            {t.helpline}
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0">
                                    <Phone size={14} className="text-white/60" />
                                </div>
                                <span className="text-sm font-semibold text-white/70">{formatDigit('7432879256')}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0">
                                    <Mail size={14} className="text-white/60" />
                                </div>
                                <span className="text-sm text-white/50">support@machbazar.com</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <MapPin size={14} className="text-white/60" />
                                </div>
                                <span className="text-sm text-white/50 leading-relaxed">{t.footerAddress}</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30 font-medium">
                    <p>© {formatDigit(new Date().getFullYear())} MatsyaLink · {t.allRightsReserved} · DPDP Act 2023 Compliant</p>
                    <div className="flex gap-6">
                        <Link to="/privacy-policy" className="hover:text-white/70 transition-colors">{t.privacyPolicy || (t.privacy && t.privacy.title)}</Link>
                        <Link to="/terms"          className="hover:text-white/70 transition-colors">{t.termsAlt || t.terms}</Link>
                        <Link to="/grievance"      className="hover:text-white/70 transition-colors">{t.grievanceOfficer || (t.grievance && t.grievance.title)}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default memo(Footer);
