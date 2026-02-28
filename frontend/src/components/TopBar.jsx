import { useAuth } from '../context/AuthContext';
import { Bell, Search, LogOut, ChevronDown } from 'lucide-react';
import './TopBar.css';

export default function TopBar() {
    const { user, logout } = useAuth();

    return (
        <header className="topbar">
            <div className="topbar-search">
                <Search size={16} />
                <input type="text" placeholder="Search anything…" />
            </div>

            <div className="topbar-right">
                <button className="topbar-icon-btn">
                    <Bell size={18} />
                    <span className="notif-dot" />
                </button>

                <div className="topbar-user">
                    <div className="topbar-avatar">{user?.avatar || 'U'}</div>
                    <div className="topbar-user-info">
                        <span className="topbar-name">{user?.name || 'User'}</span>
                        <span className="topbar-role">{user?.role || 'Admin'}</span>
                    </div>
                    <ChevronDown size={14} className="topbar-chevron" />
                </div>

                <button className="topbar-icon-btn logout-btn" onClick={logout} title="Logout">
                    <LogOut size={17} />
                </button>
            </div>
        </header>
    );
}
