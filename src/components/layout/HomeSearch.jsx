import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ShoppingBag, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const HomeSearch = () => {
    const { language, t } = useLanguage();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [district, setDistrict] = useState('');

    const districts = Object.keys(t.districts);
    const categories = [
        { id: 'Fish', label: t.category === 'Category' ? 'Fish' : language === 'bn' ? 'মাছ' : 'मछली' },
        { id: 'Feed', label: t.category === 'Category' ? 'Feed' : language === 'bn' ? 'খাবার' : 'दाना' },
        { id: 'Medicine', label: t.category === 'Category' ? 'Medicine' : language === 'bn' ? 'ঔষধ' : 'दवा' }
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        if (district) params.set('district', district);
        navigate(`/listings?${params.toString()}`);
    };

    return (
        <section className="max-w-6xl mx-auto px-4 -mt-8 md:-mt-16 relative z-20">
            <div className="bg-white p-4 md:p-8 rounded-[2.5rem] shadow-2xl border border-blue-50">
                <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                    {/* Search Input */}
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder={t.searchHint}
                            className="w-full pl-12 pr-4 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-3xl outline-none font-bold text-gray-900 transition-all placeholder:text-gray-400 placeholder:font-medium text-center md:text-left"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="h-10 w-px bg-gray-200 hidden lg:block"></div>

                    {/* Category Dropdown */}
                    <div className="relative group min-w-[180px]">
                        <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <select 
                            className="w-full pl-12 pr-10 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-3xl outline-none font-bold text-gray-900 transition-all appearance-none cursor-pointer text-center md:text-left"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">{t.allCategories}</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <ArrowRight size={16} className="rotate-90" />
                        </div>
                    </div>

                    <div className="h-10 w-px bg-gray-200 hidden lg:block"></div>

                    {/* Location Dropdown */}
                    <div className="relative group min-w-[180px]">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <select 
                            className="w-full pl-12 pr-10 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-3xl outline-none font-bold text-gray-900 transition-all appearance-none cursor-pointer text-center md:text-left"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                        >
                            <option value="">{t.allDistricts}</option>
                            {districts.map(d => (
                                <option key={d} value={d}>{t.districts[d]}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <ArrowRight size={16} className="rotate-90" />
                        </div>
                    </div>

                    {/* Search Button */}
                    <button 
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-3xl font-black flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-600/20 group uppercase tracking-widest"
                    >
                        {t.searchBtn}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </div>
            
            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">{t.popularShort}</span>
                {[t.tagFish, t.tagFeed, t.tagSeed, t.tagMed].map(tag => (
                    <button 
                        key={tag}
                        onClick={() => { 
                            setSearch(tag);
                            const params = new URLSearchParams();
                            params.set('search', tag);
                            if (category) params.set('category', category);
                            if (district) params.set('district', district);
                            navigate(`/listings?${params.toString()}`);
                        }}
                        className="px-4 py-1.5 bg-white/50 backdrop-blur-md border border-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-white hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default HomeSearch;
