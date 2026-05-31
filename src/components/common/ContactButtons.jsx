import { Phone, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ContactButtons = ({ phone, message = "", variant = "colored" }) => {
    const { t } = useLanguage();
    const defaultMessage = t.contactMessageTemplate?.replace('{fishName}', '') || "Hello, I am interested in your listing.";
    const whatsappUrl = `https://wa.me/${phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message || defaultMessage)}`;
    
    const isLight = variant === 'light';

    return (
        <div className="flex gap-2 w-full">
            <a 
                href={`tel:${phone}`}
                onClick={(e) => e.stopPropagation()}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all font-bold text-sm shadow-sm active:scale-95 ${
                    isLight 
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 shadow-lg'
                }`}
            >
                <Phone size={18} className={isLight ? 'text-blue-600' : ''} />
                <span>{t.callNow || 'Call Now'}</span>
            </a>
            <a 
                href={whatsappUrl}
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all font-bold text-sm shadow-sm active:scale-95 ${
                    isLight 
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                    : 'bg-green-100 hover:bg-green-200 text-green-700 border border-green-200/50'
                } ${!isLight && 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/20 shadow-lg'}`}
            >
                <MessageCircle size={18} className={isLight ? 'text-green-600' : ''} />
                <span>{t.whatsappContact || 'WhatsApp'}</span>
            </a>
        </div>
    );
};

export default ContactButtons;
