import { useState, useEffect, useRef } from 'react';
import SEO from '../../components/common/SEO';
import { useLanguage } from '../../context/LanguageContext';
import Hero from '../../components/layout/Hero';
import HomeListings from '../../components/layout/HomeListings';
import FarmerListings from '../../components/layout/FarmerListings';
import HatcheryListings from '../../components/layout/HatcheryListings';
import SellerListings from '../../components/layout/SellerListings';
import TraderListings from '../../components/layout/TraderListings';
import EquipmentListings from '../../components/layout/EquipmentListings';

const LazySection = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className="min-h-[200px]">
            {isVisible ? children : null}
        </div>
    );
};

const Home = () => {
    const { t } = useLanguage();

    return (
        <div className="pb-12">
            <SEO 
                title={t.heroTitle}
                description="Connect directly with fish farmers, hatchery owners, and suppliers in India. Monaj is a commission-free marketplace for the aquaculture industry."
            />
            <Hero />
            <HomeListings />
            <LazySection><FarmerListings /></LazySection>
            <LazySection><SellerListings /></LazySection>
            <LazySection><HatcheryListings /></LazySection>
            <LazySection><EquipmentListings /></LazySection>
            <LazySection><TraderListings /></LazySection>
        </div>
    );
};

export default Home;
