import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle auth errors
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const path = window.location.pathname;
            if (path !== '/login' && path !== '/register') {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: async (email, password) => {
        const response = await client.post('/auth/register', { email, password });
        return response.data;
    },

    login: async (email, password) => {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        const response = await client.post('/auth/login', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
};

// Decks API
export const decksAPI = {
    getDecks: async () => {
        const response = await client.get('/cards/decks');
        return response.data;
    },

    deleteDeck: async (id) => {
        await client.delete(`/cards/decks/${id}`);
    },

    exportDeck: async (id) => {
        const response = await client.get(`/cards/decks/${id}/export`, {
            responseType: 'blob',
        });
        return response.data;
    },
};

// Cards API
export const cardsAPI = {
    uploadPDF: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await client.post('/cards/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    getCards: async (deckId = null) => {
        const params = deckId ? { deck_id: deckId } : {};
        const response = await client.get('/cards/', { params });
        return response.data;
    },

    updateCard: async (id, data) => {
        const response = await client.put(`/cards/${id}`, data);
        return response.data;
    },

    deleteCard: async (id) => {
        await client.delete(`/cards/${id}`);
    },

    exportCards: async () => {
        const response = await client.get('/cards/export/txt', {
            responseType: 'blob',
        });
        return response.data;
    },
};

export default client;

