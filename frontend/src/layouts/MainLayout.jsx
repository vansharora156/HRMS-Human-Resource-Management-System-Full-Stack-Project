import { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    // Helper to get title from path
    const getTitle = (path) => {
        const defaultTitle = 'Dashboard';
        const pathSegment = path.split('/')[1];
        if (!pathSegment) return defaultTitle;
        return pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1);
    };

    const user = localStorage.getItem('user');

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans relative selection:bg-indigo-500/30">
            {/* Background Pattern */}
            {/* Background Texture & Ambient Light */}
            <div className="absolute inset-0 z-0 bg-slate-50 bg-grain opacity-60 pointer-events-none"></div>

            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none mix-blend-multiply"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none mix-blend-multiply"></div>

            {/* Ambient Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none z-0" />

            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex-1 flex flex-col overflow-hidden relative z-10">
                <Navbar title={getTitle(location.pathname)} />

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 scroll-smooth scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-10">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
