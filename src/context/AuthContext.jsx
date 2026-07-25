/**
 * AuthContext.jsx
 *
 * Session Persistence Strategy
 * ────────────────────────────
 * 1. On page load: read access token from localStorage and set it in memory.
 * 2. Hit GET /users/profile with that token.
 *    ✅ Success   → session restored, no cookie needed (covers 99% of refreshes
 *                   that happen within the 15-min access-token lifetime).
 *    🔄 401       → access token expired; attempt httpOnly-cookie silent refresh
 *                   to get a new one, then retry profile fetch.
 *    🌐 Network   → keep cached user (offline tolerance).
 * 3. Only clear the session when:
 *    • the user explicitly logs out, OR
 *    • the server returns 401 AND the cookie refresh also fails.
 *
 * StrictMode fix
 * ──────────────
 * React 18 StrictMode mounts → unmounts → remounts every component in dev.
 * Without a guard, two concurrent cookie-refresh requests race against the
 * backend's refresh-token rotation, causing the second request to be rejected
 * (token already consumed), triggering an unintended logout.
 * The module-level `_bootstrapped` flag ensures the bootstrap runs exactly
 * once per page load, regardless of how many times the component mounts.
 *
 * Performance
 * ───────────
 * Split into two contexts to prevent unnecessary re-renders:
 * - AuthStateContext  → { user, loading }         (changes on auth events)
 * - AuthActionsContext → { login, logout, updateUser } (stable, never changes)
 *
 * Backward compat: AuthContext is aliased to AuthStateContext so existing
 * `useContext(AuthContext)` consumers still work without changes.
 */
import { createContext, useState, useEffect, useCallback, useMemo, useContext } from 'react';
import api, { setApiToken, clearApiToken, registerAuthCallbacks } from '../utils/api';
import * as authService from '../services/auth.service.js';

// ── Contexts ──────────────────────────────────────────────────────────────────
export const AuthContext        = createContext(); // { user, loading, login, logout, updateUser }
export const AuthStateContext   = AuthContext;
export const AuthActionsContext = createContext(); // { login, logout, updateUser }

// ── Convenience hooks ──────────────────────────────────────────────────────────
export const useAuth        = () => useContext(AuthContext);
export const useAuthState   = () => useContext(AuthStateContext);
export const useAuthActions = () => useContext(AuthActionsContext);

// ── Module-level flag: survives StrictMode's double-mount ─────────────────────
// Reset to false only on a real page reload (module re-evaluation).
let _bootstrapped = false;

export const AuthProvider = ({ children }) => {
    const [user,    setUser]    = useState(null);
    const [loading, setLoading] = useState(true);

    // ── silentRefresh: registered with api.js interceptor ────────────────────
    // Called automatically by the response interceptor when it encounters a
    // TOKEN_EXPIRED 401. Returns the new access token (string) or null.
    // NOTE: does NOT fetch the user profile — that is the caller's responsibility
    // (avoids recursive interceptor triggers).
    const silentRefresh = useCallback(async () => {
        console.log('[Auth] Attempting cookie-based silent refresh...');
        const token = await authService.silentRefresh();

        if (token) {
            console.log('[Auth] ✅ Cookie refresh successful — new token obtained.');
            setApiToken(token);
            localStorage.setItem('token', token);
        } else {
            console.log('[Auth] ❌ Cookie refresh failed — clearing session.');
            clearApiToken();
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }

        return token;
    }, []);

    // ── logout ─────────────────────────────────────────────────────────────────
    const logout = useCallback(async () => {
        console.log('[Auth] User logout initiated...');
        await authService.logout();
        clearApiToken();
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        console.log('[Auth] ✅ Session cleared.');
    }, []);

    // Register callbacks so api.js interceptor can call them ──────────────────
    useEffect(() => {
        registerAuthCallbacks(silentRefresh, logout);
    }, [silentRefresh, logout]);

    // ── Bootstrap ─────────────────────────────────────────────────────────────
    useEffect(() => {
        // Guard: run exactly once per page load (fixes React 18 StrictMode double-mount)
        if (_bootstrapped) {
            console.log('[Auth] Bootstrap already ran — skipping StrictMode re-run.');
            return;
        }
        _bootstrapped = true;

        const bootstrap = async () => {
            console.log('[Auth] 🚀 Initializing authentication state...');

            const storedToken = localStorage.getItem('token');
            const storedUser  = localStorage.getItem('user');

            console.log('[Auth] Token in localStorage:', storedToken ? '✅ Found' : '❌ Not found');

            if (storedToken) {
                // Step 1 — Put the token in memory before any protected requests run.
                setApiToken(storedToken);
            }

            // Step 2 — Restore cached user immediately so the UI isn't blank.
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                    console.log('[Auth] Cached user displayed instantly.');
                } catch {
                    console.warn('[Auth] Corrupt user data in localStorage — removing.');
                    localStorage.removeItem('user');
                }
            }

            if (!storedToken) {
                console.log('[Auth] No stored token — user is not logged in.');
                setLoading(false);
                return;
            }

            // Step 3 — Validate the stored token by hitting the profile endpoint ──
            // The response interceptor in utils/api.js will automatically handle a
            // TOKEN_EXPIRED 401 by calling silentRefresh + retrying, so if refresh
            // succeeds the try-block receives the retried response transparently.
            try {
                console.log('[Auth] Validating token via GET /users/profile...');
                const res = await api.get('/users/profile');
                setUser(res.data);
                localStorage.setItem('user', JSON.stringify(res.data));
                console.log('[Auth] ✅ Token valid. User restored:', res.data?.name ?? res.data?.email ?? 'unknown');

            } catch (err) {
                const status = err?.response?.status;

                if (status === 401) {
                    // The interceptor already tried to refresh (and failed), or the
                    // endpoint returned a plain 401 without TOKEN_EXPIRED code.
                    // Either way, the session is gone.
                    console.log('[Auth] ❌ Token invalid (401) — session could not be restored.');
                    clearApiToken();
                    setUser(null);
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');

                } else {
                    // Non-401 (network error, 500, etc.) → keep cached user.
                    // The user stays "logged in" and can retry when connectivity returns.
                    console.warn('[Auth] ⚠️ Network/server error during validation — using cached session.', err.message);
                }
            }

            console.log('[Auth] ✅ Authentication initialization complete.');
            setLoading(false);
        };

        bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── login — called after a successful POST /api/auth/login ───────────────
    const login = useCallback((data) => {
        console.log('[Auth] Login — storing session for:', data.user?.name ?? data.user?.email ?? 'unknown');
        setApiToken(data.token);
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        // httpOnly refresh-token cookie is set automatically by the server response
    }, []);

    // ── updateUser — after profile edits ─────────────────────────────────────
    const updateUser = useCallback((updatedUserOrFn) => {
        setUser((prev) => {
            const next =
                typeof updatedUserOrFn === 'function'
                    ? updatedUserOrFn(prev)
                    : updatedUserOrFn;
            localStorage.setItem('user', JSON.stringify(next));
            return next;
        });
    }, []);

    // ── Memoize context values to prevent unnecessary re-renders ─────────────
    // fullAuthValue changes when user or loading changes.
    // actionsValue is stable — login/logout/updateUser are useCallback-wrapped.
    const fullAuthValue = useMemo(() => ({ user, loading, login, logout, updateUser }), [user, loading, login, logout, updateUser]);
    const actionsValue  = useMemo(() => ({ login, logout, updateUser }), [login, logout, updateUser]);

    return (
        <AuthActionsContext.Provider value={actionsValue}>
            <AuthContext.Provider value={fullAuthValue}>
                {children}
            </AuthContext.Provider>
        </AuthActionsContext.Provider>
    );
};
