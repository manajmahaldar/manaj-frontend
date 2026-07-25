import React, { useState, useEffect } from 'react';
import { Cookie, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const CookieConsentBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

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
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md bg-gray-900 text-white p-6 rounded-3xl shadow-2xl z-50 border border-gray-800 space-y-4 animate-in slide-in-from-bottom-5">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                    <Cookie size={24} />
                </div>
                <div className="space-y-1">
                    <h4 className="font-bold text-sm">Digital Personal Data Protection Notice</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                        We use essential cookies to maintain secure sessions. You can control optional analytics cookies under our <Link to="/cookie-policy" className="text-blue-400 underline font-semibold">Cookie Policy</Link>.
                    </p>
                </div>
            </div>

            <div className="flex gap-2 pt-2">
                <button 
                    onClick={handleRejectNonEssential}
                    className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs rounded-xl transition-all"
                >
                    Essential Only
                </button>
                <button 
                    onClick={handleAcceptAll}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all"
                >
                    Accept All
                </button>
            </div>
        </div>
    );
};

export default CookieConsentBanner;
