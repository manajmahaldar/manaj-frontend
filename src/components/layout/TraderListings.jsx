import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import BuyingPostCard from '../trader/BuyingPostCard';
import { useLanguage } from '../../context/LanguageContext';
import { ShoppingCart, ArrowRight, Loader2, Megaphone } from 'lucide-react';

const TraderListings = () => {
    const { t } = useLanguage();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTraderPosts();
    }, []);

    const fetchTraderPosts = async () => {
        try {
            const res = await api.get('/posts');
            // Show only first 3-4 approved buying posts
            setPosts(res.data.posts ? res.data.posts.slice(0, 3) : res.data.slice(0, 3));
        } catch (err) {
            console.error('Error fetching trader posts:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-green-600" size={40} />
                <p className="text-gray-500 font-bold">{t.loadingData}</p>
            </div>
        );
    }

    if (posts.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 py-6 md:py-10">
            <div className="bg-green-50/50 rounded-[3rem] p-6 md:p-16 border border-green-100/50">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4 text-center md:text-left flex flex-col items-center md:items-start w-full md:w-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-600 rounded-full text-xs font-bold uppercase tracking-widest mx-auto md:mx-0 w-fit">
                            <Megaphone size={14} />
                            {t.traderDemand}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight w-full">
                            {t.traderDemand} <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">
                                {t.buyingRequirements}
                            </span>
                        </h2>
                        <p className="text-gray-500 font-medium max-w-lg leading-relaxed text-lg mx-auto md:mx-0">
                            {t.traderDesc}
                        </p>
                    </div>

                    <Link
                        to="/posts"
                        className="group hidden md:flex items-center gap-3 px-10 py-5 bg-white hover:bg-green-600 text-green-600 hover:text-white border-2 border-green-100 hover:border-blue-600 rounded-2xl font-black transition-all hover:scale-105 shadow-sm hover:shadow-green-600/20 whitespace-nowrap"
                    >
                        {t.browseAllDemands}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:overflow-visible w-full">
                    {posts.map(post => (
                        <div key={post._id} className="flex-shrink-0 w-[85vw] md:w-full snap-start hover:scale-[1.02] transition-transform">
                            <BuyingPostCard post={post} />
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-12 md:hidden">
                    <Link
                        to="/posts"
                        className="flex items-center gap-3 px-8 py-4 bg-green-600 text-white rounded-2xl font-black transition-all shadow-lg shadow-green-600/20"
                    >
                        {t.viewAllRequests}
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default TraderListings;
