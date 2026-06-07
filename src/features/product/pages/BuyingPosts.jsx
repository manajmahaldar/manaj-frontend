import { useState, useEffect } from 'react';
import api from '../../../utils/api';
import BuyingPostCard from '../../../components/trader/BuyingPostCard';
import { Search } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

const BuyingPosts = () => {
    const { t, formatDigit, language } = useLanguage();
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPosts();
        }, 500);
        return () => clearTimeout(timer);
    }, [search, page]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/posts?search=${search}&page=${page}&limit=12`);
            setPosts(res.data.posts);
            setPagination(res.data.pagination);
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
                        backgroundImage: 'url(/listings-hero.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-900/60 via-green-950/40 to-gray-900/60"></div>
                </div>
                
                <div className="max-w-7xl mx-auto relative z-10 text-center space-y-6">
                    <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
                        {t.traderBuying} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                            {t.requirements}
                        </span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-green-100 font-medium leading-relaxed opacity-90">
                        {t.connectTradersDesc}
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 border-l-4 border-green-500 pl-3 w-fit mx-auto md:mx-0">{t.buyingRequirements}</h1>
                
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder={t.searchBuyingPlaceholder} 
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-80"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:overflow-visible w-full">
                    {[1,2,3,4,5,6].map(n => (
                        <div key={n} className="flex-shrink-0 w-[85vw] md:w-full snap-start h-48 bg-gray-50 animate-pulse rounded-xl border border-gray-100"></div>
                    ))}
                </div>
            ) : posts.length > 0 ? (
                <div className="space-y-12">
                    <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:overflow-visible w-full">
                        {posts.map(post => (
                            <div key={post._id} className="flex-shrink-0 w-[85vw] md:w-full snap-start">
                                <BuyingPostCard post={post} />
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {pagination.pages > 1 && (
                        <div className="flex items-center justify-center gap-4 py-8">
                            <button 
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="px-6 py-2 bg-white border border-gray-200 rounded-xl font-bold disabled:opacity-50 hover:bg-gray-50 transition-colors"
                            >
                                {t.previous}
                            </button>
                            <span className="font-black text-gray-900">
                                {formatDigit(page)} / {formatDigit(pagination.pages)}
                            </span>
                            <button 
                                disabled={page === pagination.pages}
                                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                                className="px-6 py-2 bg-white border border-gray-200 rounded-xl font-bold disabled:opacity-50 hover:bg-gray-50 transition-colors"
                            >
                                {t.next}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                    <Search className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t.noBuyingPostsFound}</h3>
                    <p className="text-gray-500">{t.tryDifferentFilters}</p>
                </div>
            )}
        </div>
    </div>
);
};

export default BuyingPosts;
