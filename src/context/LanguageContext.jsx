import { createContext, useContext, useState, useMemo } from 'react';
import translations from '../utils/translations';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'bn');

    const toggleLanguage = () => {
        let newLang;
        if (language === 'bn') newLang = 'en';
        else if (language === 'en') newLang = 'hi';
        else newLang = 'bn';
        
        setLanguage(newLang);
        localStorage.setItem('language', newLang);
    };

    const changeLanguage = (newLang) => {
        setLanguage(newLang);
        localStorage.setItem('language', newLang);
    };

    const t = useMemo(() => translations[language] || translations.bn, [language]);

    const formatDigit = (num) => {
        if (language !== 'bn') return num;
        const numbers = {
            '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
            '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
        };
        return String(num).split('').map(char => numbers[char] || char).join('');
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, changeLanguage, t, formatDigit }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
