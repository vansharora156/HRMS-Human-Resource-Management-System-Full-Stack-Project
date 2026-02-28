import { useState, useEffect } from 'react';
import { Monitor, Smartphone, PenTool, Plus, X, Laptop, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import api from '../api/axios';

const Assets = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    // New Asset Form State
    const [formData, setFormData] = useState({
        name: '',
        category: 'Laptop',
        serial_number: '',
        status: 'Available'
    });

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const res = await api.get('/assets/');
            setAssets(res.data);
        } catch (error) {
            console.error("Failed to fetch assets", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/assets/', formData);
            setShowForm(false);
            setFormData({ name: '', category: 'Laptop', serial_number: '', status: 'Available' });
            fetchAssets();
        } catch (error) {
            console.error("Failed to save asset", error);
            alert("Failed to save asset");
        } finally {
            setSaving(false);
        }
    };

    const getIcon = (category) => {
        switch (category) {
            case 'Laptop': return <Laptop size={24} />;
            case 'Monitor': return <Monitor size={24} />;
            case 'Phone': return <Smartphone size={24} />;
            default: return <Box size={24} />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">My Assets</h1>
                    <p className="text-slate-500">Track assigned devices and inventory</p>
                </div>
                <Button onClick={() => setShowForm(true)} icon={Plus}>Add Asset</Button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="glass-card p-6 rounded-2xl relative border border-indigo-100">
                            <button
                                onClick={() => setShowForm(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                            >
                                <X size={20} />
                            </button>
                            <h2 className="text-lg font-bold mb-4 text-slate-800">Add New Asset</h2>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Asset Name</label>
                                    <input
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2"
                                        placeholder="e.g. MacBook Pro M3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2"
                                    >
                                        <option>Laptop</option>
                                        <option>Monitor</option>
                                        <option>Phone</option>
                                        <option>Accessory</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Serial Number</label>
                                    <input
                                        required
                                        value={formData.serial_number}
                                        onChange={e => setFormData({ ...formData, serial_number: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2"
                                        placeholder="e.g. C02XYZ..."
                                    />
                                </div>
                                <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                                    <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                                    <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Asset'}</Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assets.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-slate-500">No assets found.</div>
                    ) : (
                        assets.map(asset => (
                            <Card key={asset.id} className="group hover:shadow-md transition-all">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-slate-100 rounded-xl text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                            {getIcon(asset.category)}
                                        </div>
                                        <Badge variant={asset.status === 'Assigned' ? 'green' : 'blue'}>{asset.status}</Badge>
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-lg mb-1">{asset.name}</h3>
                                    <p className="text-sm text-slate-500 mb-4">ID: {asset.id} • {asset.serial_number}</p>

                                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
                                        <span className="text-slate-400">Date Added</span>
                                        <span className="font-medium text-slate-700">
                                            {asset.created_at ? new Date(asset.created_at).toLocaleDateString() : '-'}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Assets;
