import { useState } from 'react';
import { motion } from 'framer-motion';
import CrudPage from '../components/CrudPage';

const tabs = [
    {
        label: 'Companies', table: 'companies', pk: 'company_id',
        columns: [
            { key: 'company_id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'registration_no', label: 'Reg No.' },
            { key: 'timezone', label: 'Timezone' },
        ],
        fields: [
            { key: 'name', label: 'Company Name', required: true },
            { key: 'registration_no', label: 'Registration No.' },
            { key: 'timezone', label: 'Timezone', placeholder: 'e.g. Asia/Kolkata' },
        ],
    },
    {
        label: 'Branches', table: 'branches', pk: 'branch_id',
        columns: [
            { key: 'branch_id', label: 'ID' },
            { key: 'company_id', label: 'Company ID' },
            { key: 'name', label: 'Branch Name' },
            { key: 'location', label: 'Location' },
        ],
        fields: [
            { key: 'company_id', label: 'Company ID', type: 'number', required: true },
            { key: 'name', label: 'Branch Name', required: true },
            { key: 'location', label: 'Location' },
        ],
    },
    {
        label: 'Departments', table: 'departments', pk: 'dept_id',
        columns: [
            { key: 'dept_id', label: 'ID' },
            { key: 'branch_id', label: 'Branch ID' },
            { key: 'name', label: 'Department' },
        ],
        fields: [
            { key: 'branch_id', label: 'Branch ID', type: 'number', required: true },
            { key: 'name', label: 'Department Name', required: true },
        ],
    },
    {
        label: 'Designations', table: 'designations', pk: 'designation_id',
        columns: [
            { key: 'designation_id', label: 'ID' },
            { key: 'title', label: 'Title' },
            { key: 'level', label: 'Level' },
            { key: 'grade', label: 'Grade' },
        ],
        fields: [
            { key: 'title', label: 'Title', required: true },
            { key: 'level', label: 'Level', type: 'number' },
            { key: 'grade', label: 'Grade' },
        ],
    },
    {
        label: 'Employment Types', table: 'employment-types', pk: 'emp_type_id',
        columns: [
            { key: 'emp_type_id', label: 'ID' },
            { key: 'type_name', label: 'Type Name' },
        ],
        fields: [
            { key: 'type_name', label: 'Type Name', required: true },
        ],
    },
    {
        label: 'Work Locations', table: 'work-locations', pk: 'location_id',
        columns: [
            { key: 'location_id', label: 'ID' },
            { key: 'location_type', label: 'Location Type' },
        ],
        fields: [
            { key: 'location_type', label: 'Location Type', required: true },
        ],
    },
    {
        label: 'Shifts', table: 'shifts', pk: 'shift_id',
        columns: [
            { key: 'shift_id', label: 'ID' },
            { key: 'start_time', label: 'Start Time' },
            { key: 'end_time', label: 'End Time' },
        ],
        fields: [
            { key: 'start_time', label: 'Start Time', type: 'time', required: true },
            { key: 'end_time', label: 'End Time', type: 'time', required: true },
        ],
    },
];

export default function Organization() {
    const [active, setActive] = useState(0);
    const t = tabs[active];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="page-header">
                <div>
                    <h1>Organization</h1>
                    <p>Manage companies, branches, departments, and more</p>
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
