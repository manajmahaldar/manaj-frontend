import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import ListingCard from '../../features/product/components/ListingCard';
import BuyingPostCard from '../../components/trader/BuyingPostCard';
import { CardSkeleton, PostSkeleton } from '../../components/common/Skeletons';
import { Search, MapPin, X, ShoppingBag, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { AuthContext } from '../../context/AuthContext';

const HomeListings = () => {
    const { t, formatDigit, language } = useLanguage();
    const { user } = useContext(AuthContext);
    
    const [listings, setListings] = useState([]);
    const [buyingPosts, setBuyingPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [viewType, setViewType] = useState('selling');
    const [category, setCategory] = useState('');
    const [search, setSearch] = useState('');
    const [district, setDistrict] = useState('');

    const districtKeys = Object.keys(t.districts);
    const categoryKeys = ['Spawn/Seed', 'Feed', 'Medicine', 'Fish', 'Equipment'];

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 500);

        return () => clearTimeout(timer);
    }, [viewType, category, district, search]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (viewType === 'selling') {
                const res = await api.get(`/listings?category=${category}&district=${district}&search=${search}&page=1&limit=8`);
                setListings(res.data.listings);
            } else {
                const res = await api.get(`/posts?category=${category}&district=${district}&search=${search}&page=1&limit=8`);
                setBuyingPosts(res.data.posts);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setCategory('');
        setSearch('');
        setDistrict('');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* View Tabs */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="flex-1 flex bg-white p-2 rounded-[2rem] shadow-sm border border-gray-100">
                    <button 
                        onClick={() => setViewType('selling')}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-black transition-all ${
                            viewType === 'selling' 
                            ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <ArrowUpRight size={20} />
                        {t.forSaleTab}
                    </button>
                    <button 
                        onClick={() => setViewType('buying')}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-black transition-all ${
                            viewType === 'buying' 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <ArrowDownRight size={20} />
                        {t.buyingDemandsTab}
                    </button>
                </div>
            </div>



            {/* Listings Grid */}
            {loading ? (
                <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:overflow-visible w-full">
                    {[1,2,3,4,5,6,7,8].map(n => (
                        <div key={n} className="flex-shrink-0 w-[85vw] md:w-full snap-start">
                            {viewType === 'selling' ? <CardSkeleton /> : <PostSkeleton />}
                        </div>
                    ))}
                </div>
            ) : (viewType === 'selling' ? listings : buyingPosts).length > 0 ? (
                <div className="space-y-8">
                    <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:overflow-visible w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {viewType === 'selling' ? (
                            listings.map(item => (
                                <div key={item._id} className="flex-shrink-0 w-[85vw] md:w-full snap-start">
                                    <ListingCard 
                                        item={item} 
                                        userRole={user?.role} 
                                    />
                                </div>
                            ))
                        ) : (
                            buyingPosts.map(post => (
                                <div key={post._id} className="flex-shrink-0 w-[85vw] md:w-full snap-start">
                                    <BuyingPostCard 
                                        post={post} 
                                    />
                                </div>
                            ))
                        )}
                    </div>

                    {/* View All Button */}
                    <div className="flex justify-center pt-4">
                        <Link 
                            to={viewType === 'selling' ? '/listings' : '/posts'}
                            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-95 transition-all"
                        >
                            {t.viewAll}
                            <ArrowUpRight size={20} />
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 space-y-6 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                        <Search size={48} />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.noDataFound}</h3>
                        <p className="text-gray-500 font-medium">{t.tryDifferentFilters}</p>
                    </div>
                    <button 
                        onClick={clearFilters}
                        className="btn bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
                    >
                        {t.clearAllFilters}
                    </button>
                </div>
            )}
        </div>
    );
};

export default HomeListings;
