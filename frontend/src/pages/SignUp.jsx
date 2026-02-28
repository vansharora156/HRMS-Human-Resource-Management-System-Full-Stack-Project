import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Lock, Mail, User, Eye, EyeOff, ArrowRight, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function SignUp() {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!fullName.trim() || !email.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            const result = await signup(fullName, email, password);
            if (result.success) {
                setSuccess('Account created successfully! Redirecting...');
                setTimeout(() => navigate('/'), 1200);
            } else {
                setError(result.error || 'Sign up failed. Please try again.');
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
                className="login-card signup-card"
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
                    <div className="login-logo-icon signup-logo-icon">
                        <UserPlus size={28} />
                    </div>
                    <h1>Create Account</h1>
                    <p>Join HRMS Pro workspace</p>
                </motion.div>

                {/* Form */}
                <form className="login-form" onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <motion.div
                        className="login-field"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <label>Full Name</label>
                        <div className="login-input-wrap">
                            <User size={16} className="login-input-icon" />
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </motion.div>

                    {/* Email */}
                    <motion.div
                        className="login-field"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.38 }}
                    >
                        <label>Email</label>
                        <div className="login-input-wrap">
                            <Mail size={16} className="login-input-icon" />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                    </motion.div>

                    {/* Password */}
                    <motion.div
                        className="login-field"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.46 }}
                    >
                        <label>Password</label>
                        <div className="login-input-wrap">
                            <Lock size={16} className="login-input-icon" />
                            <input
                                type={showPw ? 'text' : 'password'}
                                placeholder="Minimum 6 characters"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </motion.div>

                    {/* Confirm Password */}
                    <motion.div
                        className="login-field"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.54 }}
                    >
                        <label>Confirm Password</label>
                        <div className="login-input-wrap">
                            <Lock size={16} className="login-input-icon" />
                            <input
                                type={showConfirmPw ? 'text' : 'password'}
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                            <button type="button" className="pw-toggle" onClick={() => setShowConfirmPw(!showConfirmPw)}>
                                {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </motion.div>

                    {/* Error */}
                    {error && (
                        <motion.div
                            className="login-error"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Success */}
                    {success && (
                        <motion.div
                            className="login-success"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                        >
                            {success}
                        </motion.div>
                    )}

                    {/* Submit */}
                    <motion.button
                        className={`login-btn signup-btn ${loading ? 'loading' : ''}`}
                        type="submit"
                        disabled={loading}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(16,185,129,0.4)' }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? (
                            <div className="login-spinner" />
                        ) : (
                            <>Create Account <ArrowRight size={18} /></>
                        )}
                    </motion.button>
                </form>

                <motion.p
                    className="login-footer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">Sign In</Link>
                </motion.p>
            </motion.div>
        </div>
    );
}
