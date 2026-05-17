import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import ListingCard from '../../features/product/components/ListingCard';
import ListingSkeleton from '../common/ListingSkeleton';
import { useLanguage } from '../../context/LanguageContext';
import { Crown, ArrowRight, Sparkles } from 'lucide-react';

const AdminFishListings = () => {
    const { t } = useLanguage();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdminListings();
    }, []);

    const fetchAdminListings = async () => {
        try {
            // Fetch Big Fish specifically from Admin role
            const res = await api.get('/listings?category=Fish&sellerRole=admin');
            setListings(res.data.listings ? res.data.listings.slice(0, 4) : res.data.slice(0, 4));
        } catch (err) {
            console.error('Error fetching admin fish listings:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="max-w-7xl mx-auto px-4 py-6 md:py-10">
                <div className="bg-gray-900 rounded-[3rem] p-6 md:p-16 border border-white/5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(n => <ListingSkeleton key={n} />)}
                    </div>
                </div>
            </section>
        );
    }

    if (listings.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 py-6 md:py-10 relative overflow-hidden group">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -u-z-10 w-64 h-64 bg-amber-200/20 blur-[100px] rounded-full group-hover:bg-amber-300/30 transition-colors duration-700"></div>
            <div className="absolute bottom-0 left-0 -u-z-10 w-96 h-96 bg-blue-200/10 blur-[120px] rounded-full group-hover:bg-blue-300/20 transition-colors duration-700"></div>

            <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-black rounded-[3rem] p-6 md:p-16 border border-white/10 shadow-2xl relative">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                    <div className="space-y-6 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full text-xs font-black uppercase tracking-[0.2em] animate-pulse">
                            <Crown size={16} className="fill-current" />
                            {t.bigFishMarket}
                        </div>
                        
                        <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                            {t.bigFishMarket} <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-500 flex items-center gap-4 justify-center lg:justify-start">
                                Exclusive Stock <Sparkles className="text-amber-400 hidden md:block" />
                            </span>
                        </h2>
                        
                        <p className="text-gray-400 font-medium max-w-xl leading-relaxed text-lg">
                            {t.adminFishDesc}
                        </p>
                    </div>

                    <Link
                        to="/listings?category=Fish"
                        className="group flex items-center gap-4 px-10 py-5 bg-amber-500 hover:bg-amber-400 text-black rounded-2xl font-black transition-all hover:scale-105 shadow-xl shadow-amber-500/20 whitespace-nowrap self-center lg:self-end"
                    >
                        {t.exploreBigFish}
                        <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                {/* Glassmorphism Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {listings.map((listing, idx) => (
                        <div 
                            key={listing._id} 
                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-4 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 group/card"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <ListingCard item={listing} isAdminVersion={true} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AdminFishListings;
