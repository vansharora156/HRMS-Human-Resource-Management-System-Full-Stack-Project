import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password');
            return;
        }
        setLoading(true);
        try {
            const result = await login(email, password);
            if (!result.success) {
                setError(result.error || 'Invalid email or password');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Animated background orbs */}
            <div className="login-bg">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
                <div className="mesh-grid" />
            </div>

            <motion.div
                className="login-card"
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
            >
                {/* Logo */}
                <motion.div
                    className="login-logo"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.25 }}
                >
                    <div className="login-logo-icon">
                        <Sparkles size={28} />
                    </div>
                    <h1>HRMS Pro</h1>
                    <p>Sign in to your workspace</p>
                </motion.div>

                {/* Form */}
                <form className="login-form" onSubmit={handleSubmit}>
                    <motion.div
                        className="login-field"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 }}
                    >
                        <label>Email</label>
                        <div className="login-input-wrap">
                            <Mail size={16} className="login-input-icon" />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        className="login-field"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.45 }}
                    >
                        <label>Password</label>
                        <div className="login-input-wrap">
                            <Lock size={16} className="login-input-icon" />
                            <input
                                type={showPw ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </motion.div>

                    {error && (
                        <motion.div
                            className="login-error"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.button
                        className={`login-btn ${loading ? 'loading' : ''}`}
                        type="submit"
                        disabled={loading}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55 }}
                        whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(99,102,241,0.4)' }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? (
                            <div className="login-spinner" />
                        ) : (
                            <>Sign In <ArrowRight size={18} /></>
                        )}
                    </motion.button>
                </form>

                <motion.p
                    className="login-footer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    Don't have an account?{' '}
                    <Link to="/signup" className="auth-link">Create Account</Link>
                </motion.p>
            </motion.div>
        </div>
    );
}
