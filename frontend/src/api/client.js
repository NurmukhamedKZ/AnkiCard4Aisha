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

    createDeck: async (name, folderId = null) => {
        const response = await client.post('/cards/decks', {
            name,
            folder_id: folderId
        });
        return response.data;
    },

    deleteDeck: async (id) => {
        await client.delete(`/cards/decks/${id}`);
    },

    updateDeck: async (id, data) => {
        const response = await client.put(`/cards/decks/${id}`, data);
        return response.data;
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
    uploadPDF: async (file, pages = null) => {
        const formData = new FormData();
        formData.append('file', file);
        if (pages) {
            formData.append('pages', pages);
        }

        const response = await client.post('/cards/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 180000, // 3 minutes for large PDFs
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

    // Import cards from parsed CSV/Quizlet data
    importCSV: async (cards, deckName) => {
        const response = await client.post('/cards/import/csv', {
            cards,
            deck_name: deckName,
        });
        return response.data;
    },

    // Import cards from Anki .apkg file
    importAnki: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await client.post('/cards/import/anki', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 180000,
        });
        return response.data;
    },

    // Generate cards from plain text using AI
    generateFromText: async (text, deckName) => {
        const response = await client.post('/cards/generate/text', {
            text,
            deck_name: deckName,
        }, {
            timeout: 180000,
        });
        return response.data;
    },

    // Generate cards from PowerPoint file using AI
    importPPTX: async (file, deckName) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('deck_name', deckName);

        const response = await client.post('/cards/import/pptx', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 180000,
        });
        return response.data;
    },
};

// Folders API
export const foldersAPI = {
    createFolder: async (name, color = null, parentId = null) => {
        const response = await client.post('/cards/folders', {
            name,
            color,
            parent_id: parentId
        });
        return response.data;
    },

    updateFolder: async (id, data) => {
        const response = await client.put(`/cards/folders/${id}`, data);
        return response.data;
    },

    getFolders: async () => {
        const response = await client.get('/cards/folders');
        return response.data;
    },

    deleteFolder: async (id) => {
        await client.delete(`/cards/folders/${id}`);
    },
};

// Study API
export const studyAPI = {
    getStats: async (deckId) => {
        const response = await client.get(`/cards/study/${deckId}/stats`);
        return response.data;
    },

    getNextCard: async (deckId, mode, sessionCards = [], shuffle = false) => {
        const response = await client.post('/cards/study/next', {
            deck_id: deckId,
            mode: mode,
            session_cards: sessionCards,
            shuffle: shuffle
        });
        return response.data;
    },

    submitReview: async (cardId, mode, quality = null, answer = null) => {
        const response = await client.post('/cards/study/review', {
            card_id: cardId,
            mode: mode,
            quality: quality,
            answer: answer
        });
        return response.data;
    }
};

export default client;

