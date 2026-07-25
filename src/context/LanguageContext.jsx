import { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'bn');
    const [translations, setTranslations] = useState({});
    const [isTranslating, setIsTranslating] = useState(true);

    useEffect(() => {
        const loadTranslations = async () => {
            setIsTranslating(true);
            try {
                // Dynamically import the locale based on current language
                const module = await import(`../locales/${language}.json`);
                setTranslations(prev => ({
                    ...prev,
                    [language]: module.default
                }));
            } catch (error) {
                console.error(`Failed to load translation for language: ${language}`, error);
                // Fallback to bn if loading fails
                if (language !== 'bn' && !translations['bn']) {
                    try {
                        const fallbackModule = await import(`../locales/bn.json`);
                        setTranslations(prev => ({
                            ...prev,
                            ['bn']: fallbackModule.default
                        }));
                    } catch (fallbackErr) {
                         console.error(`Failed to load fallback translation`, fallbackErr);
                    }
                }
            } finally {
                setIsTranslating(false);
            }
        };

        if (!translations[language]) {
            loadTranslations();
        } else {
            setIsTranslating(false);
        }
    }, [language, translations]);

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    const toggleLanguage = useCallback(() => {
        let newLang;
        if (language === 'bn') newLang = 'en';
        else if (language === 'en') newLang = 'hi';
        else if (language === 'hi') newLang = 'or';
        else newLang = 'bn';
        
        setLanguage(newLang);
        localStorage.setItem('language', newLang);
    }, [language]);

    const changeLanguage = useCallback((newLang) => {
        setLanguage(newLang);
        localStorage.setItem('language', newLang);
    }, []);

    // Provide loaded translations or fallback to any loaded translation, or empty object
    const t = useMemo(() => {
        const fallback = translations['bn'] || Object.values(translations)[0];
        return translations[language] || fallback || {};
    }, [language, translations]);

    const formatDigit = useCallback((num) => {
        if (language === 'bn') {
            const numbers = {
                '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
                '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
            };
            return String(num).split('').map(char => numbers[char] || char).join('');
        } else if (language === 'or') {
            const numbers = {
                '0': '୦', '1': '୧', '2': '୨', '3': '୩', '4': '୪',
                '5': '୫', '6': '୬', '7': '୭', '8': '୮', '9': '୯'
            };
            return String(num).split('').map(char => numbers[char] || char).join('');
        }
        return num;
    }, [language]);

    // Prevent rendering children until at least one language is loaded
    if (Object.keys(t).length === 0) {
        return null; // Prevents layout shift/empty text before translation loads
    }

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, changeLanguage, t, formatDigit }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
