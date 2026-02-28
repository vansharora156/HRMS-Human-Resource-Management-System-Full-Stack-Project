
import { useState, useEffect } from 'react';
import { Plus, Receipt, X, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const Finance = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        employee_id: '',
        category: 'Meals',
        amount: '',
        description: '',
        status: 'Pending'
    });

    const fetchInitialData = async () => {
        try {
            const [expensesRes, empRes] = await Promise.all([
                api.get('/finance/expenses'),
                api.get('/employees/')
            ]);
            setClaims(expensesRes.data);
            setEmployees(empRes.data);
            if (empRes.data.length > 0) {
                setFormData(prev => ({ ...prev, employee_id: empRes.data[0].id || empRes.data[0].employee_id }));
            }
        } catch (err) {
            console.error("Failed to fetch finance data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchClaims = async () => {
        try {
            const res = await api.get('/finance/expenses');
            setClaims(res.data);
        } catch (err) {
            console.error("Failed to fetch claims", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/finance/expenses', {
                ...formData,
                amount: parseFloat(formData.amount),
                claim_date: new Date().toISOString().split('T')[0]
            });
            setShowForm(false);
            setFormData(prev => ({ ...prev, amount: '', description: '' }));
            fetchClaims();
        } catch (err) {
            console.error("Failed to submit claim", err);
            alert("Failed to submit claim: " + (err.response?.data?.detail || err.message));
        } finally {
            setSaving(false);
        }
    };

    const totalPending = claims.filter(c => c.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
    const totalApproved = claims.filter(c => c.status === 'Approved').reduce((acc, curr) => acc + curr.amount, 0);
    const totalPaid = claims.filter(c => c.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Expenses & Claims</h1>
                    <p className="text-slate-500">Manage reimbursements</p>
                </div>
                <Button onClick={() => setShowForm(true)}>
                    <Plus size={18} className="mr-2" /> New Claim
                </Button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="glass-card p-6 rounded-2xl relative border border-indigo-100 shadow-lg">
                            <button
                                onClick={() => setShowForm(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                            >
                                <X size={20} />
                            </button>
                            <h2 className="text-lg font-bold mb-6 text-slate-800">Submit New Claim</h2>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Employee</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5"
                                        value={formData.employee_id}
                                        onChange={e => setFormData({ ...formData, employee_id: e.target.value })}
                                    >
                                        {employees.map(emp => (
                                            <option key={emp.id || emp.employee_id} value={emp.id || emp.employee_id}>
                                                {emp.first_name} {emp.last_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Category</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>Meals</option>
                                        <option>Travel</option>
                                        <option>Internet</option>
                                        <option>Office Supplies</option>
                                        <option>Training</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Amount ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5"
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Description</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="e.g. Lunch with client"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-2">
                                    <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                                    <Button type="submit" disabled={saving}>
                                        {saving ? <Loader2 className="animate-spin" size={18} /> : 'Submit Claim'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm text-slate-500 mb-1">Pending Approval</p>
                        <p className="text-3xl font-bold text-slate-800">${totalPending.toFixed(2)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm text-slate-500 mb-1">Approved (Unpaid)</p>
                        <p className="text-3xl font-bold text-green-600">${totalApproved.toFixed(2)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm text-slate-500 mb-1">Paid (YTD)</p>
                        <p className="text-3xl font-bold text-blue-600">${totalPaid.toFixed(2)}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Claims</CardTitle>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-sm">
                            <tr>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Category</th>
                                <th className="px-6 py-3 font-medium">Description</th>
                                <th className="px-6 py-3 font-medium">Amount</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {claims.length === 0 ? (
                                <tr><td colSpan="5" className="p-6 text-center text-slate-500">No claims found.</td></tr>
                            ) : claims.map((claim) => (
                                <tr key={claim.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-slate-500 text-sm">{claim.claim_date}</td>
                                    <td className="px-6 py-4 text-slate-800 font-medium">
                                        <div className="flex items-center">
                                            <div className="p-1.5 bg-slate-100 rounded mr-3 text-slate-500">
                                                <Receipt size={14} />
                                            </div>
                                            {claim.category}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">{claim.description}</td>
                                    <td className="px-6 py-4 text-slate-800 font-bold">${claim.amount}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={
                                            claim.status === 'Paid' ? 'green' :
                                                claim.status === 'Approved' ? 'blue' : 'yellow'
                                        }>{claim.status}</Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Finance;
