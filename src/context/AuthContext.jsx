import { createContext, useState, useEffect, useCallback } from 'react';
import { setApiToken, clearApiToken, registerAuthCallbacks } from '../utils/api';
import * as authService from '../services/auth.service.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user,    setUser]    = useState(null);
    const [loading, setLoading] = useState(true);

    // ── Silent refresh (no auth header needed — uses httpOnly cookie) ─────────
    const silentRefresh = useCallback(async () => {
        const token = await authService.silentRefresh();
        if (token) {
            setApiToken(token);
        } else {
            clearApiToken();
            setUser(null);
            localStorage.removeItem('user');
        }
        return token;
    }, []);

    // ── Logout — invalidates refresh token on server, clears everything ───────
    const logout = useCallback(async () => {
        await authService.logout();
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

        // Attempt silent refresh only if we think user was previously logged in
        if (storedUser) {
            silentRefresh().finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── login — called after a successful POST /api/auth/login ───────────────
    // @param {{ token: string, user: object }} data
    const login = (data) => {
        setApiToken(data.token);
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Refresh token is stored as httpOnly cookie by the server automatically
    };

    // ── updateUser — after profile edits ─────────────────────────────────────
    // Accepts an object OR an updater function (like useState's setter)
    const updateUser = (updatedUserOrFn) => {
        setUser((prev) => {
            const next =
                typeof updatedUserOrFn === 'function'
                    ? updatedUserOrFn(prev)
                    : updatedUserOrFn;
            localStorage.setItem('user', JSON.stringify(next));
            return next;
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
