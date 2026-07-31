import { MapPin, Ruler, Box, IndianRupee, Edit2, Trash2, ChevronLeft, ChevronRight, BadgeCheck } from 'lucide-react';
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import ContactButtons from '../common/ContactButtons';
import OptimizedImage from '../common/OptimizedImage';

const BuyingPostCard = ({ post, isOwner, onEdit, onDelete }) => {
    const { t, formatDigit, language } = useLanguage();
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef(null);

    const photos = useMemo(() => {
        return post.photos && post.photos.length > 0
            ? post.photos
            : ['https://images.unsplash.com/photo-1524334228333-0f6db392f8a1?w=800'];
    }, [post.photos]);

    const nextImage = useCallback((e) => {
        if (e) e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % photos.length);
    }, [photos.length]);

    const prevImage = useCallback((e) => {
        if (e) e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }, [photos.length]);

    // IntersectionObserver to pause slideshow when off-screen
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );
        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (photos.length <= 1 || !isVisible) return;

        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % photos.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [currentImageIndex, photos.length, isVisible]);

    return (
        <div 
            ref={cardRef}
            onClick={() => navigate(`/product/buying/${post._id}`)}
            className="card card-hover flex flex-col h-full group cursor-pointer"
        >
            {/* Image Header */}
            <div className="relative w-full aspect-[4/3] flex-shrink-0 overflow-hidden bg-surface-1 group/carousel">
                <OptimizedImage 
                    src={photos[currentImageIndex]} 
                    alt={post.fishName}
                    className="object-cover w-full h-full group-hover/carousel:scale-105 transition-transform duration-500"
                />
                
                {photos.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-text-primary p-1 rounded-full shadow-sm opacity-0 group-hover/carousel:opacity-100 transition-all z-10 active:scale-95">
                            <ChevronLeft size={16} />
                        </button>
                        <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-text-primary p-1 rounded-full shadow-sm opacity-0 group-hover/carousel:opacity-100 transition-all z-10 active:scale-95">
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

                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
                    <span className="badge badge-primary uppercase shadow-xs">
                        {t.categories?.[post.category] || post.category}
                    </span>
                    {isOwner && post.status !== 'approved' && (
                        <span className={`badge uppercase shadow-xs ${
                            post.status === 'pending' ? 'badge-warning' : 'badge-error'
                        }`}>
                            {post.status === 'pending' ? t.pending : t.rejected}
                        </span>
                    )}
                </div>

                <div className="absolute top-2.5 right-2.5 z-10">
                    <span className="badge badge-neutral shadow-xs uppercase">
                        {t.buyingDemand}
                    </span>
                </div>
            </div>
            
            {/* Card Content */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                    <h3 className="font-bold text-base text-text-primary group-hover:text-primary transition-colors flex items-center gap-1">
                        <span className="truncate">{post.fishName}</span>
                        {post.traderId?.verifiedStatus === true && (
                            <BadgeCheck size={16} className="text-secondary flex-shrink-0" title="Verified Trader" />
                        )}
                    </h3>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-2 bg-surface-1 p-2.5 rounded-lg text-xs">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <Ruler className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="text-2xs text-text-tertiary font-semibold uppercase">{post.category === 'fish' ? t.size : t.packingSize}</p>
                                <p className="font-semibold text-text-primary truncate">{formatDigit(post.size)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 min-w-0">
                            <Box className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="text-2xs text-text-tertiary font-semibold uppercase">{t.quantity}</p>
                                <p className="font-semibold text-text-primary truncate">{formatDigit(post.requiredQuantity)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1 text-primary font-extrabold text-base">
                            <IndianRupee className="w-4 h-4" />
                            <span>{formatDigit(post.buyingPrice)}</span>
                        </div>
                        <div className="text-xs text-text-secondary font-medium flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                            <span className="truncate">
                                {post.policeStation 
                                    ? `${t.policeStations?.[post.policeStation] || post.policeStation}, ${t.districts?.[post.localDistrict] || post.localDistrict || t.districts?.[post.district] || post.district}` 
                                    : (post.localDistrict 
                                        ? `${t.districts?.[post.localDistrict] || post.localDistrict}, ${t.districts?.[post.district] || post.district}` 
                                        : (t.districts?.[post.district] || post.district))}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-2 border-t border-border">
                    {isOwner ? (
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                onClick={(e) => { e.stopPropagation(); onEdit(post); }}
                                className="btn btn-ghost btn-sm border border-border w-full gap-1"
                            >
                                <Edit2 className="w-3.5 h-3.5" /> {t.edit}
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDelete(post._id); }}
                                className="btn btn-danger-ghost btn-sm w-full gap-1"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> {t.delete}
                            </button>
                        </div>
                    ) : (
                        <ContactButtons 
                            phone={post.phoneNumber} 
                            message={t.contactMessageTemplate?.replace('{fishName}', post.fishName) || ''}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(BuyingPostCard);
