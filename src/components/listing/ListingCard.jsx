import { MapPin, Phone, BadgeCheck, Clock, Edit2, Trash2, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import ContactButtons from '../common/ContactButtons';
import OrderModal from './OrderModal';

const ListingCard = ({ item, isOwner, onEdit, onDelete, userRole }) => {
    const { t, formatDigit, language } = useLanguage();
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const photos = item.photos && item.photos.length > 0 ? item.photos : ['https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800'];


    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % photos.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    return (
        <div className="card group hover:shadow-xl transition-all duration-300">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-4 group/carousel">
                <img 
                    src={photos[currentImageIndex]} 
                    alt={item.productName}
                    className="object-cover w-full h-full group-hover/carousel:scale-105 transition-transform duration-500"
                />
                
                {photos.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all z-10 active:scale-95">
                            <ChevronLeft size={16} />
                        </button>
                        <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all z-10 active:scale-95">
                            <ChevronRight size={16} />
                        </button>
                        
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                            {photos.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`} 
                                />
                            ))}
                        </div>
                    </>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-md text-primary px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        {t.categories[item.category] || item.category}
                    </span>
                </div>
            </div>

            <div className="space-y-3 px-2 pb-2">
                <div className="flex justify-between items-start gap-3">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors flex-1 min-w-0 break-words line-clamp-2">
                        {item.productName}
                    </h3>
                    <div className="flex flex-col items-end flex-shrink-0">
                        <p className="text-primary font-black text-xl leading-none whitespace-nowrap">{language === 'bn' ? 'টাকা' : '₹'} {formatDigit(item.price)}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{t.per} {item.unit}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-1.5 bg-gray-50 p-2 rounded-lg">
                        <MapPin size={14} className="text-primary" />
                        <span className="truncate">{t.districts[item.district] || item.district}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 p-2 rounded-lg">
                         <Clock size={14} className="text-primary" />
                        <span>{formatDigit(2)} {t.daysAgo}</span>
                    </div>
                </div>

                {isOwner ? (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            <Edit2 size={16} /> {t.edit}
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(item._id); }}
                            className="bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            <Trash2 size={16} /> {t.delete}
                        </button>
                    </div>
                ) : userRole === 'trader' ? (
                    <button 
                        onClick={() => setIsOrderModalOpen(true)}
                        className="w-full bg-primary hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                        <ShoppingBag size={18} /> {t.orderNow}
                    </button>
                ) : (
                    <ContactButtons 
                        phone={item.phoneNumber} 
                        message={t.contactMessageTemplate?.replace('{fishName}', item.productName)}
                        variant="light"
                    />
                )}
            </div>

            <OrderModal 
                isOpen={isOrderModalOpen} 
                onClose={() => setIsOrderModalOpen(false)} 
                listing={item}
                onSuccess={() => {}}
            />
        </div>
    );
};

export default ListingCard;
