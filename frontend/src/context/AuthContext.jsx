import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if token exists and is valid
        if (token) {
            setUser({ email: 'user' }); // Simple user state
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        const data = await authAPI.login(email, password);
        console.log('Login response:', data);
        console.log('Token:', data.access_token);
        localStorage.setItem('token', data.access_token);
        console.log('Stored token:', localStorage.getItem('token'));
        setToken(data.access_token);
        setUser({ email });
        return data;
    };

    const register = async (email, password) => {
        const data = await authAPI.register(email, password);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
