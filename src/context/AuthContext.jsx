import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import api, { setApiToken, clearApiToken, registerAuthCallbacks } from '../utils/api';

export const AuthContext = createContext();

const REFRESH_URL =
    (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api')
        .replace(/\/api$/, '') + '/api/auth/refresh-token';

export const AuthProvider = ({ children }) => {
    const [user,    setUser]    = useState(null);
    const [loading, setLoading] = useState(true);

    // ── Silent refresh (no auth header needed — uses httpOnly cookie) ─────────
    const silentRefresh = useCallback(async () => {
        try {
            const res = await axios.post(REFRESH_URL, {}, { withCredentials: true });
            const { token } = res.data;
            setApiToken(token);
            return token;
        } catch {
            clearApiToken();
            setUser(null);
            localStorage.removeItem('user');
            return null;
        }
    }, []);

    // ── Logout — invalidates refresh token on server, clears everything ───────
    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout');
        } catch {
            // Best-effort — clear client state regardless
        }
        clearApiToken();
        setUser(null);
        localStorage.removeItem('user');
    }, []);

    // ── Register callbacks in api.js BEFORE the bootstrap effect ─────────────
    useEffect(() => {
        registerAuthCallbacks(silentRefresh, logout);
    }, [silentRefresh, logout]);

    // ── Bootstrap: restore cached user, then silently refresh access token ────
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try { setUser(JSON.parse(storedUser)); } catch { /* corrupt data */ }
        }

        // Attempt silent refresh to get a fresh access token on every page load.
        // Fails gracefully if cookie is absent or expired.
        silentRefresh().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── login — called after a successful POST /api/auth/login ───────────────
    const login = (data) => {
        setApiToken(data.token);
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Refresh token is stored as httpOnly cookie by the server automatically
    };

    // ── updateUser — after profile edits ─────────────────────────────────────
    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
