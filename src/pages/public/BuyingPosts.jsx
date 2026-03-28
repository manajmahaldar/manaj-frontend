import { useState, useEffect } from 'react';
import axios from 'axios';
import BuyingPostCard from '../../components/trader/BuyingPostCard';
import { Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const BuyingPosts = () => {
    const { t, formatDigit, language } = useLanguage();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await axios.get('https://manaj-backend.onrender.com/api/posts');
            setPosts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    const filteredPosts = posts.filter(p => 
        p.fishName.toLowerCase().includes(search.toLowerCase()) ||
        p.district.toLowerCase().includes(search.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
    );

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1,2,3].map(n => <div key={n} className="h-48 bg-gray-50 animate-pulse rounded-xl"></div>)}
                </div>
            ) : filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map(post => (
                        <BuyingPostCard key={post._id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    {t.noBuyingPostsFound}
                </div>
            )}
        </div>
    </div>
);
};

export default BuyingPosts;
