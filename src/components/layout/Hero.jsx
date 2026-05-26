import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';
import OptimizedImage from '../common/OptimizedImage';

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
        <section className="relative bg-white pt-4 pb-10 sm:pt-6 sm:pb-16 md:pt-10 md:pb-24 px-4 sm:px-6 md:px-8 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-green-50 rounded-full blur-3xl opacity-50 -z-10 animate-pulse delay-700"></div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-6 sm:gap-10 lg:gap-20">
                {/* Text Content */}
                <div className="flex-1 space-y-8 text-center lg:text-left order-2 lg:order-1">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold animate-bounce md:animate-none">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        {t.heroBadge}
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.2]">
                        {t.heroTitle1} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                            {t.heroTitle2}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        {t.heroSubtitleExpanded}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                        <Link 
                            to="/profile" 
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/20 group"
                        >
                            <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                            {t.postListing}
                        </Link>
                        <button 
                            onClick={() => document.getElementById('featured-listings')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-green-600 text-green-700 hover:bg-green-50 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-green-600/5 group"
                        >
                            <Search size={20} className="group-hover:scale-125 transition-transform" />
                            {t.browseListings}
                        </button>
                    </div>

                    <div className="flex items-center justify-center lg:justify-start gap-6 pt-6">
                        <div className="text-center lg:text-left">
                            <p className="text-2xl font-black text-gray-900">{formatDigit(5000)}+</p>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t.activeFarmers}</p>
                        </div>
                        <div className="w-px h-10 bg-gray-100"></div>
                        <div className="text-center lg:text-left">
                            <p className="text-2xl font-black text-gray-900">{formatDigit(1000)}+</p>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t.traders}</p>
                        </div>
                        <div className="w-px h-10 bg-gray-100"></div>
                        <div className="text-center lg:text-left">
                            <p className="text-2xl font-black text-gray-900">{formatDigit(50)}+</p>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t.districtsCovered}</p>
                        </div>
                    </div>
                </div>

                {/* Hero Media Section */}
                <div className="flex-1 order-1 lg:order-2 w-full flex justify-center lg:justify-end">
                    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[500px] mx-auto lg:mx-0">
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 relative z-10">

                            {/* Video 1 — Cloudinary URL or local fallback */}
                            <div className="relative bg-gray-100 rounded-xl sm:rounded-2xl md:rounded-[1.5rem] overflow-hidden shadow-md sm:shadow-xl ring-1 ring-gray-900/5 group">
                                <video key={video1Src} src={video1Src} autoPlay loop muted playsInline 
                                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>

                            {/* Video 2 — Cloudinary URL or local fallback */}
                            <div className="relative bg-gray-100 rounded-xl sm:rounded-2xl md:rounded-[1.5rem] overflow-hidden shadow-md sm:shadow-xl ring-1 ring-gray-900/5 group">
                                <video key={video2Src} src={video2Src} autoPlay loop muted playsInline 
                                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>

                            {/* Hero Image — Cloudinary URL or local fallback */}
                            <div className="col-span-2 relative rounded-2xl sm:rounded-3xl md:rounded-[2rem] overflow-hidden shadow-lg sm:shadow-2xl ring-1 ring-gray-900/5 transition-all duration-700 group">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none"></div>
                                <OptimizedImage src={heroImageSrc} alt="Fresh Fish Marketplace" priority={true}
                                    className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>

                        </div>

                        <div className="hidden sm:block absolute -top-8 -right-8 md:-top-10 md:-right-10 w-24 md:w-32 h-24 md:h-32 border-[10px] md:border-[15px] border-blue-100/30 rounded-full -z-0 animate-pulse"></div>
                        <div className="hidden sm:block absolute -bottom-8 -left-8 md:-bottom-10 md:-left-10 w-12 md:w-16 h-12 md:h-16 bg-green-100/50 rounded-full -z-0 animate-bounce"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
