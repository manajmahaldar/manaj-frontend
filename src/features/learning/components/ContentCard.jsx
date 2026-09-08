import React, { useState, useEffect } from 'react';
import { Bookmark, Clock, Eye, Play, BookOpen, FileText } from 'lucide-react';
import { toggleBookmark } from '../api/learningApi';
import { useLanguage } from '../../../context/LanguageContext';
import { getLocalizedContent, getLocalizedLevel } from '../utils/learningTranslationHelper';

const ContentCard = ({ content }) => {
    const { language, t, formatDigit } = useLanguage();
    const [bookmarked, setBookmarked] = useState(false);

    const localized = getLocalizedContent(content, language) || content || {};

    useEffect(() => {
        if (content && content.userProgress) {
            setBookmarked(content.userProgress.bookmarked);
        }
    }, [content]);

    const handleBookmark = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const isBookmarked = await toggleBookmark(content._id);
            setBookmarked(isBookmarked);
        } catch (err) {
            console.error(err);
        }
    };

    const getIcon = () => {
        switch (content?.type) {
            case 'video': return <Play className="w-4 h-4 text-white" />;
            case 'pdf': return <FileText className="w-4 h-4 text-white" />;
            default: return <BookOpen className="w-4 h-4 text-white" />;
        }
    };

    const badgeColor = content?.type === 'video' ? 'bg-red-500' : content?.type === 'pdf' ? 'bg-blue-500' : 'bg-emerald-500';

    const getLangLabel = (code) => {
        switch (code) {
            case 'bn': return 'বাংলা';
            case 'hi': return 'हिन्दी';
            case 'or': return 'ଓଡ଼ିଆ';
            default: return 'English';
        }
    };

    return (
        <div className="card group hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col h-full bg-white rounded-2xl border border-gray-100">
            {/* Thumbnail Header */}
            <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                {localized.thumbnail ? (
                    <img 
                        src={localized.thumbnail} 
                        alt={localized.title} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-blue-500/10 to-cyan-500/10">
                        <BookOpen className="w-12 h-12 text-primary/30" />
                    </div>
                )}
                {/* Type Badge */}
                <div className={`absolute top-3 left-3 p-2 rounded-xl flex items-center justify-center shadow-lg ${badgeColor}`}>
                    {getIcon()}
                </div>
                {/* Duration Badge */}
                {localized.duration > 0 && (
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/70 text-white text-[10px] font-bold">
                        {formatDigit(localized.duration)} {t.lh_mins || 'mins'}
                    </div>
                )}
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
                        {localized.displayLevel || getLocalizedLevel(localized.level, language)}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="text-[10px] font-semibold text-gray-500">
                        {getLangLabel(localized.language || language)}
                    </span>
                </div>

                <h3 className="font-bold text-gray-900 leading-snug text-base mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {localized.title}
                </h3>

                <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">
                    {localized.description || 'MatsyaLink expert resources for aquaculture and sustainable fish farming.'}
                </p>

                {/* Footer Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                        <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {formatDigit(localized.viewCount || 0)} {t.lh_views || 'views'}
                        </span>
                        {localized.readingTime > 0 && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {formatDigit(localized.readingTime)} {t.lh_readTime || 'm read'}
                            </span>
                        )}
                    </div>

                    <button 
                        onClick={handleBookmark}
                        title={bookmarked ? (t.lh_bookmarked || 'Saved') : (t.lh_bookmark || 'Bookmark')}
                        className={`p-2 rounded-xl border transition-all ${
                            bookmarked 
                                ? 'bg-primary/5 border-primary/20 text-primary' 
                                : 'border-gray-100 hover:border-gray-200 text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        <Bookmark className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContentCard;
