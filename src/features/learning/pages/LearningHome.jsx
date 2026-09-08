import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Play, Award, Bookmark, ArrowRight, Activity, TrendingUp } from 'lucide-react';
import { getAllContent, getContinueLearning } from '../api/learningApi';
import ContentCard from '../components/ContentCard';
import SkeletonCard from '../components/SkeletonCard';
import { useLearning } from '../context/LearningContext';
import { useLanguage } from '../../../context/LanguageContext';
import { 
    getLocalizedContent, 
    getLocalizedCategory, 
    getLocalizedLevel, 
    getLocalizedType 
} from '../utils/learningTranslationHelper';

const LearningHome = () => {
    const { progressStats, categories } = useLearning();
    const { t, language, formatDigit } = useLanguage();
    const [featured, setFeatured] = useState(null);
    const [continueItems, setContinueItems] = useState([]);
    const [trending, setTrending] = useState([]);
    const [recentAdded, setRecentAdded] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                // Fetch featured item
                let featRes = await getAllContent({ featured: true, limit: 1 });
                if (featRes.data.success && featRes.data.data.length > 0) {
                    setFeatured(featRes.data.data[0]);
                } else {
                    featRes = await getAllContent({ limit: 1 });
                    if (featRes.data.success && featRes.data.data.length > 0) {
                        setFeatured(featRes.data.data[0]);
                    }
                }
                
                // Fetch continue learning
                const contRes = await getContinueLearning();
                if (contRes.data.success) {
                    setContinueItems(contRes.data.data);
                }

                // Fetch trending content
                const trendRes = await getAllContent({ isTrending: true, limit: 4 });
                if (trendRes.data.success) {
                    setTrending(trendRes.data.data);
                }

                // Fetch recently added
                const recentRes = await getAllContent({ limit: 4 });
                if (recentRes.data.success) {
                    setRecentAdded(recentRes.data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    return (
        <div className="space-y-10">
            {/* Header / Stats Block */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-8 rounded-3xl bg-gradient-to-r from-primary to-blue-800 text-white shadow-xl shadow-primary/10">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black tracking-tight">{t.lh_welcomeTitle || 'Welcome to Digital Fish Academy'}</h1>
                    <p className="text-blue-100 font-semibold text-sm max-w-xl">
                        {t.lh_welcomeDesc || 'Master modern aquaculture, biofloc setups, water parameters, and fish marketing guidelines with certified resources.'}
                    </p>
                </div>
                {progressStats && (
                    <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 self-stretch md:self-auto">
                        <div className="text-center">
                            <p className="text-[10px] uppercase tracking-wider font-extrabold text-blue-200">{t.lh_completed || 'Completed'}</p>
                            <p className="text-2xl font-black">{formatDigit(progressStats.completedCount || 0)}</p>
                        </div>
                        <div className="w-px h-8 bg-white/20" />
                        <div className="text-center">
                            <p className="text-[10px] uppercase tracking-wider font-extrabold text-blue-200">{t.lh_inProgress || 'In Progress'}</p>
                            <p className="text-2xl font-black">{formatDigit(progressStats.inProgressCount || 0)}</p>
                        </div>
                        <div className="w-px h-8 bg-white/20" />
                        <div className="text-center">
                            <p className="text-[10px] uppercase tracking-wider font-extrabold text-blue-200">{t.lh_streak || 'Streak'}</p>
                            <p className="text-2xl font-black flex items-center justify-center gap-1">
                                🔥 {formatDigit(progressStats.learningStreak || 0)}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Featured Block */}
            {(() => {
                const locFeatured = getLocalizedContent(featured, language);
                if (!locFeatured) return null;
                return (
                    <div className="card grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                        <div className="relative aspect-video lg:aspect-auto bg-gray-100 min-h-[300px]">
                            {locFeatured.thumbnail ? (
                                <img src={locFeatured.thumbnail} alt={locFeatured.title} className="object-cover w-full h-full" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-cyan-500/10" />
                            )}
                            <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                {t.lh_featuredCourse || 'Featured course'}
                            </span>
                        </div>
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                            <span className="text-xs font-black uppercase tracking-widest text-primary mb-2">
                                {locFeatured.displayLevel || getLocalizedLevel(locFeatured.level, language)} • {locFeatured.displayType || getLocalizedType(locFeatured.type, language)}
                            </span>
                            <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
                                {locFeatured.title}
                            </h2>
                            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                {locFeatured.description || 'Step-by-step masterclass modules for optimizing yields, disease control, and commercializing fish farming.'}
                            </p>
                            <div className="flex items-center gap-4">
                                <Link 
                                    to={`/learning/${locFeatured.type}s/${locFeatured.slug}`}
                                    className="px-6 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95"
                                >
                                    <Play className="w-4 h-4 fill-current" />
                                    {t.lh_startLearning || 'Start Learning'}
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Continue Learning */}
            {continueItems.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" />
                        {t.lh_continueLearning || 'Continue Learning'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {continueItems.map(item => {
                            const locItem = getLocalizedContent(item.contentId, language);
                            return (
                                <Link to={`/learning/${locItem.type}s/${locItem.slug}`} key={item._id} className="block">
                                    <div className="p-5 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition-all duration-300">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                                            {locItem.displayType || getLocalizedType(locItem.type, language)}
                                        </span>
                                        <h4 className="font-bold text-gray-900 text-sm truncate mt-1">{locItem.title}</h4>
                                        <div className="flex items-center gap-3 mt-4">
                                            <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                                                <div className="bg-primary h-full rounded-full" style={{ width: `${item.progress}%` }} />
                                            </div>
                                            <span className="text-[10px] font-black text-gray-500">{formatDigit(item.progress)}%</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Top Categories */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        {t.lh_topCategories || 'Top Categories'}
                    </h2>
                    <Link to="/learning/categories" className="text-xs font-bold text-primary hover:text-blue-700 flex items-center gap-1">
                        {t.lh_viewAll || 'View All'} <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {categories.slice(0, 5).map(cat => {
                        const locCat = getLocalizedCategory(cat, language);
                        return (
                            <Link 
                                to={`/learning/categories/${cat.slug}`} 
                                key={cat._id}
                                className="p-5 rounded-2xl border border-gray-100 bg-white text-center hover:scale-102 hover:shadow-lg transition-all duration-300"
                            >
                                <span className="text-2xl mb-2 block">🐟</span>
                                <p className="font-bold text-xs text-gray-900">{locCat.name}</p>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Trending & Recent Added */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        {t.lh_trendingCourses || 'Trending Courses'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {loading ? Array(2).fill(0).map((_, i) => <SkeletonCard key={i} />) : 
                            trending.map(item => <ContentCard key={item._id} content={item} />)
                        }
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        {t.lh_recentlyAdded || 'Recently Added'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {loading ? Array(2).fill(0).map((_, i) => <SkeletonCard key={i} />) : 
                            recentAdded.map(item => <ContentCard key={item._id} content={item} />)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningHome;
