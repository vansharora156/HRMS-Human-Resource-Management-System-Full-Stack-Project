import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Calendar, Camera, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import './Profile.css';

export default function Profile() {
    const { user } = useAuth();
    const toast = useToast();
    const [profile, setProfile] = useState({
        fullName: user?.name || '',
        email: `${(user?.username || 'user')}@company.com`,
        phone: '+91 9876543210',
        department: 'Human Resources',
        designation: 'HR Manager',
        bio: 'Experienced HR professional focused on employee engagement and organizational development.',
    });

    const handleChange = (key, val) => setProfile(prev => ({ ...prev, [key]: val }));

    const handleSave = () => {
        toast.success('Profile updated successfully!');
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className="page-header">
                <div>
                    <h1>My Profile</h1>
                    <p>Manage your personal information</p>
                </div>
            </div>

            <div className="profile-layout">
                {/* ── Left: Avatar card ──────── */}
                <motion.div
                    className="profile-card glass-card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="profile-avatar-wrap">
                        <div className="profile-avatar">{user?.avatar || 'U'}</div>
                        <button className="profile-avatar-edit"><Camera size={14} /></button>
                    </div>
                    <h3>{profile.fullName}</h3>
                    <span className="profile-role">{profile.designation}</span>
                    <div className="profile-meta">
                        <div className="profile-meta-item">
                            <Shield size={14} /> <span>{user?.role || 'Admin'}</span>
                        </div>
                        <div className="profile-meta-item">
                            <Calendar size={14} /> <span>Joined {new Date(user?.loginTime || Date.now()).toLocaleDateString()}</span>
                        </div>
                    </div>
                </motion.div>

                {/* ── Right: Details form ─────── */}
                <motion.div
                    className="profile-details glass-card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <h3>Personal Information</h3>
                    <div className="profile-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input className="form-input" value={profile.fullName} onChange={e => handleChange('fullName', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input className="form-input" type="email" value={profile.email} onChange={e => handleChange('email', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input className="form-input" value={profile.phone} onChange={e => handleChange('phone', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Department</label>
                            <input className="form-input" value={profile.department} onChange={e => handleChange('department', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Designation</label>
                            <input className="form-input" value={profile.designation} onChange={e => handleChange('designation', e.target.value)} />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Bio</label>
                            <textarea className="form-input" rows={3} value={profile.bio} onChange={e => handleChange('bio', e.target.value)} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                        <button className="btn btn-primary" onClick={handleSave}><Save size={16} /> Save Changes</button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
