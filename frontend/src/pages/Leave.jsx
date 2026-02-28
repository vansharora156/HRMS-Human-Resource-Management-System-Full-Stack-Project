import { useEffect, useState } from 'react';
import { Plus, Calendar, Clock, CheckCircle, XCircle, AlertCircle, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const BalanceCard = ({ type, balance, color }) => {
    const colorStyles = {
        blue: {
            bg: 'bg-blue-500/10',
            border: 'border-blue-200/50',
            text: 'text-blue-500',
        },
        emerald: {
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-200/50',
            text: 'text-emerald-500',
        },
        violet: {
            bg: 'bg-violet-500/10',
            border: 'border-violet-200/50',
            text: 'text-violet-500',
        },
        amber: {
            bg: 'bg-amber-500/10',
            border: 'border-amber-200/50',
            text: 'text-amber-500',
        },
    };

    const style = colorStyles[color] || colorStyles.blue;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`glass-card p-6 rounded-2xl relative overflow-hidden border ${style.border}`}
        >
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-xl ${style.bg}`}></div>
            <div className="relative z-10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{type}</p>
                <h3 className="text-4xl font-bold text-slate-800 tracking-tight">{balance} <span className="text-sm font-medium text-slate-400 ml-1">days</span></h3>
            </div>
        </motion.div>
    );
};

const Leave = () => {
    const [leaves, setLeaves] = useState([]);
    const [balances, setBalances] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    // Employee Selection State
    const [employees, setEmployees] = useState([]);
    const [selectedEmpId, setSelectedEmpId] = useState('');

    const [formData, setFormData] = useState({
        leave_type_id: 1,
        from_date: '',
        to_date: '',
        status: 'Pending'
    });

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await api.get('/employees/');
                setEmployees(res.data);
                if (res.data.length > 0) {
                    setSelectedEmpId(res.data[0].id || res.data[0].employee_id);
                }
            } catch (error) {
                console.error("Error fetching employees", error);
            }
        };
        fetchEmployees();
    }, []);

    const fetchData = async (id) => {
        if (!id) return;
        setLoading(true);
        try {
            const [leavesRes, balancesRes] = await Promise.all([
                api.get(`/leave/${id}`),
                api.get(`/leave/balances/${id}`)
            ]);
            setLeaves(leavesRes.data);
            setBalances(balancesRes.data);
        } catch (error) {
            console.error("Error details:", error);
            // Fallback for demo if API fails
            setBalances([
                { balance_id: 1, leave_types: { name: 'Annual Leave' }, balance: 12 },
                { balance_id: 2, leave_types: { name: 'Sick Leave' }, balance: 5 },
                { balance_id: 3, leave_types: { name: 'Casual Leave' }, balance: 3 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedEmpId) {
            fetchData(selectedEmpId);
        }
    }, [selectedEmpId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/leave/apply', { ...formData, emp_id: selectedEmpId });
            setShowForm(false);
            fetchData(selectedEmpId);
        } catch (error) {
            console.error("Apply leave error:", error);
            const errorMsg = error.response?.data?.detail
                ? (typeof error.response.data.detail === 'object' ? JSON.stringify(error.response.data.detail) : error.response.data.detail)
                : error.message || "Failed to apply leave";
            alert("Application failed: " + errorMsg);
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Approved': return 'success';
            case 'Rejected': return 'error';
            case 'Pending': return 'warning';
            default: return 'default';
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Leave Management</h1>
                    <p className="text-slate-500 mt-1">View balances and manage leave requests.</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Employee Selector */}
                    <div className="relative">
                        <select
                            value={selectedEmpId}
                            onChange={(e) => setSelectedEmpId(e.target.value)}
                            className="appearance-none bg-white border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium shadow-sm transition-all cursor-pointer"
                        >
                            {employees.map(emp => (
                                <option key={emp.id || emp.employee_id} value={emp.id || emp.employee_id}>
                                    {emp.first_name} {emp.last_name}
                                </option>
                            ))}
                        </select>
                        <User size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    <Button variant="gradient" icon={Plus} onClick={() => setShowForm(!showForm)}>
                        Apply Leave
                    </Button>
                </div>
            </div>

            {/* Balances */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {balances.map((b, idx) => {
                    const colors = ['blue', 'emerald', 'violet', 'amber'];
                    const color = colors[idx % colors.length];
                    return (
                        <BalanceCard
                            key={b.balance_id || idx}
                            type={b.leave_types?.name || `Type ${b.leave_type_id}`}
                            balance={b.balance}
                            color={color}
                        />
                    );
                })}
                {balances.length === 0 && !loading && (
                    <div className="col-span-4 p-8 text-center text-slate-400 glass-card rounded-2xl">
                        No leave balances found.
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="glass-card p-8 rounded-3xl relative border border-indigo-100 shadow-xl shadow-indigo-500/10">
                            <button
                                onClick={() => setShowForm(false)}
                                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                                <span className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <Calendar size={20} />
                                </span>
                                New Leave Request
                            </h2>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Leave Type</label>
                                    <select
                                        className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        value={formData.leave_type_id}
                                        onChange={e => setFormData({ ...formData, leave_type_id: parseInt(e.target.value) })}
                                    >
                                        {balances.length > 0 ? balances.map(b => (
                                            <option key={b.leave_type_id} value={b.leave_type_id}>{b.leave_types?.name}</option>
                                        )) : <option value={1}>Annual Leave</option>}
                                    </select>
                                </div>
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">From Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                            required
                                            onChange={e => setFormData({ ...formData, from_date: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">To Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                            required
                                            onChange={e => setFormData({ ...formData, to_date: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4">
                                    <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                                    <Button type="submit" variant="gradient">Submit Request</Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* History Table */}
            <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/60 shadow-lg shadow-slate-200/20">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/30">
                    <Clock size={20} className="text-indigo-500" />
                    <h3 className="font-bold text-slate-800">Request History</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-8 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                                <th className="px-8 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration</th>
                                <th className="px-8 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Dates</th>
                                <th className="px-8 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white/40 divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="4" className="px-8 py-8 text-center text-slate-500">Loading history...</td></tr>
                            ) : leaves.length === 0 ? (
                                <tr><td colSpan="4" className="px-8 py-8 text-center text-slate-500">No leave history found</td></tr>
                            ) : (
                                leaves.map((l) => (
                                    <tr key={l.request_id} className="hover:bg-indigo-50/30 transition-colors">
                                        <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-slate-700">
                                            {l.leave_types?.name || `Type ${l.leave_type_id}`}
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-600">
                                            {/* Calculate duration if needed, or just show dates */}
                                            For {Math.ceil((new Date(l.to_date) - new Date(l.from_date)) / (1000 * 60 * 60 * 24)) + 1} days
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-500 font-mono">
                                            {l.from_date} <span className="text-slate-300 mx-2">→</span> {l.to_date}
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <Badge variant={getStatusVariant(l.status)}>
                                                {l.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Leave;
