import api from '../../../utils/api';

// Public & End-User Learning APIs
export const getCategories = () => api.get('/learning/content/categories');
export const getAllContent = (params) => api.get('/learning/content', { params });
export const getAllContentAdmin = (params) => api.get('/learning/content', { params: { ...params, isAdmin: true } });
export const getContentDetails = (idOrSlug) => api.get(`/learning/content/${idOrSlug}`);
export const getSearchSuggestions = (query) => api.get('/learning/content/suggestions', { params: { query } });

export const trackProgress = (data) => api.post('/learning/user/track', data);
export const toggleBookmark = (contentId) => api.post('/learning/user/bookmark', { contentId });
export const getBookmarks = () => api.get('/learning/user/bookmarks');
export const getRecentlyViewed = () => api.get('/learning/user/recent');
export const getContinueLearning = () => api.get('/learning/user/continue');
export const getProgressStats = () => api.get('/learning/user/progress-stats');

export const getQuizzes = () => api.get('/learning/quiz');
export const getQuizDetails = (id) => api.get(`/learning/quiz/${id}`);
export const submitQuizAnswers = (id, data) => api.post(`/learning/quiz/${id}/submit`, data);
export const getQuizLeaderboard = (id) => api.get(`/learning/quiz/${id}/leaderboard`);

export const getCertificates = () => api.get('/learning/certificate');
export const generateCertificate = (quizId) => api.post('/learning/certificate/generate', { quizId });

export const getGovernmentSchemes = (params) => api.get('/learning/scheme', { params });
export const getSchemeDetails = (idOrSlug) => api.get(`/learning/scheme/${idOrSlug}`);

// Admin Learning CMS APIs (Main Admin Only)
export const createContent = (data) => api.post('/learning/content', data);
export const updateContent = (id, data) => api.put(`/learning/content/${id}`, data);
export const deleteContent = (id) => api.delete(`/learning/content/${id}`);

export const createCategory = (data) => api.post('/learning/content/categories', data);
export const updateCategory = (id, data) => api.put(`/learning/content/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/learning/content/categories/${id}`);

export const createQuiz = (data) => api.post('/learning/quiz', data);
export const updateQuiz = (id, data) => api.put(`/learning/quiz/${id}`, data);
export const deleteQuiz = (id) => api.delete(`/learning/quiz/${id}`);

export const createScheme = (data) => api.post('/learning/scheme', data);
export const updateScheme = (id, data) => api.put(`/learning/scheme/${id}`, data);
export const deleteScheme = (id) => api.delete(`/learning/scheme/${id}`);

export const getLearningAnalytics = () => api.get('/learning/analytics');

// Extended Admin CMS Endpoints
export const getMediaAssets = (params) => api.get('/learning/admin/media', { params });
export const uploadMediaAsset = (data) => api.post('/learning/admin/media', data);
export const deleteMediaAsset = (id) => api.delete(`/learning/admin/media/${id}`);
export const replaceMediaAsset = (id, data) => api.put(`/learning/admin/media/${id}/replace`, data);

export const getCourses = () => api.get('/learning/admin/courses');
export const createCourse = (data) => api.post('/learning/admin/courses', data);
export const updateCourse = (id, data) => api.put(`/learning/admin/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/learning/admin/courses/${id}`);

export const getWebinars = () => api.get('/learning/user/webinars');
export const createWebinar = (data) => api.post('/learning/admin/webinars', data);
export const updateWebinar = (id, data) => api.put(`/learning/admin/webinars/${id}`, data);
export const deleteWebinar = (id) => api.delete(`/learning/admin/webinars/${id}`);

export const bulkContentAction = (data) => api.post('/learning/admin/bulk-action', data);
export const sendBroadcastNotification = (data) => api.post('/learning/admin/notifications/broadcast', data);

// Upload a video/file directly to Cloudinary via backend
export const uploadLearningVideo = (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/learning/admin/upload-video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
            if (onProgress && e.total) {
                onProgress(Math.round((e.loaded * 100) / e.total));
            }
        }
    });
};

