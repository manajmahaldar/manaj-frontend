import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import api, { setApiToken, clearApiToken, registerAuthCallbacks } from '../utils/api';

export const AuthContext = createContext();

// removed manual REFRESH_URL parsing

export const AuthProvider = ({ children }) => {
    const [user,    setUser]    = useState(null);
    const [loading, setLoading] = useState(true);

    // ── Silent refresh (no auth header needed — uses httpOnly cookie) ─────────
    const silentRefresh = useCallback(async () => {
        try {
            const res = await api.post('/auth/refresh-token');
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

        // Attempt silent refresh if we think the user might be logged in.
        // This avoids 401 noise for pure guest visitors while still
        // recovering sessions where localStorage was cleared but cookie remains.
        if (storedUser) {
            silentRefresh().finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
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
