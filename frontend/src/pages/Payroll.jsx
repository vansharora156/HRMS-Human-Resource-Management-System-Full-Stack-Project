import { useState } from 'react';
import { motion } from 'framer-motion';
import CrudPage from '../components/CrudPage';

const tabs = [
    {
        label: 'Payroll Cycles', table: 'payroll-cycles', pk: 'cycle_id',
        columns: [
            { key: 'cycle_id', label: 'ID' },
            { key: 'month', label: 'Month' },
            { key: 'year', label: 'Year' },
        ],
        fields: [
            { key: 'month', label: 'Month', type: 'number', required: true },
            { key: 'year', label: 'Year', type: 'number', required: true },
        ],
    },
    {
        label: 'Payroll Runs', table: 'payroll-runs', pk: 'run_id',
        columns: [
            { key: 'run_id', label: 'ID' },
            { key: 'cycle_id', label: 'Cycle ID' },
            { key: 'processed_at', label: 'Processed At' },
        ],
        fields: [
            { key: 'cycle_id', label: 'Cycle ID', type: 'number', required: true },
        ],
    },
    {
        label: 'Payslips', table: 'payslips', pk: 'payslip_id',
        columns: [
            { key: 'payslip_id', label: 'ID' },
            { key: 'emp_id', label: 'Emp ID' },
            { key: 'run_id', label: 'Run ID' },
        ],
        fields: [
            { key: 'emp_id', label: 'Employee ID', type: 'number', required: true },
            { key: 'run_id', label: 'Run ID', type: 'number', required: true },
        ],
    },
    {
        label: 'Salary Components', table: 'salary-components', pk: 'component_id',
        columns: [
            { key: 'component_id', label: 'ID' },
            { key: 'name', label: 'Component' },
            { key: 'type', label: 'Type' },
        ],
        fields: [
            { key: 'name', label: 'Component Name', required: true },
            { key: 'type', label: 'Type', placeholder: 'EARNING / DEDUCTION' },
        ],
    },
    {
        label: 'Payroll Details', table: 'payroll-details', pk: 'detail_id',
        columns: [
            { key: 'detail_id', label: 'ID' },
            { key: 'payslip_id', label: 'Payslip ID' },
            { key: 'component_id', label: 'Component' },
            { key: 'amount', label: 'Amount' },
        ],
        fields: [
            { key: 'payslip_id', label: 'Payslip ID', type: 'number', required: true },
            { key: 'component_id', label: 'Component ID', type: 'number', required: true },
            { key: 'amount', label: 'Amount', type: 'number' },
        ],
    },
    {
        label: 'Bonuses', table: 'bonuses', pk: 'bonus_id',
        columns: [
            { key: 'bonus_id', label: 'ID' },
            { key: 'emp_id', label: 'Emp ID' },
            { key: 'amount', label: 'Amount' },
            { key: 'bonus_date', label: 'Date' },
        ],
        fields: [
            { key: 'emp_id', label: 'Employee ID', type: 'number', required: true },
            { key: 'amount', label: 'Amount', type: 'number' },
            { key: 'bonus_date', label: 'Date', type: 'date' },
        ],
    },
    {
        label: 'Reimbursements', table: 'reimbursements', pk: 'reimb_id',
        columns: [
            { key: 'reimb_id', label: 'ID' },
            { key: 'emp_id', label: 'Emp ID' },
            { key: 'amount', label: 'Amount' },
            { key: 'status', label: 'Status' },
        ],
        fields: [
            { key: 'emp_id', label: 'Employee ID', type: 'number', required: true },
            { key: 'amount', label: 'Amount', type: 'number' },
            { key: 'status', label: 'Status', placeholder: 'PENDING / APPROVED' },
        ],
    },
    {
        label: 'Tax Declarations', table: 'tax-declarations', pk: 'tax_id',
        columns: [
            { key: 'tax_id', label: 'ID' },
            { key: 'emp_id', label: 'Emp ID' },
            { key: 'financial_year', label: 'FY' },
        ],
        fields: [
            { key: 'emp_id', label: 'Employee ID', type: 'number', required: true },
            { key: 'financial_year', label: 'Financial Year', placeholder: '2025-26' },
        ],
    },
    {
        label: 'Tax Deductions', table: 'tax-deductions', pk: 'deduction_id',
        columns: [
            { key: 'deduction_id', label: 'ID' },
            { key: 'emp_id', label: 'Emp ID' },
            { key: 'amount', label: 'Amount' },
        ],
        fields: [
            { key: 'emp_id', label: 'Employee ID', type: 'number', required: true },
            { key: 'amount', label: 'Amount', type: 'number' },
        ],
    },
];

export default function Payroll() {
    const [active, setActive] = useState(0);
    const t = tabs[active];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="page-header">
                <div>
                    <h1>Payroll</h1>
                    <p>Payroll cycles, payslips, bonuses, reimbursements, and taxes</p>
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
