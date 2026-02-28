import { useState } from 'react';
import { motion } from 'framer-motion';
import CrudPage from '../components/CrudPage';

const statusBadge = (val) => {
    const map = { APPROVED: 'success', PENDING: 'warning', REJECTED: 'error' };
    return <span className={`badge badge-${map[val] || 'info'}`}>{val || '—'}</span>;
};

const tabs = [
    {
        label: 'Attendance', table: 'attendance', pk: 'attendance_id',
        columns: [
            { key: 'attendance_id', label: 'ID' },
            { key: 'emp_id', label: 'Emp ID' },
            { key: 'attendance_date', label: 'Date' },
            { key: 'check_in', label: 'Check In' },
            { key: 'check_out', label: 'Check Out' },
        ],
        fields: [
            { key: 'emp_id', label: 'Employee ID', type: 'number', required: true },
            { key: 'attendance_date', label: 'Date', type: 'date', required: true },
            { key: 'check_in', label: 'Check In', type: 'datetime-local' },
            { key: 'check_out', label: 'Check Out', type: 'datetime-local' },
        ],
    },
    {
        label: 'Logs', table: 'attendance-logs', pk: 'log_id',
        columns: [
            { key: 'log_id', label: 'ID' },
            { key: 'emp_id', label: 'Emp ID' },
            { key: 'log_time', label: 'Log Time' },
        ],
        fields: [
            { key: 'emp_id', label: 'Employee ID', type: 'number', required: true },
            { key: 'log_time', label: 'Log Time', type: 'datetime-local' },
        ],
    },
    {
        label: 'Leave Types', table: 'leave-types', pk: 'leave_type_id',
        columns: [
            { key: 'leave_type_id', label: 'ID' },
            { key: 'name', label: 'Name' },
        ],
        fields: [
            { key: 'name', label: 'Leave Type Name', required: true },
        ],
    },
    {
        label: 'Leave Balances', table: 'leave-balances', pk: 'balance_id',
        columns: [
            { key: 'balance_id', label: 'ID' },
            { key: 'emp_id', label: 'Emp ID' },
            { key: 'leave_type_id', label: 'Leave Type' },
            { key: 'balance', label: 'Balance' },
        ],
        fields: [
            { key: 'emp_id', label: 'Employee ID', type: 'number', required: true },
            { key: 'leave_type_id', label: 'Leave Type ID', type: 'number', required: true },
            { key: 'balance', label: 'Balance', type: 'number' },
        ],
    },
    {
        label: 'Leave Requests', table: 'leave-requests', pk: 'request_id',
        columns: [
            { key: 'request_id', label: 'ID' },
            { key: 'emp_id', label: 'Emp ID' },
            { key: 'leave_type_id', label: 'Leave Type' },
            { key: 'from_date', label: 'From' },
            { key: 'to_date', label: 'To' },
            { key: 'status', label: 'Status', render: statusBadge },
        ],
        fields: [
            { key: 'emp_id', label: 'Employee ID', type: 'number', required: true },
            { key: 'leave_type_id', label: 'Leave Type ID', type: 'number', required: true },
            { key: 'from_date', label: 'From Date', type: 'date' },
            { key: 'to_date', label: 'To Date', type: 'date' },
            { key: 'status', label: 'Status', placeholder: 'PENDING / APPROVED / REJECTED' },
        ],
    },
    {
        label: 'Leave Approvals', table: 'leave-approvals', pk: 'approval_id',
        columns: [
            { key: 'approval_id', label: 'ID' },
            { key: 'request_id', label: 'Request ID' },
            { key: 'manager_id', label: 'Manager ID' },
            { key: 'approved_at', label: 'Approved At' },
        ],
        fields: [
            { key: 'request_id', label: 'Request ID', type: 'number', required: true },
            { key: 'manager_id', label: 'Manager ID', type: 'number' },
        ],
    },
    {
        label: 'Holidays', table: 'holidays', pk: 'holiday_id',
        columns: [
            { key: 'holiday_id', label: 'ID' },
            { key: 'company_id', label: 'Company' },
            { key: 'holiday_date', label: 'Date' },
            { key: 'name', label: 'Holiday' },
        ],
        fields: [
            { key: 'company_id', label: 'Company ID', type: 'number', required: true },
            { key: 'holiday_date', label: 'Date', type: 'date', required: true },
            { key: 'name', label: 'Holiday Name', required: true },
        ],
    },
];

export default function Attendance() {
    const [active, setActive] = useState(0);
    const t = tabs[active];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="page-header">
                <div>
                    <h1>Attendance & Leave</h1>
                    <p>Track attendance, manage leave requests and holidays</p>
                </div>
            </div>

            <div className="tabs">
                {tabs.map((tab, i) => (
                    <button key={i} className={`tab ${active === i ? 'active' : ''}`} onClick={() => setActive(i)}>
                        {tab.label}
                    </button>
                ))}
            </div>

            <CrudPage key={t.table} table={t.table} pk={t.pk} title={t.label} columns={t.columns} fields={t.fields} />
        </motion.div>
    );
}
