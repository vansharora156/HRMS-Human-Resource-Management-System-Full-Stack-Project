import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import './ConfirmDialog.css';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="confirm-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="confirm-card glass-card"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="confirm-icon">
                            <AlertTriangle size={28} />
                        </div>
                        <h3>{title || 'Confirm Delete'}</h3>
                        <p>{message || 'Are you sure you want to delete this record? This action cannot be undone.'}</p>
                        <div className="confirm-actions">
                            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                            <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
