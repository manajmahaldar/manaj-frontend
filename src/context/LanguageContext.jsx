import { createContext, useContext, useState, useMemo, useCallback } from 'react';

import bn from '../locales/bn.json';
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import or from '../locales/or.json';

// All translations pre-loaded — static imports, no dynamic/async, no stale cache
const ALL_TRANSLATIONS = { bn, en, hi, or };

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'bn');

    const changeLanguage = useCallback((newLang) => {
        setLanguage(newLang);
        localStorage.setItem('language', newLang);
        document.documentElement.lang = newLang;
    }, []);

    const toggleLanguage = useCallback(() => {
        const nextMap = { bn: 'en', en: 'hi', hi: 'or', or: 'bn' };
        changeLanguage(nextMap[language] || 'bn');
    }, [language, changeLanguage]);

    // Always returns the correct language's translations — instant, no async needed
    const t = useMemo(() => {
        return ALL_TRANSLATIONS[language] || ALL_TRANSLATIONS['bn'] || {};
    }, [language]);

    const formatDigit = useCallback((num) => {
        if (language === 'bn') {
            const map = { '0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯' };
            return String(num).split('').map(c => map[c] ?? c).join('');
        }
        if (language === 'or') {
            const map = { '0':'୦','1':'୧','2':'୨','3':'୩','4':'୪','5':'୫','6':'୬','7':'୭','8':'୮','9':'୯' };
            return String(num).split('').map(c => map[c] ?? c).join('');
        }
        return num;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, changeLanguage, t, formatDigit }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
