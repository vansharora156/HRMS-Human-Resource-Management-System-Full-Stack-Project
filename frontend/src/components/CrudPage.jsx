import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, RefreshCw, Download } from 'lucide-react';
import DataTable from './DataTable';
import CrudModal from './CrudModal';
import ConfirmDialog from './ConfirmDialog';
import { useToast } from './Toast';
import { getAll, createOne, updateOne, deleteOne } from '../api';

/**
 * Reusable CRUD page section for a single table.
 */
export default function CrudPage({ table, pk, title, columns, fields }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const toast = useToast();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAll(table);
            setData(res.data);
        } catch (e) {
            console.error(e);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    }, [table]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSubmit = async (form) => {
        try {
            if (editing) {
                await updateOne(table, editing[pk], form);
                toast.success(`${title} updated successfully`);
            } else {
                await createOne(table, form);
                toast.success(`${title} created successfully`);
            }
            setModalOpen(false);
            setEditing(null);
            fetchData();
        } catch (e) {
            console.error(e);
            toast.error('Operation failed: ' + (e.response?.data?.error || e.message));
        }
    };

    const handleEdit = (row) => {
        setEditing(row);
        setModalOpen(true);
    };

    const handleDeleteClick = (row) => {
        setDeleteTarget(row);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        try {
            await deleteOne(table, deleteTarget[pk]);
            toast.success(`${title} deleted successfully`);
            fetchData();
        } catch (e) {
            console.error(e);
            toast.error('Delete failed: ' + (e.response?.data?.error || e.message));
        } finally {
            setDeleteTarget(null);
        }
    };

    const exportCSV = () => {
        if (!data.length) { toast.warning('No data to export'); return; }
        const headers = columns.map(c => c.label);
        const rows = data.map(row => columns.map(c => {
            const val = row[c.key];
            // escape commas and quotes
            const str = String(val ?? '');
            return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
        }));
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${table}_export.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.info(`Exported ${data.length} records`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{title}</h2>
                <div className="flex gap-2">
                    <button className="btn-icon" onClick={exportCSV} title="Export CSV"><Download size={16} /></button>
                    <button className="btn-icon" onClick={fetchData} title="Refresh"><RefreshCw size={16} /></button>
                    <button className="btn btn-primary btn-sm" onClick={() => { setEditing(null); setModalOpen(true); }}>
                        <Plus size={16} /> Add
                    </button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
            />

            <CrudModal
                open={modalOpen}
                onClose={() => { setModalOpen(false); setEditing(null); }}
                onSubmit={handleSubmit}
                title={editing ? `Edit ${title}` : `New ${title}`}
                fields={fields}
                initialData={editing}
            />

            <ConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDeleteConfirm}
                title={`Delete ${title}`}
                message={`Are you sure you want to delete this ${title.toLowerCase()} record? This action cannot be undone.`}
            />
        </motion.div>
    );
}
