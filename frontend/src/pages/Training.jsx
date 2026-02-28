import { useState } from 'react';
import { motion } from 'framer-motion';
import CrudPage from '../components/CrudPage';

const tabs = [
    {
        label: 'Training Programs', table: 'training-programs', pk: 'training_id',
        columns: [
            { key: 'training_id', label: 'ID' },
            { key: 'title', label: 'Program Title' },
        ],
        fields: [
            { key: 'title', label: 'Program Title', required: true },
        ],
    },
    {
        label: 'Enrollments', table: 'enrollments', pk: 'enrollment_id',
        columns: [
            { key: 'enrollment_id', label: 'ID' },
            { key: 'emp_id', label: 'Emp ID' },
            { key: 'training_id', label: 'Training ID' },
        ],
        fields: [
            { key: 'emp_id', label: 'Employee ID', type: 'number', required: true },
            { key: 'training_id', label: 'Training ID', type: 'number', required: true },
        ],
    },
    {
        label: 'Certifications', table: 'certifications', pk: 'cert_id',
        columns: [
            { key: 'cert_id', label: 'ID' },
            { key: 'emp_id', label: 'Emp ID' },
            { key: 'name', label: 'Certification' },
        ],
        fields: [
            { key: 'emp_id', label: 'Employee ID', type: 'number', required: true },
            { key: 'name', label: 'Certification Name', required: true },
        ],
    },
    {
        label: 'Assets', table: 'assets', pk: 'asset_id',
        columns: [
            { key: 'asset_id', label: 'ID' },
            { key: 'name', label: 'Asset Name' },
        ],
        fields: [
            { key: 'name', label: 'Asset Name', required: true },
        ],
    },
    {
        label: 'Asset Allocations', table: 'asset-allocations', pk: 'allocation_id',
        columns: [
            { key: 'allocation_id', label: 'ID' },
            { key: 'emp_id', label: 'Emp ID' },
            { key: 'asset_id', label: 'Asset ID' },
            { key: 'allocated_at', label: 'Allocated At' },
        ],
        fields: [
            { key: 'emp_id', label: 'Employee ID', type: 'number', required: true },
            { key: 'asset_id', label: 'Asset ID', type: 'number', required: true },
        ],
    },
    {
        label: 'System Roles', table: 'system-roles', pk: 'role_id',
        columns: [
            { key: 'role_id', label: 'ID' },
            { key: 'role_name', label: 'Role Name' },
        ],
        fields: [
            { key: 'role_name', label: 'Role Name', required: true },
        ],
    },
    {
        label: 'Permissions', table: 'permissions', pk: 'permission_id',
        columns: [
            { key: 'permission_id', label: 'ID' },
            { key: 'permission_name', label: 'Permission' },
        ],
        fields: [
            { key: 'permission_name', label: 'Permission Name', required: true },
        ],
    },
    {
        label: 'Role Permissions', table: 'role-permissions', pk: 'role_id',
        columns: [
            { key: 'role_id', label: 'Role ID' },
            { key: 'permission_id', label: 'Permission ID' },
        ],
        fields: [
            { key: 'role_id', label: 'Role ID', type: 'number', required: true },
            { key: 'permission_id', label: 'Permission ID', type: 'number', required: true },
        ],
    },
    {
        label: 'User Accounts', table: 'user-accounts', pk: 'user_id',
        columns: [
            { key: 'user_id', label: 'ID' },
            { key: 'emp_id', label: 'Emp ID' },
            { key: 'role_id', label: 'Role ID' },
            { key: 'username', label: 'Username' },
        ],
        fields: [
            { key: 'emp_id', label: 'Employee ID', type: 'number', required: true },
            { key: 'role_id', label: 'Role ID', type: 'number' },
            { key: 'username', label: 'Username', required: true },
            { key: 'password_hash', label: 'Password Hash' },
        ],
    },
];

export default function Training() {
    const [active, setActive] = useState(0);
    const t = tabs[active];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="page-header">
                <div>
                    <h1>Training & Access</h1>
                    <p>Training programs, assets, roles, permissions, and user accounts</p>
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
