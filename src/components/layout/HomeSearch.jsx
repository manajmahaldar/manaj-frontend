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
        <div className="w-full relative z-20">
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
            

        </div>
    );
};

export default HomeSearch;
