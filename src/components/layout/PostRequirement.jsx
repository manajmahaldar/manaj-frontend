import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Fish, Megaphone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const PostRequirement = () => {
    const { t } = useLanguage();
    const exampleRequirements = t.postRequirement.examples;

    return (
        <section className="max-w-7xl mx-auto px-4 py-8">
            <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 p-6 md:p-16">
                {/* Background decorative circles */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-green-600/10 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl"></div>

                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Left: CTA Text */}
                    <div className="flex-1 space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full text-xs font-bold uppercase tracking-widest">
                            <Megaphone size={14} />
                            {t.postRequirement.badge}
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                                {t.postRequirement.title}{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                                    {t.postRequirement.titleSpan}
                                </span>
                            </h2>
                            <p className="text-blue-200/80 text-lg font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
                                {t.postRequirement.desc}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Link
                                to="/profile"
                                className="w-full sm:w-auto group flex items-center justify-center gap-3 px-10 py-5 bg-blue-500 hover:bg-blue-400 text-white rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/30"
                            >
                                <ShoppingCart size={22} />
                                {t.postRequirement.postBtn}
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/posts"
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white rounded-2xl font-bold transition-all"
                            >
                                {t.postRequirement.browseBtn}
                            </Link>
                        </div>
                    </div>

                    {/* Right: Animated example cards */}
                    <div className="flex-1 w-full max-w-md lg:max-w-none space-y-4">
                        <p className="text-center lg:text-left text-blue-400/70 text-xs font-bold uppercase tracking-wider mb-6 flex items-center gap-2 justify-center lg:justify-start">
                            <Fish size={14} />
                            {t.postRequirement.recentRequests}
                        </p>
                        {exampleRequirements.map((req, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all group"
                                style={{ animationDelay: `${i * 150}ms` }}
                            >
                                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <ShoppingCart size={18} />
                                </div>
                                <p className="text-white/80 font-semibold text-sm">{req}</p>
                                <ArrowRight size={16} className="ml-auto text-white/20 group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PostRequirement;
