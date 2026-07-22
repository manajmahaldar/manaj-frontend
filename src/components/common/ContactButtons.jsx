import { useState } from 'react';
import { Phone, MessageCircle, X, UserPlus, LogIn, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import useAuth from '../../features/auth/hooks/useAuth';

const AuthModal = ({ onClose, t }) => {
    const navigate = useNavigate();
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal Card */}
            <div
                className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
                    border: '1px solid rgba(99,102,241,0.25)',
                }}
            >
                {/* Top glow bar */}
                <div style={{ height: 3, background: 'linear-gradient(90deg, #6366f1, #22c55e, #3b82f6)' }} />

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="p-6 pt-5">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #3b82f6)' }}>
                            <Lock className="w-7 h-7 text-white" />
                        </div>
                    </div>

                    {/* Heading */}
                    <h2 className="text-center text-white font-bold text-lg mb-1">
                        {t.loginRequiredTitle || 'Login Required'}
                    </h2>
                    <p className="text-center text-gray-400 text-sm mb-6">
                        {t.loginRequiredDesc || 'Please create an account or log in to contact sellers.'}
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => { onClose(); navigate('/register'); }}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white transition-all active:scale-95 shadow-lg"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #3b82f6)' }}
                        >
                            <UserPlus className="w-4 h-4" />
                            {t.registerNow || 'Register Now'}
                        </button>
                        <button
                            onClick={() => { onClose(); navigate('/login'); }}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all active:scale-95 border"
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                borderColor: 'rgba(255,255,255,0.15)',
                                color: '#e2e8f0',
                            }}
                        >
                            <LogIn className="w-4 h-4" />
                            {t.loginBtn || 'Login'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContactButtons = ({ phone, message = "", variant = "colored" }) => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);

    const defaultMessage = t.contactMessageTemplate?.replace('{fishName}', '') || "Hello, I am interested in your listing.";
    const whatsappUrl = `https://wa.me/${phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message || defaultMessage)}`;

    const isLight = variant === 'light';

    const handleProtectedClick = (e, action) => {
        e.stopPropagation();
        if (!user) {
            e.preventDefault();
            setShowModal(true);
            return;
        }
        // If logged in, action (navigation) proceeds naturally for <a> tags
    };

    return (
        <>
            {showModal && (
                <AuthModal t={t} onClose={() => setShowModal(false)} />
            )}
            <div className="flex gap-1.5 md:gap-2 w-full">
                <a
                    href={user ? `tel:${phone}` : '#'}
                    onClick={(e) => handleProtectedClick(e, 'call')}
                    className={`flex-1 flex items-center justify-center gap-1.5 md:gap-2 py-2 md:py-3 px-1 md:px-4 rounded-lg md:rounded-xl transition-all font-bold text-[10px] md:text-sm shadow-sm active:scale-95 whitespace-nowrap overflow-hidden ${
                        isLight
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 shadow-lg'
                    }`}
                >
                    <Phone className={`w-3.5 h-3.5 md:w-[18px] md:h-[18px] flex-shrink-0 ${isLight ? 'text-blue-600' : ''}`} />
                    <span className="truncate">{t.callNow || 'Call Now'}</span>
                </a>
                <a
                    href={user ? whatsappUrl : '#'}
                    onClick={(e) => handleProtectedClick(e, 'whatsapp')}
                    target={user ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className={`flex-1 flex items-center justify-center gap-1.5 md:gap-2 py-2 md:py-3 px-1 md:px-4 rounded-lg md:rounded-xl transition-all font-bold text-[10px] md:text-sm shadow-sm active:scale-95 whitespace-nowrap overflow-hidden ${
                        isLight
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        : 'bg-green-100 hover:bg-green-200 text-green-700 border border-green-200/50'
                    } ${!isLight ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/20 shadow-lg' : ''}`}
                >
                    <MessageCircle className={`w-3.5 h-3.5 md:w-[18px] md:h-[18px] flex-shrink-0 ${isLight ? 'text-green-600' : ''}`} />
                    <span className="truncate">{t.whatsappContact || 'WhatsApp'}</span>
                </a>
            </div>
        </>
    );
};

export default ContactButtons;

