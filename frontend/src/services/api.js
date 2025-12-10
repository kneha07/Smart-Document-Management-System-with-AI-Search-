import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const authService = {
    signup: (userData) => api.post('/auth/signup', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export const fileService = {
    uploadFile: (formData) => api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getAllFiles: () => api.get('/files'),
    downloadFile: (fileId) => api.get(`/files/download/${fileId}`, { responseType: 'blob' }),
    deleteFile: (fileId) => api.delete(`/files/${fileId}`),
    shareFile: (fileId, shareWithEmail) => api.post('/files/share', { fileId, shareWithEmail }),
};

export default api;