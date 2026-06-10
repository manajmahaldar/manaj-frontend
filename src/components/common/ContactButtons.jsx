import { Phone, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ContactButtons = ({ phone, message = "", variant = "colored" }) => {
    const { t } = useLanguage();
    const defaultMessage = t.contactMessageTemplate?.replace('{fishName}', '') || "Hello, I am interested in your listing.";
    const whatsappUrl = `https://wa.me/${phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message || defaultMessage)}`;
    
    const isLight = variant === 'light';

    return (
        <div className="flex gap-1.5 md:gap-2 w-full">
            <a 
                href={`tel:${phone}`}
                onClick={(e) => e.stopPropagation()}
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
                href={whatsappUrl}
                onClick={(e) => e.stopPropagation()}
                target="_blank"
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
    );
};

export default ContactButtons;
