import api from '../../../utils/api';

// User Farming AI Assistant APIs
export const sendFarmingAIChat = (data) => api.post('/farming-ai/chat', data);
export const getFarmingAIConversations = () => api.get('/farming-ai/conversations');
export const getFarmingAIConversationById = (id) => api.get(`/farming-ai/conversations/${id}`);
export const deleteFarmingAIConversation = (id) => api.delete(`/farming-ai/conversations/${id}`);
export const clearAllFarmingAIConversations = () => api.delete('/farming-ai/conversations');
export const trackFarmingAIResourceClick = (data) => api.post('/farming-ai/analytics/click', data);

// Admin Farming AI Knowledge & Telemetry APIs
export const getAdminFarmingAIKnowledge = (params) => api.get('/admin/farming-ai/knowledge', { params });
export const createAdminFarmingAIKnowledge = (data) => api.post('/admin/farming-ai/knowledge', data);
export const updateAdminFarmingAIKnowledge = (id, data) => api.put(`/admin/farming-ai/knowledge/${id}`, data);
export const deleteAdminFarmingAIKnowledge = (id) => api.delete(`/admin/farming-ai/knowledge/${id}`);
export const getAdminFarmingAIAnalytics = () => api.get('/admin/farming-ai/analytics');
