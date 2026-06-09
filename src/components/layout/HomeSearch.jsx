import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const HomeSearch = () => {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        navigate(`/listings?${params.toString()}`);
    };

    const startListening = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            // Set language based on app language
            if (language === 'bn') recognition.lang = 'bn-IN';
            else if (language === 'hi') recognition.lang = 'hi-IN';
            else if (language === 'or') recognition.lang = 'or-IN';
            else recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setSearch(transcript);
                
                // Auto submit the form
                const params = new URLSearchParams();
                params.set('search', transcript);
                navigate(`/listings?${params.toString()}`);
            };
            
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
            };

            recognition.start();
        } else {
            alert('Microphone search is not supported in this browser.');
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto relative z-20 mb-8 mt-4">
            <form onSubmit={handleSearch} className="flex items-center w-full bg-[#f5f6f8] rounded-full p-1.5 shadow-sm border border-gray-100">
                <div className="pl-5 pr-3 text-gray-400">
                    <Search size={22} />
                </div>
                <input 
                    type="text" 
                    placeholder="Search fish, pona, medicine, feed..."
                    className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-base md:text-lg py-3"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button 
                    type="button" 
                    onClick={startListening}
                    className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:shadow-md text-primary transition-all flex-shrink-0"
                    title="Search by voice"
                >
                    <Mic size={22} className="fill-current" />
                </button>
            </form>
        </div>
    );
};

export default HomeSearch;
