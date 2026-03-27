import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Send } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const CTA = () => {
    const { t, language, formatDigit } = useLanguage();

    const formatNumber = (num, suffix = '') => {
        return formatDigit(num) + suffix;
    };

    return (
        <section className="max-w-7xl mx-auto px-4 py-10 md:py-20">
            <div className="relative overflow-hidden rounded-[3rem] bg-gray-900 p-8 md:p-12 lg:p-20 text-center">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-600/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]"></div>

                <div className="relative z-10 max-w-3xl mx-auto space-y-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-full text-sm font-bold uppercase tracking-widest animate-pulse">
                        <Send size={16} className="text-blue-400" />
                        {t.joinCommunity}
                    </div>

                    <h2 className="text-4xl md:text-7xl font-black text-white leading-[1.1]">
                        {t.startSellingTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">{t.startSellingStart}</span>
                    </h2>

                    <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed">
                        {t.startSellingDesc}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                        <Link 
                            to="/register" 
                            className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-blue-600/30 group"
                        >
                            {t.registerNow}
                            <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                        <Link 
                            to="/about" 
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-[2rem] font-bold text-lg transition-all"
                        >
                            {t.learnMore}
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-white/10">
                        <div className="space-y-1 text-center">
                            <p className="text-2xl font-black text-white">{formatNumber(5000, '+')}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{t.activeFarmers}</p>
                        </div>
                        <div className="space-y-1 text-center">
                            <p className="text-2xl font-black text-white">{formatNumber(100, '%')}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{t.directDeals}</p>
                        </div>
                        <div className="space-y-1 text-center">
                            <p className="text-2xl font-black text-white">{formatNumber(0, '%')}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{t.zeroCommission}</p>
                        </div>
                        <div className="space-y-1 text-center">
                            <p className="text-2xl font-black text-white">{formatNumber(5, '★')}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{t.userRating}</p>
                        </div>
                    </div>
                </div>
                
                {/* Floating Icons */}
                <div className="absolute top-20 left-20 text-white/5 -rotate-12 hidden lg:block pointer-events-none">
                    <ShoppingBag size={120} />
                </div>
                <div className="absolute bottom-20 right-20 text-white/5 rotate-12 hidden lg:block pointer-events-none">
                    <ShoppingBag size={160} />
                </div>
            </div>
        </section>
    );
};

export default CTA;
