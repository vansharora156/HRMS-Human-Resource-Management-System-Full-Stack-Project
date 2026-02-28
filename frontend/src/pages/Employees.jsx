import { useState } from 'react';
import { motion } from 'framer-motion';
import CrudPage from '../components/CrudPage';

const statusBadge = (val) => {
    const cls = val === 'ACTIVE' ? 'badge badge-success' : 'badge badge-warning';
    return <span className={cls}>{val || '—'}</span>;
};

const tabs = [
    {
        label: 'Employees', table: 'employees', pk: 'emp_id',
        columns: [
            { key: 'emp_id', label: 'ID' },
            { key: 'company_id', label: 'Company' },
            { key: 'dept_id', label: 'Department' },
            { key: 'designation_id', label: 'Designation' },
            { key: 'join_date', label: 'Join Date' },
            { key: 'status', label: 'Status', render: statusBadge },
        ],
        fields: [
            { key: 'company_id', label: 'Company ID', type: 'number', required: true },
            { key: 'dept_id', label: 'Department ID', type: 'number', required: true },
            { key: 'designation_id', label: 'Designation ID', type: 'number' },
            { key: 'emp_type_id', label: 'Employment Type ID', type: 'number' },
            { key: 'manager_id', label: 'Manager ID', type: 'number' },
            { key: 'join_date', label: 'Join Date', type: 'date' },
            { key: 'status', label: 'Status', placeholder: 'ACTIVE / INACTIVE' },
        ],
    },
    {
        label: 'Personal Details', table: 'employee-personal-details', pk: 'emp_id',
        columns: [
            { key: 'emp_id', label: 'Emp ID' },
            { key: 'dob', label: 'Date of Birth' },
            { key: 'gender', label: 'Gender' },
            { key: 'marital_status', label: 'Marital Status' },
        ],
        fields: [
            { key: 'emp_id', label: 'Employee ID', type: 'number', required: true },
            { key: 'dob', label: 'Date of Birth', type: 'date' },
            { key: 'gender', label: 'Gender' },
            { key: 'marital_status', label: 'Marital Status' },
        ],
    },
    {
        label: 'Contacts', table: 'employee-contacts', pk: 'contact_id',
        columns: [
            { key: 'contact_id', label: 'ID' },
            { key: 'emp_id', label: 'Emp ID' },
            { key: 'phone', label: 'Phone' },
            { key: 'email', label: 'Email' },
        ],
        fields: [
            { key: 'emp_id', label: 'Employee ID', type: 'number', required: true },
            { key: 'phone', label: 'Phone' },
            { key: 'email', label: 'Email', type: 'email' },
        ],
    },
    {
        label: 'Addresses', table: 'employee-addresses', pk: 'address_id',
        columns: [
            { key: 'address_id', label: 'ID' },
            { key: 'emp_id', label: 'Emp ID' },
            { key: 'address_type', label: 'Type' },
            { key: 'address', label: 'Address' },
        ],
        fields: [
            { key: 'emp_id', label: 'Employee ID', type: 'number', required: true },
            { key: 'address_type', label: 'Address Type', placeholder: 'HOME / OFFICE' },
            { key: 'address', label: 'Address' },
        ],
    },
    {
        label: 'Documents', table: 'employee-documents', pk: 'doc_id',
        columns: [
            { key: 'doc_id', label: 'ID' },
            { key: 'emp_id', label: 'Emp ID' },
            { key: 'doc_type', label: 'Doc Type' },
            { key: 'file_path', label: 'File Path' },
        ],
        fields: [
            { key: 'emp_id', label: 'Employee ID', type: 'number', required: true },
            { key: 'doc_type', label: 'Document Type' },
            { key: 'file_path', label: 'File Path' },
        ],
    },
    {
        label: 'Bank Details', table: 'employee-bank-details', pk: 'bank_id',
        columns: [
            { key: 'bank_id', label: 'ID' },
            { key: 'emp_id', label: 'Emp ID' },
            { key: 'account_no', label: 'Account No' },
            { key: 'ifsc', label: 'IFSC' },
        ],
        fields: [
            { key: 'emp_id', label: 'Employee ID', type: 'number', required: true },
            { key: 'account_no', label: 'Account Number' },
            { key: 'ifsc', label: 'IFSC Code' },
        ],
    },
    {
        label: 'Salary Structure', table: 'employee-salary-structure', pk: 'salary_id',
        columns: [
            { key: 'salary_id', label: 'ID' },
            { key: 'emp_id', label: 'Emp ID' },
            { key: 'basic', label: 'Basic' },
            { key: 'hra', label: 'HRA' },
            { key: 'allowances', label: 'Allowances' },
        ],
        fields: [
            { key: 'emp_id', label: 'Employee ID', type: 'number', required: true },
            { key: 'basic', label: 'Basic', type: 'number' },
            { key: 'hra', label: 'HRA', type: 'number' },
            { key: 'allowances', label: 'Allowances', type: 'number' },
        ],
    },
    {
        label: 'Status History', table: 'employee-status-history', pk: 'status_id',
        columns: [
            { key: 'status_id', label: 'ID' },
            { key: 'emp_id', label: 'Emp ID' },
            { key: 'status', label: 'Status', render: statusBadge },
            { key: 'changed_at', label: 'Changed At' },
        ],
        fields: [
            { key: 'emp_id', label: 'Employee ID', type: 'number', required: true },
            { key: 'status', label: 'Status' },
        ],
    },
];

export default function Employees() {
    const [active, setActive] = useState(0);
    const t = tabs[active];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="page-header">
                <div>
                    <h1>Employees</h1>
                    <p>Manage employee records, contacts, documents, and more</p>
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
