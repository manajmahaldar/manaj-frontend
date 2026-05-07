import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { BookOpen, Fish, Pill, Lightbulb, ArrowRight, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const KnowledgeTips = () => {
    const { t, language } = useLanguage();
    const [liveArticles, setLiveArticles] = useState([]);

    useEffect(() => {
        api.get('/knowledge')
            .then(res => setLiveArticles(res.data.slice(0, 1)))
            .catch(() => {});
    }, []);

    const staticTips = [
        {
            category: t.knowledgeTips.tags.farming,
            icon: <Fish size={22} />,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            title: t.knowledgeTips.static[0].title,
            excerpt: t.knowledgeTips.static[0].excerpt,
            tag: t.knowledgeTips.tags.farming,
        },
        {
            category: t.knowledgeTips.tags.medicine,
            icon: <Pill size={22} />,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            title: t.knowledgeTips.static[1].title,
            excerpt: t.knowledgeTips.static[1].excerpt,
            tag: t.knowledgeTips.tags.medicine,
        },
        {
            category: t.knowledgeTips.tags.practice,
            icon: <Lightbulb size={22} />,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            title: t.knowledgeTips.static[2].title,
            excerpt: t.knowledgeTips.static[2].excerpt,
            tag: t.knowledgeTips.tags.practice,
        },
    ];

    const allCards = [
        ...staticTips,
        ...liveArticles.map(a => ({
            category: t.knowledgeTips.tags.community,
            icon: <BookOpen size={22} />,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            title: a.title,
            excerpt: a.content?.slice(0, 150) + '...',
            tag: t.knowledgeTips.tags.community,
            isLive: true,
        }))
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 py-4 md:py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
                <div className="space-y-4 text-center md:text-left flex flex-col items-center md:items-start w-full md:w-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-xs font-bold uppercase tracking-widest mx-auto md:mx-0 w-fit">
                        <BookOpen size={14} />
                        {t.knowledgeTips.badge}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight w-full">
                        {t.knowledgeTips.title}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                            {t.knowledgeTips.titleSpan}
                        </span>
                    </h2>
                    <p className="text-gray-500 font-medium max-w-lg leading-relaxed mx-auto md:mx-0">
                        {t.knowledgeTips.desc}
                    </p>
                </div>

                <Link
                    to="/knowledge"
                    className="group hidden md:flex items-center gap-3 px-8 py-4 bg-orange-500 hover:bg-orange-400 text-white rounded-2xl font-black transition-all hover:scale-105 shadow-lg shadow-orange-500/20 whitespace-nowrap"
                >
                    <BookOpen size={20} />
                    {t.knowledgeTips.viewAll}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {allCards.map((tip, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-[1.02] transition-all group flex flex-col text-center md:text-left"
                    >
                        {/* Card Top accent bar */}
                        <div className={`h-1.5 w-full ${tip.bgColor.replace('bg-', 'bg-gradient-to-r from-').replace('-50', '-400')} opacity-60`}></div>

                        <div className="p-8 flex flex-col flex-1 items-center md:items-start">
                            {/* Category Badge */}
                            <div className={`inline-flex items-center gap-2 ${tip.bgColor} ${tip.color} px-3 py-1.5 rounded-full text-xs font-black w-fit mb-6 mx-auto md:mx-0`}>
                                {tip.icon}
                                {tip.category}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-black text-gray-900 mb-6 leading-snug group-hover:text-blue-600 transition-colors w-full">
                                {tip.title}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-gray-600 font-medium text-sm leading-relaxed flex-1 w-full">
                                {tip.excerpt}
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-50 w-full flex-col md:flex-row gap-4 md:gap-0">
                                <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${tip.bgColor} ${tip.color} mx-auto md:mx-0`}>
                                    {tip.tag}
                                </span>
                                <Link
                                    to="/knowledge"
                                    className={`flex items-center justify-center gap-1 ${tip.color} text-xs font-black hover:gap-2 transition-all mx-auto md:mx-0`}
                                >
                                    {t.knowledgeTips.readMore} <ChevronRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile CTA */}
            <div className="flex justify-center mt-10 md:hidden">
                <Link
                    to="/knowledge"
                    className="flex items-center gap-3 px-8 py-4 bg-orange-500 hover:bg-orange-400 text-white rounded-2xl font-black transition-all shadow-lg shadow-orange-500/20"
                >
                    <BookOpen size={20} />
                    {t.knowledgeTips.viewAll}
                    <ArrowRight size={18} />
                </Link>
            </div>
        </section>
    );
};

export default KnowledgeTips;
