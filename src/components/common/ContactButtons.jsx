import { Phone, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ContactButtons = ({ phone, message = "" }) => {
    const { t } = useLanguage();
    const defaultMessage = t.contactMessageTemplate?.replace('{fishName}', '') || "Hello, I am interested in your listing.";
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message || defaultMessage)}`;
    
    return (
        <div className="flex gap-2 w-full">
            <a 
                href={`tel:${phone}`}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm"
            >
                <Phone size={18} />
                <span>{t.callNow || 'Call Now'}</span>
            </a>
            <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm"
            >
                <MessageCircle size={18} />
                <span>{t.whatsappContact || 'WhatsApp'}</span>
            </a>
        </div>
    );
};

export default ContactButtons;
