import { MapPin, BadgeCheck, Clock, Edit2, Trash2, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import ContactButtons from '../../../components/common/ContactButtons';
import OrderModal from './OrderModal';
import OptimizedImage from '../../../components/common/OptimizedImage';

const ListingCard = ({ item, isOwner, onEdit, onDelete, userRole }) => {
    const { t, formatDigit, language } = useLanguage();
    const navigate = useNavigate();
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef(null);

    const media = useMemo(() => {
        const list = [];
        if (item.video) list.push({ type: 'video', url: item.video });
        if (item.photos && item.photos.length > 0) {
            item.photos.forEach(p => list.push({ type: 'image', url: p }));
        }
        if (list.length === 0) {
            list.push({ type: 'image', url: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800' });
        }
        return list;
    }, [item.video, item.photos]);

    const nextMedia = useCallback((e) => {
        if (e) e.stopPropagation();
        setCurrentMediaIndex((prev) => (prev + 1) % media.length);
    }, [media.length]);

    const prevMedia = useCallback((e) => {
        if (e) e.stopPropagation();
        setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
    }, [media.length]);

    // Pause slideshow when component is not in viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );
        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (media.length <= 1 || !isVisible) return;
        if (media[currentMediaIndex]?.type === 'video') return;

        const timer = setInterval(() => {
            setCurrentMediaIndex((prev) => (prev + 1) % media.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [currentMediaIndex, media, isVisible]);

    const formatPostDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const isToday = date.getDate() === today.getDate() && 
                        date.getMonth() === today.getMonth() && 
                        date.getFullYear() === today.getFullYear();
        
        const isYesterday = date.getDate() === yesterday.getDate() && 
                            date.getMonth() === yesterday.getMonth() && 
                            date.getFullYear() === yesterday.getFullYear();

        if (isToday) return t.today || "Today";
        if (isYesterday) return t.yesterday || "Yesterday";

        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'numeric',
            year: '2-digit'
        });
    };

    return (
        <div 
            ref={cardRef}
            onClick={() => navigate(`/product/selling/${item._id}`)}
            className="card card-hover flex flex-col h-full group cursor-pointer"
        >
            {/* Media Section */}
            <div className="relative w-full aspect-[4/3] flex-shrink-0 overflow-hidden bg-surface-1 group/carousel">
                {media[currentMediaIndex].type === 'video' ? (
                    <video 
                        src={media[currentMediaIndex].url}
                        autoPlay muted playsInline
                        onEnded={() => nextMedia()}
                        className="object-cover w-full h-full group-hover/carousel:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <OptimizedImage 
                        src={media[currentMediaIndex].url} 
                        alt={item.productName}
                        className="object-cover w-full h-full group-hover/carousel:scale-105 transition-transform duration-500"
                    />
                )}
                
                {media.length > 1 && (
                    <>
                        <button onClick={prevMedia} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-text-primary p-1 rounded-full shadow-sm opacity-0 group-hover/carousel:opacity-100 transition-all z-10 active:scale-95">
                            <ChevronLeft size={16} />
                        </button>
                        <button onClick={nextMedia} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-text-primary p-1 rounded-full shadow-sm opacity-0 group-hover/carousel:opacity-100 transition-all z-10 active:scale-95">
                            <ChevronRight size={16} />
                        </button>
                        
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                            {media.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentMediaIndex ? 'bg-white scale-125' : 'bg-white/50'}`} 
                                />
                            ))}
                        </div>
                    </>
                )}

                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
                    {item.category !== 'Equipment' && (
                        <span className="badge badge-secondary shadow-xs uppercase">
                            {t.categories?.[item.category] || item.category}
                        </span>
                    )}
                    {isOwner && item.status !== 'approved' && (
                        <span className={`badge uppercase shadow-xs ${
                            item.status === 'pending' ? 'badge-warning' : 'badge-error'
                        }`}>
                            {item.status === 'pending' ? t.pending : t.rejected}
                        </span>
                    )}
                </div>
            </div>

            {/* Details Section */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                    <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="font-bold text-base text-text-primary group-hover:text-primary transition-colors flex-1 min-w-0 line-clamp-1 flex items-center gap-1">
                            <span className="truncate">{item.productName}</span>
                            {item.sellerId?.verifiedStatus === true && (
                                <BadgeCheck size={16} className="text-secondary flex-shrink-0" title="Verified Seller" />
                            )}
                        </h3>
                        <div className="text-right flex-shrink-0">
                            <p className="text-primary font-extrabold text-base leading-tight">
                                {language === 'bn' ? 'টাকা' : '₹'}{formatDigit(item.price)}
                            </p>
                            {item.category !== 'Equipment' && (
                                <p className="text-2xs text-text-tertiary font-semibold uppercase">{t.per} {item.unit}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-text-secondary font-medium pt-1">
                        <div 
                            className="flex items-center gap-1 truncate text-text-secondary"
                            title={item.policeStation 
                                ? `${t.districts?.[item.localDistrict] || item.localDistrict ? (t.districts?.[item.localDistrict] || item.localDistrict) + ', ' : ''}${t.districts?.[item.district] || item.district} (PS: ${t.policeStations?.[item.policeStation] || item.policeStation})` 
                                : (item.localDistrict ? `${t.districts?.[item.localDistrict] || item.localDistrict}, ${t.districts?.[item.district] || item.district}` : (t.districts?.[item.district] || item.district))}
                        >
                            <MapPin size={13} className="text-primary flex-shrink-0" />
                            <span className="truncate">
                                {item.policeStation 
                                    ? `${t.policeStations?.[item.policeStation] || item.policeStation}, ${t.districts?.[item.localDistrict] || item.localDistrict || t.districts?.[item.district] || item.district}` 
                                    : (item.localDistrict 
                                        ? `${t.districts?.[item.localDistrict] || item.localDistrict}, ${t.districts?.[item.district] || item.district}` 
                                        : (t.districts?.[item.district] || item.district))}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-text-tertiary flex-shrink-0">
                            <Clock size={12} />
                            <span>{formatPostDate(item.createdAt)}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-border">
                    {isOwner ? (
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                                className="btn btn-ghost btn-sm border border-border w-full gap-1"
                            >
                                <Edit2 size={13} /> {t.edit}
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDelete(item._id); }}
                                className="btn btn-danger-ghost btn-sm w-full gap-1"
                            >
                                <Trash2 size={13} /> {t.delete}
                            </button>
                        </div>
                    ) : userRole === 'trader' ? (
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsOrderModalOpen(true); }}
                            className="btn btn-primary btn-sm w-full gap-1.5"
                        >
                            <ShoppingBag size={14} /> {t.orderNow}
                        </button>
                    ) : (
                        <ContactButtons 
                            phone={item.phoneNumber} 
                            message={t.contactMessageTemplate?.replace('{fishName}', item.productName)}
                            variant="light"
                        />
                    )}
                </div>
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

export default React.memo(ListingCard);
