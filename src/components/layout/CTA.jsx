import { Link } from 'react-router-dom';
import { ArrowRight, Send } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const CTA = () => {
    const { t, formatDigit } = useLanguage();

    const formatNumber = (num, suffix = '') => {
        return formatDigit(num) + suffix;
    };

    return (
        <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
            <div className="relative overflow-hidden rounded-2xl bg-text-primary p-8 md:p-12 lg:p-16 text-center">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-secondary/15 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px] pointer-events-none" />

                <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/15 text-white rounded-full text-xs font-semibold uppercase tracking-wider">
                        <Send size={14} className="text-secondary-light" />
                        {t.joinCommunity}
                    </div>

                    <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                        {t.startSellingTitle}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-secondary-light">
                            {t.startSellingStart}
                        </span>
                    </h2>

                    <p className="text-white/70 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                        {t.startSellingDesc}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <Link 
                            to="/register" 
                            className="btn btn-primary btn-xl w-full sm:w-auto group"
                        >
                            {t.registerNow}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link 
                            to="/about" 
                            className="btn btn-ghost btn-xl text-white hover:bg-white/10 border border-white/15 w-full sm:w-auto"
                        >
                            {t.learnMore}
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-white/10">
                        <div className="space-y-1 text-center">
                            <p className="text-2xl font-black text-white">{formatNumber(5000, '+')}</p>
                            <p className="text-2xs text-white/50 font-semibold uppercase tracking-wider">{t.activeFarmers}</p>
                        </div>
                        <div className="space-y-1 text-center">
                            <p className="text-2xl font-black text-white">{formatNumber(100, '%')}</p>
                            <p className="text-2xs text-white/50 font-semibold uppercase tracking-wider">{t.directDeals}</p>
                        </div>
                        <div className="space-y-1 text-center">
                            <p className="text-2xl font-black text-white">{formatNumber(0, '%')}</p>
                            <p className="text-2xs text-white/50 font-semibold uppercase tracking-wider">{t.zeroCommission}</p>
                        </div>
                        <div className="space-y-1 text-center">
                            <p className="text-2xl font-black text-white">{formatNumber(5, '★')}</p>
                            <p className="text-2xs text-white/50 font-semibold uppercase tracking-wider">{t.userRating}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
