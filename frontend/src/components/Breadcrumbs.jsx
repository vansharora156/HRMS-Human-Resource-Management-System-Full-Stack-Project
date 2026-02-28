import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import './Breadcrumbs.css';

const labelMap = {
    organization: 'Organization',
    employees: 'Employees',
    attendance: 'Attendance & Leave',
    payroll: 'Payroll',
    performance: 'Performance',
    recruitment: 'Recruitment',
    training: 'Training & Access',
    profile: 'Profile',
    settings: 'Settings',
};

export default function Breadcrumbs() {
    const { pathname } = useLocation();
    if (pathname === '/') return null;

    const segments = pathname.split('/').filter(Boolean);

    return (
        <nav className="breadcrumbs">
            <Link to="/" className="bc-item bc-home"><Home size={14} /></Link>
            {segments.map((seg, i) => {
                const path = '/' + segments.slice(0, i + 1).join('/');
                const label = labelMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);
                const isLast = i === segments.length - 1;
                return (
                    <span key={path} className="bc-group">
                        <ChevronRight size={13} className="bc-sep" />
                        {isLast ? (
                            <span className="bc-item bc-current">{label}</span>
                        ) : (
                            <Link to={path} className="bc-item">{label}</Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
