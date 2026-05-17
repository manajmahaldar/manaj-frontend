import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { ArticleCard } from '../../features/product/components';
import { useLanguage } from '../../context/LanguageContext';

const Knowledge = () => {
    const { t } = useLanguage();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const res = await api.get('/knowledge');
            setArticles(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-20 bg-gray-50/30 min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gray-900 text-white py-24 md:py-32 px-4 overflow-hidden mb-12">
                <div 
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: 'url(/knowledge-hero.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-purple-950/40 to-gray-900/60"></div>
                </div>
                
                <div className="max-w-7xl mx-auto relative z-10 text-center space-y-6">
                    <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
                        {t.knowledgeHub.split('(')[0]} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400">
                            {t.aquacultureGuides}
                        </span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-indigo-100 font-medium leading-relaxed opacity-90">
                        {t.knowledgeHeroDesc}
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 space-y-12">

            {loading ? (
                <div className="space-y-6">
                    {[1,2].map(n => <div key={n} className="h-64 bg-gray-50 animate-pulse rounded-2xl"></div>)}
                </div>
            ) : articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {articles.map(article => (
                        <ArticleCard key={article._id} article={article} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-2xl">
                    {t.noArticles}
                </div>
            )}
        </div>
    </div>
);
};

export default Knowledge;
