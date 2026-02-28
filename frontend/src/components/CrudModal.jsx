import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './CrudModal.css';

export default function CrudModal({ open, onClose, onSubmit, title, fields, initialData }) {
    const [form, setForm] = useState({});

    useEffect(() => {
        if (open) {
            const init = {};
            fields.forEach(f => { init[f.key] = initialData?.[f.key] ?? ''; });
            setForm(init);
        }
    }, [open, initialData, fields]);

    const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="modal-content glass-card"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3>{title}</h3>
                            <button className="btn-icon" onClick={onClose}><X size={18} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-body">
                            <div className="modal-fields">
                                {fields.map(f => (
                                    <div className="form-group" key={f.key}>
                                        <label>{f.label}</label>
                                        {f.type === 'select' ? (
                                            <select
                                                className="form-input"
                                                value={form[f.key] || ''}
                                                onChange={e => handleChange(f.key, e.target.value)}
                                            >
                                                <option value="">Select…</option>
                                                {f.options?.map(o => (
                                                    <option key={o.value} value={o.value}>{o.label}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                className="form-input"
                                                type={f.type || 'text'}
                                                placeholder={f.placeholder || f.label}
                                                value={form[f.key] || ''}
                                                onChange={e => handleChange(f.key, e.target.value)}
                                                required={f.required}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    {initialData ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
