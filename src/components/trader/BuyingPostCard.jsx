import { MapPin, Ruler, Box, IndianRupee, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import ContactButtons from '../common/ContactButtons';
import OptimizedImage from '../common/OptimizedImage';

const BuyingPostCard = ({ post, isOwner, onEdit, onDelete }) => {
    const { t, formatDigit, language } = useLanguage();
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const photos = post.photos && post.photos.length > 0 ? post.photos : ['https://images.unsplash.com/photo-1524334228333-0f6db392f8a1?w=800'];


    const nextImage = (e) => {
        if (e) e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % photos.length);
    };

    const prevImage = (e) => {
        if (e) e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    useEffect(() => {
        if (photos.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % photos.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [currentImageIndex, photos.length]);

    return (
        <div 
            onClick={() => navigate(`/product/buying/${post._id}`)}
            className="card p-5 border-l-4 border-green-500 space-y-4 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
        >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-4 group/carousel">
                <OptimizedImage 
                    src={photos[currentImageIndex]} 
                    alt={post.fishName}
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
            </div>
            <div className="flex justify-between items-start gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                    <h3 className="font-bold text-xl text-gray-900 truncate">{post.fishName}</h3>
                    <div className="flex items-center gap-2">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            post.category === 'feed' ? 'bg-orange-100 text-orange-700' :
                            post.category === 'medicine' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                        }`}>
                            {t.categories[post.category] || post.category}
                        </span>
                        {isOwner && post.status !== 'approved' && (
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                post.status === 'pending' ? 'bg-orange-500 text-white' : 'bg-red-500 text-white'
                            }`}>
                                {post.status === 'pending' ? t.pending : t.rejected}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex-shrink-0 mt-1">
                    <span className="bg-gray-100 border border-gray-200 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap shadow-sm">
                        {t.buyingDemand}
                    </span>
                </div>
            </div>

            <div className="flex justify-between items-center py-3 border-y border-gray-50">
                <div className="flex items-center gap-2 text-sm min-w-0">
                    <Ruler size={16} className="text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                        <p className="text-gray-500 text-[10px] uppercase font-bold truncate">
                            {post.category === 'fish' ? t.size : t.packingSize}
                        </p>
                        <p className="font-semibold truncate">{formatDigit(post.size)}</p>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-2 text-sm min-w-0">
                    <div className="min-w-0 flex flex-col items-end">
                        <p className="text-gray-500 text-[10px] uppercase font-bold truncate text-right">{t.quantity}</p>
                        <p className="font-semibold truncate text-right">{formatDigit(post.requiredQuantity)}</p>
                    </div>
                    <Box size={16} className="text-gray-400 flex-shrink-0" />
                </div>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                    <IndianRupee size={18} className="text-primary" />
                    <span className="font-bold text-gray-900">{language === 'bn' ? 'টাকা' : '₹'} {formatDigit(post.buyingPrice)}</span>
                </div>
                <div className="text-xs text-gray-500 font-bold flex items-center gap-1">
                    <MapPin size={12} /> {t.districts[post.district] || post.district}
                </div>
            </div>

            {isOwner ? (
                <div className="pt-2 flex gap-2">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(post); }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Edit2 size={16} /> {t.edit}
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(post._id); }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Trash2 size={16} /> {t.delete}
                    </button>
                </div>
            ) : (
                <div className="pt-2">
                    <ContactButtons 
                        phone={post.phoneNumber} 
                        message={t.contactMessageTemplate.replace('{fishName}', post.fishName)}
                    />
                </div>
            )}
        </div>
    );
};


export default React.memo(BuyingPostCard);
