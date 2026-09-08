import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
    Globe, 
    BookOpen, 
    Play, 
    HelpCircle, 
    Award, 
    Activity, 
    Bookmark, 
    Landmark, 
    LayoutGrid, 
    Layers,
    Sparkles 
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

const LANGUAGES = [
    { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳' }
];

const LearningHubHeader = () => {
    const { language, changeLanguage, t } = useLanguage();
    const location = useLocation();

    const navLinks = [
        { path: '/learning', label: t.lh_navOverview || 'Overview', icon: <Layers className="w-3.5 h-3.5" />, end: true },
        { path: '/learning/articles', label: t.lh_navArticles || 'Articles', icon: <BookOpen className="w-3.5 h-3.5" /> },
        { path: '/learning/videos', label: t.lh_navVideos || 'Videos', icon: <Play className="w-3.5 h-3.5" /> },
        { path: '/learning/problems-story', label: t.lh_navStories || 'Stories', icon: <Sparkles className="w-3.5 h-3.5" /> },
        { path: '/learning/schemes', label: t.lh_navSchemes || 'Schemes', icon: <Landmark className="w-3.5 h-3.5" /> },
    ];

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-5 mb-8 space-y-4">
            {/* Top Row: Brand & Multi-Language Pill Switcher */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-blue-600 text-white flex items-center justify-center shadow-md shadow-primary/20">
                        <Globe className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="font-extrabold text-gray-900 text-base sm:text-lg tracking-tight">
                                {t.learningHub || 'Learning Hub'}
                            </h2>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                                100% {language.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-[11px] font-semibold text-gray-400">
                            {t.lh_selectLangPrompt || 'Select your preferred learning language'}
                        </p>
                    </div>
                </div>

                {/* 4-Language Switcher Buttons */}
                <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded-2xl border border-gray-100 self-stretch sm:self-auto overflow-x-auto">
                    {LANGUAGES.map((lang) => {
                        const isActive = language === lang.code;
                        return (
                            <button
                                key={lang.code}
                                type="button"
                                onClick={() => changeLanguage(lang.code)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap active:scale-95 ${
                                    isActive
                                        ? 'bg-primary text-white shadow-sm shadow-primary/30 scale-102'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
                                }`}
                                title={`Switch to ${lang.label}`}
                            >
                                <span className="text-sm">{lang.flag}</span>
                                <span>{lang.native}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Quick Navigation Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {navLinks.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) =>
                            `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                                isActive
                                    ? 'bg-primary/10 text-primary font-extrabold border border-primary/20'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`
                        }
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default LearningHubHeader;
