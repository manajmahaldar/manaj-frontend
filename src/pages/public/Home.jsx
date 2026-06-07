import { Link } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, BookOpen, ShieldCheck } from 'lucide-react';
import Hero from '../../components/layout/Hero';
import RoleSelection from '../../components/layout/RoleSelection';
import FeaturedListings from '../../components/layout/FeaturedListings';
import HomeListings from '../../components/layout/HomeListings';

import PostRequirement from '../../components/layout/PostRequirement';
import WhyChooseUs from '../../components/layout/WhyChooseUs';

import FarmerListings from '../../components/layout/FarmerListings';
import HatcheryListings from '../../components/layout/HatcheryListings';
import SellerListings from '../../components/layout/SellerListings';
import TraderListings from '../../components/layout/TraderListings';
import CTA from '../../components/layout/CTA';
import SEO from '../../components/common/SEO';
import { useLanguage } from '../../context/LanguageContext';

const Home = () => {
    const { language, t } = useLanguage();

    const categories = [
        { name: t.listings, icon: <ShoppingBag />, link: '/listings', color: 'bg-blue-500', desc: t.listingsDesc },
        { name: t.buyingPosts, icon: <ShoppingCart />, link: '/posts', color: 'bg-green-500', desc: t.buyingPostsDesc },

        { name: t.commissionFree, icon: <ShieldCheck />, link: '/about', color: 'bg-purple-500', desc: t.commissionFreeDesc },
    ];

    return (
        <div className="pb-12">
            <SEO 
                title={t.heroTitle}
                description="Connect directly with fish farmers, hatchery owners, and suppliers in India. Monaj is a commission-free marketplace for the aquaculture industry."
            />
            <Hero />

            <RoleSelection />
            <HomeListings />
            <FarmerListings />
            <SellerListings />
            <HatcheryListings />
            <TraderListings />



            <PostRequirement />
            <WhyChooseUs />







            {/* Categories Grid */}
            <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                {categories.map((cat, idx) => (
                    <Link key={idx} to={cat.link} className="card p-6 hover:shadow-xl transition-all group">
                        <div className={`${cat.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                            {cat.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.name}</h3>
                        <p className="text-gray-500 text-sm">{cat.desc}</p>
                    </Link>
                ))}
            </section>

            <CTA />

        </div>
    );
};

export default Home;
