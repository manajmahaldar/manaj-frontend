import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';
import OptimizedImage from '../common/OptimizedImage';
import OptimizedVideo from '../common/OptimizedVideo';
import HomeSearch from './HomeSearch';

const FALLBACK_VIDEO1 = '/video-folder/WhatsApp%20Video%202026-05-14%20at%2010.59.14%20PM.mp4';
const FALLBACK_VIDEO2 = '/video-folder/WhatsApp%20Video%202026-05-14%20at%208.03.59%20PM.mp4';
const FALLBACK_IMAGE  = '/hero-fish-new.png';

const Hero = () => {
    const { t, formatDigit } = useLanguage();
    const [heroMedia, setHeroMedia] = useState({ video1Url: '', video2Url: '', heroImageUrl: '' });

    useEffect(() => {
        api.get('/hero-settings')
            .then(({ data }) => { if (data) setHeroMedia(data); })
            .catch(() => {}); // silently fall back to local files
    }, []);

    const video1Src    = heroMedia.video1Url    || FALLBACK_VIDEO1;
    const video2Src    = heroMedia.video2Url    || FALLBACK_VIDEO2;
    const heroImageSrc = heroMedia.heroImageUrl || FALLBACK_IMAGE;

    return (
        <section className="relative bg-white overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-20 md:pt-16 md:pb-28 px-4 sm:px-6 md:px-8">
            {/* Subtle decorative background */}
            <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-[500px] h-[500px] bg-primary-muted rounded-full blur-[100px] opacity-60 -z-10 animate-gentle-pulse pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[300px] h-[300px] bg-secondary-muted rounded-full blur-[80px] opacity-40 -z-10 animate-gentle-pulse pointer-events-none" />

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-20">

                {/* Text Content */}
                <div className="flex-1 space-y-7 text-center lg:text-left order-2 lg:order-1">

                    {/* Eyebrow badge */}
                    <div className="inline-flex items-center gap-2 section-eyebrow mx-auto lg:mx-0">
                        <span className="relative flex h-2 w-2 flex-shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                        </span>
                        {t.heroBadge}
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary leading-[1.15] tracking-tight">
                        {t.heroTitle1}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            {t.heroTitle2}
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg text-text-secondary font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                        {t.heroSubtitleExpanded}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                        <Link
                            to="/profile"
                            className="btn btn-primary btn-xl w-full sm:w-auto group"
                        >
                            <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                            {t.postListing}
                        </Link>
                        <Link
                            to="/listings"
                            className="btn btn-outline btn-xl w-full sm:w-auto group"
                        >
                            <Search size={20} className="group-hover:scale-110 transition-transform" />
                            {t.browseListings}
                        </Link>
                    </div>
                </div>

                {/* Hero Media */}
                <div className="flex-1 order-1 lg:order-2 w-full flex justify-center lg:justify-end">
                    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[480px]">
                        <div className="grid grid-cols-2 gap-3 md:gap-4 relative z-10">

                            {/* Video 1 */}
                            <div className="relative bg-surface-2 rounded-xl overflow-hidden shadow-md ring-1 ring-black/5 group">
                                <OptimizedVideo
                                    key={video1Src}
                                    src={video1Src}
                                    priority={true}
                                    className="w-full aspect-square group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Video 2 */}
                            <div className="relative bg-surface-2 rounded-xl overflow-hidden shadow-md ring-1 ring-black/5 group">
                                <OptimizedVideo
                                    key={video2Src}
                                    src={video2Src}
                                    priority={true}
                                    className="w-full aspect-square group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Hero Image — spans full width */}
                            <div className="col-span-2 relative rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 group">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none" />
                                <OptimizedImage
                                    src={heroImageSrc}
                                    alt="Fresh Fish Marketplace"
                                    priority={true}
                                    className="w-full aspect-video group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>

                        {/* Decorative rings */}
                        <div className="hidden sm:block absolute -top-8 -right-8 w-28 h-28 border-[12px] border-primary/10 rounded-full -z-0 animate-gentle-pulse pointer-events-none" />
                        <div className="hidden sm:block absolute -bottom-6 -left-6 w-14 h-14 bg-secondary-muted rounded-full -z-0 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Search bar */}
            <div className="max-w-5xl mx-auto mt-10 md:mt-14 px-0 relative z-20">
                <HomeSearch />
            </div>
        </section>
    );
};

export default Hero;
