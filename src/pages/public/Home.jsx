import { Link } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, BookOpen, ShieldCheck } from 'lucide-react';
import Hero from '../../components/layout/Hero';
import RoleSelection from '../../components/layout/RoleSelection';
import FeaturedListings from '../../components/layout/FeaturedListings';
import HomeListings from '../../components/layout/HomeListings';




import FarmerListings from '../../components/layout/FarmerListings';
import HatcheryListings from '../../components/layout/HatcheryListings';
import SellerListings from '../../components/layout/SellerListings';
import TraderListings from '../../components/layout/TraderListings';

import SEO from '../../components/common/SEO';
import { useLanguage } from '../../context/LanguageContext';

const Home = () => {
    const { language, t } = useLanguage();



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






        </div>
    );
};

export default Home;
