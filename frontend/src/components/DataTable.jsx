import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronUp, ChevronDown, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import './DataTable.css';

const PAGE_SIZE = 10;

export default function DataTable({ columns, data, onEdit, onDelete, loading }) {
    const [search, setSearch] = useState('');
    const [sortCol, setSortCol] = useState(null);
    const [sortDir, setSortDir] = useState('asc');
    const [page, setPage] = useState(0);

    const filtered = useMemo(() => {
        if (!search) return data;
        const q = search.toLowerCase();
        return data.filter(row =>
            columns.some(c => String(row[c.key] ?? '').toLowerCase().includes(q))
        );
    }, [data, search, columns]);

    const sorted = useMemo(() => {
        if (!sortCol) return filtered;
        return [...filtered].sort((a, b) => {
            const va = a[sortCol] ?? '';
            const vb = b[sortCol] ?? '';
            if (va < vb) return sortDir === 'asc' ? -1 : 1;
            if (va > vb) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filtered, sortCol, sortDir]);

    const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
    const pageData = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    const handleSort = (key) => {
        if (sortCol === key) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortCol(key);
            setSortDir('asc');
        }
    };

    return (
        <div className="data-table-wrap glass-card">
            {/* Search bar */}
            <div className="dt-toolbar">
                <div className="dt-search">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search…"
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(0); }}
                    />
                </div>
                <span className="dt-count">{filtered.length} records</span>
            </div>

            {/* Table */}
            <div className="dt-scroll">
                <table className="dt-table">
                    <thead>
                        <tr>
                            {columns.map(c => (
                                <th key={c.key} onClick={() => handleSort(c.key)}>
                                    <span>{c.label}</span>
                                    {sortCol === c.key && (
                                        sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                    )}
                                </th>
                            ))}
                            {(onEdit || onDelete) && <th style={{ width: 100 }}>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={columns.length + 1} className="dt-loading">Loading…</td></tr>
                        ) : pageData.length === 0 ? (
                            <tr><td colSpan={columns.length + 1} className="dt-empty">No data found</td></tr>
                        ) : (
                            <AnimatePresence>
                                {pageData.map((row, i) => (
                                    <motion.tr
                                        key={row[columns[0]?.key] ?? i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.15, delay: i * 0.02 }}
                                    >
                                        {columns.map(c => (
                                            <td key={c.key}>
                                                {c.render ? c.render(row[c.key], row) : row[c.key] ?? '—'}
                                            </td>
                                        ))}
                                        {(onEdit || onDelete) && (
                                            <td>
                                                <div className="dt-actions">
                                                    {onEdit && (
                                                        <button className="btn-icon" onClick={() => onEdit(row)} title="Edit">
                                                            <Edit2 size={14} />
                                                        </button>
                                                    )}
                                                    {onDelete && (
                                                        <button className="btn-icon dt-del" onClick={() => onDelete(row)} title="Delete">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="dt-pagination">
                    <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                        <ChevronLeft size={16} />
                    </button>
                    <span>{page + 1} / {totalPages}</span>
                    <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
