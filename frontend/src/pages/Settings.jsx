import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Sun, Moon, Globe, Bell, Lock, Palette, Save } from 'lucide-react';
import { useToast } from '../components/Toast';
import './Settings.css';

export default function Settings() {
    const toast = useToast();
    const [settings, setSettings] = useState({
        theme: 'dark',
        language: 'en',
        notifications: true,
        emailAlerts: true,
        twoFactor: false,
        compactMode: false,
        timezone: 'Asia/Kolkata',
    });

    const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

    const handleSave = () => {
        toast.success('Settings saved successfully!');
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className="page-header">
                <div>
                    <h1>Settings</h1>
                    <p>Configure your application preferences</p>
                </div>
            </div>

            <div className="settings-grid">
                {/* ── Appearance ─────────────── */}
                <motion.div className="settings-section glass-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                    <div className="settings-header">
                        <Palette size={18} />
                        <h3>Appearance</h3>
                    </div>
                    <div className="settings-row">
                        <div>
                            <span className="settings-label">Theme</span>
                            <span className="settings-desc">Choose your preferred theme</span>
                        </div>
                        <div className="theme-toggle">
                            <button className={`theme-btn ${settings.theme === 'dark' ? 'active' : ''}`} onClick={() => setSettings(s => ({ ...s, theme: 'dark' }))}>
                                <Moon size={14} /> Dark
                            </button>
                            <button className={`theme-btn ${settings.theme === 'light' ? 'active' : ''}`} onClick={() => setSettings(s => ({ ...s, theme: 'light' }))}>
                                <Sun size={14} /> Light
                            </button>
                        </div>
                    </div>
                    <div className="settings-row">
                        <div>
                            <span className="settings-label">Compact Mode</span>
                            <span className="settings-desc">Reduce spacing for denser layout</span>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" checked={settings.compactMode} onChange={() => toggle('compactMode')} />
                            <span className="toggle-slider" />
                        </label>
                    </div>
                </motion.div>

                {/* ── Notifications ──────────── */}
                <motion.div className="settings-section glass-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="settings-header">
                        <Bell size={18} />
                        <h3>Notifications</h3>
                    </div>
                    <div className="settings-row">
                        <div>
                            <span className="settings-label">Push Notifications</span>
                            <span className="settings-desc">Receive in-app notifications</span>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" checked={settings.notifications} onChange={() => toggle('notifications')} />
                            <span className="toggle-slider" />
                        </label>
                    </div>
                    <div className="settings-row">
                        <div>
                            <span className="settings-label">Email Alerts</span>
                            <span className="settings-desc">Get notified via email</span>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" checked={settings.emailAlerts} onChange={() => toggle('emailAlerts')} />
                            <span className="toggle-slider" />
                        </label>
                    </div>
                </motion.div>

                {/* ── Security ───────────────── */}
                <motion.div className="settings-section glass-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <div className="settings-header">
                        <Lock size={18} />
                        <h3>Security</h3>
                    </div>
                    <div className="settings-row">
                        <div>
                            <span className="settings-label">Two-Factor Authentication</span>
                            <span className="settings-desc">Add an extra layer of security</span>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" checked={settings.twoFactor} onChange={() => toggle('twoFactor')} />
                            <span className="toggle-slider" />
                        </label>
                    </div>
                </motion.div>

                {/* ── Localization ───────────── */}
                <motion.div className="settings-section glass-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className="settings-header">
                        <Globe size={18} />
                        <h3>Localization</h3>
                    </div>
                    <div className="settings-row">
                        <div>
                            <span className="settings-label">Language</span>
                            <span className="settings-desc">App display language</span>
                        </div>
                        <select className="form-input" style={{ width: 'auto' }} value={settings.language} onChange={e => setSettings(s => ({ ...s, language: e.target.value }))}>
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                        </select>
                    </div>
                    <div className="settings-row">
                        <div>
                            <span className="settings-label">Timezone</span>
                            <span className="settings-desc">Set your local timezone</span>
                        </div>
                        <select className="form-input" style={{ width: 'auto' }} value={settings.timezone} onChange={e => setSettings(s => ({ ...s, timezone: e.target.value }))}>
                            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                            <option value="America/New_York">America/New_York (EST)</option>
                            <option value="Europe/London">Europe/London (GMT)</option>
                            <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                        </select>
                    </div>
                </motion.div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                <button className="btn btn-primary" onClick={handleSave}><Save size={16} /> Save Settings</button>
            </div>
        </motion.div>
    );
}
