import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api/auth';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ── Restore session from localStorage on mount ──────────
    useEffect(() => {
        const stored = localStorage.getItem('hrms_session');
        if (stored) {
            try {
                const session = JSON.parse(stored);
                // Try to refresh the token to validate the session
                refreshSession(session.refresh_token).then(valid => {
                    if (!valid) {
                        // Token refresh failed — try using stored user as fallback
                        const storedUser = localStorage.getItem('hrms_user');
                        if (storedUser) {
                            setUser(JSON.parse(storedUser));
                        }
                    }
                    setLoading(false);
                });
            } catch {
                setLoading(false);
            }
        } else {
            // Fall back to old localStorage user (for backwards compat)
            const saved = localStorage.getItem('hrms_user');
            if (saved) {
                setUser(JSON.parse(saved));
            }
            setLoading(false);
        }
    }, []);

    // ── Persist user whenever it changes ─────────────────────
    useEffect(() => {
        if (user) {
            localStorage.setItem('hrms_user', JSON.stringify(user));
        }
    }, [user]);

    // ── Refresh token ───────────────────────────────────────
    const refreshSession = useCallback(async (refreshToken) => {
        try {
            const res = await axios.post(`${API_BASE}/refresh`, {
                refresh_token: refreshToken,
            });
            const { user: userData, session } = res.data;
            setUser({
                id: userData.id,
                email: userData.email,
                name: userData.full_name || userData.email.split('@')[0],
                full_name: userData.full_name,
                role: 'Admin',
                avatar: (userData.full_name || userData.email)[0].toUpperCase(),
            });
            localStorage.setItem('hrms_session', JSON.stringify(session));
            return true;
        } catch {
            return false;
        }
    }, []);

    // ── Sign-up ─────────────────────────────────────────────
    const signup = async (fullName, email, password) => {
        try {
            const res = await axios.post(`${API_BASE}/signup`, {
                full_name: fullName,
                email,
                password,
            });
            const { user: userData, session } = res.data;

            const userObj = {
                id: userData.id,
                email: userData.email,
                name: fullName || email.split('@')[0],
                full_name: fullName,
                role: 'Admin',
                avatar: (fullName || email)[0].toUpperCase(),
                loginTime: new Date().toISOString(),
            };

            setUser(userObj);

            if (session) {
                localStorage.setItem('hrms_session', JSON.stringify(session));
            }

            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.error || 'Sign up failed';
            return { success: false, error: msg };
        }
    };

    // ── Login ───────────────────────────────────────────────
    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_BASE}/login`, {
                email,
                password,
            });
            const { user: userData, session } = res.data;

            const userObj = {
                id: userData.id,
                email: userData.email,
                name: userData.full_name || email.split('@')[0],
                full_name: userData.full_name,
                role: 'Admin',
                avatar: (userData.full_name || email)[0].toUpperCase(),
                loginTime: new Date().toISOString(),
            };

            setUser(userObj);
            localStorage.setItem('hrms_session', JSON.stringify(session));

            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.error || 'Login failed';
            return { success: false, error: msg };
        }
    };

    // ── Logout ──────────────────────────────────────────────
    const logout = () => {
        setUser(null);
        localStorage.removeItem('hrms_user');
        localStorage.removeItem('hrms_session');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
