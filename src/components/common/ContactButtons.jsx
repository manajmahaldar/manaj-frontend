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
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Modal Card */}
            <div
                className="relative w-full max-w-sm rounded-xl bg-white shadow-xl overflow-hidden border border-border"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 btn-icon btn-ghost w-8 h-8 text-text-tertiary hover:text-text-primary"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="p-6 text-center space-y-4">
                    {/* Icon */}
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary-muted text-primary flex items-center justify-center">
                        <Lock className="w-6 h-6" />
                    </div>

                    {/* Heading & Desc */}
                    <div>
                        <h2 className="text-lg font-bold text-text-primary mb-1">
                            {t.loginRequiredTitle || 'Login Required'}
                        </h2>
                        <p className="text-text-secondary text-sm">
                            {t.loginRequiredDesc || 'Please create an account or log in to contact sellers.'}
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-2 pt-2">
                        <button
                            onClick={() => { onClose(); navigate('/register'); }}
                            className="btn btn-primary btn-md w-full gap-2"
                        >
                            <UserPlus className="w-4 h-4" />
                            {t.registerNow || 'Register Now'}
                        </button>
                        <button
                            onClick={() => { onClose(); navigate('/login'); }}
                            className="btn btn-ghost btn-md border border-border w-full gap-2"
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
    };

    return (
        <>
            {showModal && (
                <AuthModal t={t} onClose={() => setShowModal(false)} />
            )}
            <div className="flex gap-2 w-full">
                <a
                    href={user ? `tel:${phone}` : '#'}
                    onClick={(e) => handleProtectedClick(e, 'call')}
                    className={`btn btn-sm flex-1 truncate ${
                        isLight
                        ? 'btn-outline border-border text-text-primary hover:bg-surface-2'
                        : 'btn-primary'
                    }`}
                >
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{t.callNow || 'Call Now'}</span>
                </a>
                <a
                    href={user ? whatsappUrl : '#'}
                    onClick={(e) => handleProtectedClick(e, 'whatsapp')}
                    target={user ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className={`btn btn-sm flex-1 truncate ${
                        isLight
                        ? 'btn-ghost border border-border text-text-primary hover:bg-surface-2'
                        : 'btn-secondary'
                    }`}
                >
                    <MessageCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{t.whatsappContact || 'WhatsApp'}</span>
                </a>
            </div>
        </>
    );
};

export default ContactButtons;
