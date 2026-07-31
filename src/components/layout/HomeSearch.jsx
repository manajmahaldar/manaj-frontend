import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const HomeSearch = () => {
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [isListening, setIsListening] = useState(false);

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

            if (language === 'bn') recognition.lang = 'bn-IN';
            else if (language === 'hi') recognition.lang = 'hi-IN';
            else if (language === 'or') recognition.lang = 'or-IN';
            else recognition.lang = 'en-US';

            recognition.onstart  = () => setIsListening(true);
            recognition.onend    = () => setIsListening(false);
            recognition.onerror  = () => setIsListening(false);

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setSearch(transcript);
                const params = new URLSearchParams();
                params.set('search', transcript);
                navigate(`/listings?${params.toString()}`);
            };

            recognition.start();
        } else {
            alert('Microphone search is not supported in this browser.');
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <form
                onSubmit={handleSearch}
                className="flex items-center w-full bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
                <div className="pl-4 pr-3 text-text-tertiary flex-shrink-0">
                    <Search size={20} />
                </div>

                <input
                    type="text"
                    placeholder={t.searchPlaceholder || 'Search fish, feed, medicine...'}
                    className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-tertiary text-base py-4 font-medium min-w-0"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search listings"
                />

                <div className="flex items-center gap-2 pr-2 flex-shrink-0">
                    <button
                        type="button"
                        onClick={startListening}
                        className={`btn-icon btn-ghost text-text-tertiary hover:text-primary ${isListening ? 'text-error animate-pulse' : ''}`}
                        title="Search by voice"
                        aria-label="Voice search"
                    >
                        <Mic size={20} />
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary btn-sm"
                    >
                        {t.searchBtn || 'Search'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default HomeSearch;
