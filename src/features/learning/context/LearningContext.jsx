import React, { createContext, useContext, useState, useEffect } from 'react';
import * as learningApi from '../api/learningApi';

const LearningContext = createContext();

export const useLearning = () => useContext(LearningContext);

export const LearningProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [progressStats, setProgressStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState('en'); // Defaults to English, dynamically controlled

    const fetchCategories = async () => {
        try {
            const res = await learningApi.getCategories();
            if (res.data.success) setCategories(res.data.data);
        } catch (err) {
            console.error('Failed to load categories', err);
        }
    };

    const fetchBookmarks = async () => {
        try {
            const res = await learningApi.getBookmarks();
            if (res.data.success) setBookmarks(res.data.data);
        } catch (err) {
            console.error('Failed to load bookmarks', err);
        }
    };

    const fetchProgressStats = async () => {
        try {
            const res = await learningApi.getProgressStats();
            if (res.data.success) setProgressStats(res.data.data);
        } catch (err) {
            console.error('Failed to load progress stats', err);
        }
    };

    const toggleBookmark = async (contentId) => {
        try {
            const res = await learningApi.toggleBookmark(contentId);
            if (res.data.success) {
                await fetchBookmarks();
                return res.data.bookmarked;
            }
        } catch (err) {
            console.error('Failed to toggle bookmark', err);
        }
        return false;
    };

    const refreshDashboard = () => {
        setLoading(true);
        Promise.all([fetchCategories(), fetchBookmarks(), fetchProgressStats()])
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        refreshDashboard();
    }, []);

    const value = {
        categories,
        bookmarks,
        progressStats,
        loading,
        language,
        setLanguage,
        toggleBookmark,
        refreshDashboard
    };

    return (
        <LearningContext.Provider value={value}>
            {children}
        </LearningContext.Provider>
    );
};
