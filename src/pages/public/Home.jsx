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
import FarmingAIAssistantModal from '../../components/ai/FarmingAIAssistantModal';
import { Bot } from 'lucide-react';

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
    const [isFarmingAIOpen, setIsFarmingAIOpen] = useState(false);

    return (
        <div className="pb-12 relative">
            <SEO 
                title={t.heroTitle}
                description="Connect directly with fish farmers, hatchery owners, and suppliers in India. Monaj is a commission-free marketplace for the aquaculture industry."
            />
            <Hero onOpenFarmingAI={() => setIsFarmingAIOpen(true)} />
            <HomeListings />
            <LazySection><FarmerListings /></LazySection>
            <LazySection><SellerListings /></LazySection>
            <LazySection><HatcheryListings /></LazySection>
            <LazySection><EquipmentListings /></LazySection>
            <LazySection><TraderListings /></LazySection>

            {/* Floating Action Button for Farming AI Assistant on Public Home Page */}
            <button
                onClick={() => setIsFarmingAIOpen(true)}
                type="button"
                className="fixed bottom-20 right-5 sm:bottom-8 sm:right-8 z-40 p-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl shadow-2xl shadow-emerald-700/40 transition-all duration-200 active:scale-95 flex items-center gap-3 border border-white/30 backdrop-blur-md group"
                title="Ask Farming AI"
                aria-label="Ask Farming AI"
            >
                <div className="relative p-1 bg-white/20 rounded-xl">
                    <Bot size={22} className="group-hover:rotate-12 transition-transform text-white" />
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
                    </span>
                </div>
                <span className="hidden sm:inline-block font-bold text-xs pr-1 tracking-wide">
                    Ask Farming AI
                </span>
            </button>

            {/* Floating Farming AI Assistant Modal */}
            <FarmingAIAssistantModal
                isOpen={isFarmingAIOpen}
                onClose={() => setIsFarmingAIOpen(false)}
            />
        </div>
    );
};

export default Home;
