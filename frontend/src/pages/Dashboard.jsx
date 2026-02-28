import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Users, Building2, Briefcase, CalendarClock,
    TrendingUp, UserPlus, DollarSign, Activity,
    ArrowUpRight, Clock, UserCheck, FileText, Zap,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../components/StatCard';
import { getAll } from '../api';
import './Dashboard.css';

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#22c55e', '#f59e0b', '#3b82f6'];

const quickActions = [
    { label: 'Add Employee', icon: UserPlus, path: '/employees', color: '#6366f1' },
    { label: 'Mark Attendance', icon: UserCheck, path: '/attendance', color: '#22c55e' },
    { label: 'Run Payroll', icon: DollarSign, path: '/payroll', color: '#f59e0b' },
    { label: 'View Reports', icon: FileText, path: '/performance', color: '#3b82f6' },
];

export default function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ employees: 0, departments: 0, companies: 0, openJobs: 0, leaves: 0, attendance: 0 });
    const [empData, setEmpData] = useState([]);
    const [deptData, setDeptData] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const [emp, dept, comp, jobs, leaves, att] = await Promise.all([
                    getAll('employees'),
                    getAll('departments'),
                    getAll('companies'),
                    getAll('job-openings'),
                    getAll('leave-requests'),
                    getAll('attendance'),
                ]);
                setStats({
                    employees: emp.data.length,
                    departments: dept.data.length,
                    companies: comp.data.length,
                    openJobs: jobs.data.length,
                    leaves: leaves.data.filter(l => l.status === 'PENDING').length,
                    attendance: att.data.length,
                });

                // Chart data — employees by trend (mock monthly)
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
                const base = Math.max(emp.data.length - 5, 1);
                setEmpData(months.map((m, i) => ({ name: m, count: base + i })));

                // Pie data — employees per department
                const deptMap = {};
                emp.data.forEach(e => {
                    const key = e.dept_id || 'Unknown';
                    deptMap[key] = (deptMap[key] || 0) + 1;
                });
                const deptNames = {};
                dept.data.forEach(d => { deptNames[d.dept_id] = d.name; });
                setDeptData(Object.entries(deptMap).map(([id, val]) => ({
                    name: deptNames[id] || `Dept ${id}`,
                    value: val,
                })));
            } catch (e) { console.error(e); }
        };
        load();
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back! Here's your HRMS overview.</p>
                </div>
            </div>

            {/* ── Stat cards ──────────────────── */}
            <div className="grid grid-4 gap-4">
                <StatCard icon={Users} label="Total Employees" value={stats.employees} color="accent" delay={0.05} />
                <StatCard icon={Building2} label="Departments" value={stats.departments} color="info" delay={0.10} />
                <StatCard icon={UserPlus} label="Open Positions" value={stats.openJobs} color="success" delay={0.15} />
                <StatCard icon={CalendarClock} label="Pending Leaves" value={stats.leaves} color="warning" delay={0.20} />
            </div>

            {/* ── Charts ──────────────────────── */}
            <div className="grid grid-2 gap-4 mt-4">
                <motion.div
                    className="chart-card glass-card"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                >
                    <h3>Employee Growth</h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={empData}>
                            <defs>
                                <linearGradient id="colorEmp" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#475569" fontSize={12} />
                            <YAxis stroke="#475569" fontSize={12} />
                            <Tooltip
                                contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }}
                            />
                            <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fill="url(#colorEmp)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div
                    className="chart-card glass-card"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    <h3>Employees by Department</h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <Pie
                                data={deptData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={90}
                                paddingAngle={4}
                                dataKey="value"
                            >
                                {deptData.map((_, i) => (
                                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="pie-legend">
                        {deptData.map((d, i) => (
                            <span key={i} className="pie-legend-item">
                                <span className="pie-dot" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                                {d.name}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ── Quick actions ───────────────── */}
            <motion.div
                className="quick-actions glass-card mt-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
            >
                <h3><Zap size={16} /> Quick Actions</h3>
                <div className="qa-grid">
                    {quickActions.map((a, i) => (
                        <motion.button
                            key={i}
                            className="qa-item"
                            onClick={() => navigate(a.path)}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <div className="qa-icon" style={{ background: `${a.color}18`, color: a.color }}>
                                <a.icon size={20} />
                            </div>
                            <span>{a.label}</span>
                            <ArrowUpRight size={14} className="qa-arrow" />
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
