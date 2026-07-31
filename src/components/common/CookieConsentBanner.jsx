import React, { useState, useEffect } from 'react';
import { Cookie, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useLanguage } from '../../context/LanguageContext';

const CookieConsentBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    const { t } = useLanguage();

    useEffect(() => {
        const consent = localStorage.getItem('matsyalink_cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAcceptAll = () => {
        localStorage.setItem('matsyalink_cookie_consent', 'accepted');
        localStorage.setItem('matsyalink_cookie_preferences', JSON.stringify({
            essential: true, analytics: true, functional: true, marketing: false
        }));
        setIsVisible(false);
    };

    const handleRejectNonEssential = () => {
        localStorage.setItem('matsyalink_cookie_consent', 'rejected_optional');
        localStorage.setItem('matsyalink_cookie_preferences', JSON.stringify({
            essential: true, analytics: false, functional: false, marketing: false
        }));
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            {/* Overlay */}
            <div className="hidden md:block absolute inset-0 bg-black/30" onClick={() => setIsVisible(false)} style={{ pointerEvents: 'auto' }}></div>

            {/* Banner Container */}
            <div className="absolute bottom-0 left-0 right-0 md:bottom-1/2 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 md:translate-y-1/2 md:w-auto md:max-w-md pointer-events-auto">
                <div className="mx-3 mb-3 md:m-0 bg-gray-900 text-white p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-2xl border border-gray-800 space-y-4 animate-in slide-in-from-bottom-5">
                    {/* Close button for mobile */}
                    <button
                        onClick={() => setIsVisible(false)}
                        className="md:hidden absolute top-4 right-4 p-1 hover:bg-gray-800 rounded-lg transition-all"
                        aria-label="Close"
                    >
                        <X size={18} className="text-gray-400" />
                    </button>

                    <div className="flex items-start gap-3 pr-6 md:pr-0">
                        <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl flex-shrink-0">
                            <Cookie size={24} />
                        </div>
                        <div className="space-y-1.5 min-w-0">
                            <h4 className="font-bold text-sm md:text-base">{t.cookiePolicy?.bannerTitle || 'Digital Personal Data Protection Notice'}</h4>
                            <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                                {t.cookiePolicy?.bannerDescStart || 'We use essential cookies to maintain secure sessions.'} {t.cookiePolicy?.bannerDescEnd || 'You can control optional analytics cookies under our'} <Link to="/cookie-policy" className="text-blue-400 underline font-semibold hover:text-blue-300">{t.cookiePolicy?.title || 'Cookie Policy'}</Link>.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <button 
                            onClick={handleRejectNonEssential}
                            className="w-full sm:flex-1 py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs md:text-sm rounded-xl transition-all active:scale-95"
                        >
                            {t.cookiePolicy?.essentialOnly || 'Essential Only'}
                        </button>
                        <button 
                            onClick={handleAcceptAll}
                            className="w-full sm:flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs md:text-sm rounded-xl transition-all active:scale-95"
                        >
                            {t.cookiePolicy?.acceptAll || 'Accept All'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsentBanner;
