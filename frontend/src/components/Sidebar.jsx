import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Building2, Users, CalendarClock, Wallet,
    Target, UserSearch, GraduationCap, ChevronLeft, ChevronRight,
    Sparkles, Settings, UserCircle,
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/organization', label: 'Organization', icon: Building2 },
    { path: '/employees', label: 'Employees', icon: Users },
    { path: '/attendance', label: 'Attendance & Leave', icon: CalendarClock },
    { path: '/payroll', label: 'Payroll', icon: Wallet },
    { path: '/performance', label: 'Performance', icon: Target },
    { path: '/recruitment', label: 'Recruitment', icon: UserSearch },
    { path: '/training', label: 'Training & Access', icon: GraduationCap },
];

export default function Sidebar({ collapsed, setCollapsed }) {
    const location = useLocation();

    return (
        <motion.aside
            className={`sidebar ${collapsed ? 'collapsed' : ''}`}
            animate={{ width: collapsed ? 72 : 260 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            {/* ── Logo ────────────────────────── */}
            <div className="sidebar-logo">
                <div className="logo-icon">
                    <Sparkles size={20} />
                </div>
                <AnimatePresence>
                    {!collapsed && (
                        <motion.span
                            className="logo-text"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            HRMS Pro
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Navigation ──────────────────── */}
            <nav className="sidebar-nav">
                {navItems.map(({ path, label, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                        end={path === '/'}
                    >
                        <div className="nav-icon-wrap">
                            <Icon size={19} />
                        </div>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.span
                                    className="nav-label"
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -8 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {label}
                                </motion.span>
                            )}
                        </AnimatePresence>
                        {location.pathname === path && (
                            <motion.div
                                className="nav-active-indicator"
                                layoutId="activeNav"
                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* ── Bottom links ──────────────────── */}
            <div className="sidebar-bottom">
                <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <div className="nav-icon-wrap"><UserCircle size={19} /></div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span className="nav-label" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.15 }}>
                                Profile
                            </motion.span>
                        )}
                    </AnimatePresence>
                    {location.pathname === '/profile' && (
                        <motion.div className="nav-active-indicator" layoutId="activeNav" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                    )}
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <div className="nav-icon-wrap"><Settings size={19} /></div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span className="nav-label" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.15 }}>
                                Settings
                            </motion.span>
                        )}
                    </AnimatePresence>
                    {location.pathname === '/settings' && (
                        <motion.div className="nav-active-indicator" layoutId="activeNav" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                    )}
                </NavLink>
            </div>

            {/* ── Collapse toggle ─────────────── */}
            <button
                className="sidebar-toggle"
                onClick={() => setCollapsed(!collapsed)}
            >
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
        </motion.aside>
    );
}
