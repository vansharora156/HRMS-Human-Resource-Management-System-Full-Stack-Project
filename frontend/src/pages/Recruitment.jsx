import { useState } from 'react';
import { motion } from 'framer-motion';
import CrudPage from '../components/CrudPage';

const statusBadge = (val) => {
    const map = { HIRED: 'success', OFFERED: 'info', REJECTED: 'error', APPLIED: 'warning', ACCEPTED: 'success' };
    return <span className={`badge badge-${map[val] || 'info'}`}>{val || '—'}</span>;
};

const tabs = [
    {
        label: 'Job Openings', table: 'job-openings', pk: 'job_id',
        columns: [
            { key: 'job_id', label: 'ID' },
            { key: 'dept_id', label: 'Dept ID' },
            { key: 'title', label: 'Title' },
        ],
        fields: [
            { key: 'dept_id', label: 'Department ID', type: 'number', required: true },
            { key: 'title', label: 'Job Title', required: true },
        ],
    },
    {
        label: 'Candidates', table: 'candidates', pk: 'candidate_id',
        columns: [
            { key: 'candidate_id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
        ],
        fields: [
            { key: 'name', label: 'Candidate Name', required: true },
            { key: 'email', label: 'Email', type: 'email' },
        ],
    },
    {
        label: 'Applications', table: 'applications', pk: 'application_id',
        columns: [
            { key: 'application_id', label: 'ID' },
            { key: 'candidate_id', label: 'Candidate' },
            { key: 'job_id', label: 'Job ID' },
            { key: 'status', label: 'Status', render: statusBadge },
        ],
        fields: [
            { key: 'candidate_id', label: 'Candidate ID', type: 'number', required: true },
            { key: 'job_id', label: 'Job ID', type: 'number', required: true },
            { key: 'status', label: 'Status', placeholder: 'APPLIED / HIRED / REJECTED' },
        ],
    },
    {
        label: 'Interviews', table: 'interviews', pk: 'interview_id',
        columns: [
            { key: 'interview_id', label: 'ID' },
            { key: 'application_id', label: 'Application' },
            { key: 'interview_date', label: 'Date' },
            { key: 'result', label: 'Result', render: statusBadge },
        ],
        fields: [
            { key: 'application_id', label: 'Application ID', type: 'number', required: true },
            { key: 'interview_date', label: 'Date & Time', type: 'datetime-local' },
            { key: 'result', label: 'Result', placeholder: 'PASS / FAIL / PENDING' },
        ],
    },
    {
        label: 'Offers', table: 'offers', pk: 'offer_id',
        columns: [
            { key: 'offer_id', label: 'ID' },
            { key: 'application_id', label: 'Application' },
            { key: 'salary', label: 'Salary' },
            { key: 'status', label: 'Status', render: statusBadge },
        ],
        fields: [
            { key: 'application_id', label: 'Application ID', type: 'number', required: true },
            { key: 'salary', label: 'Salary', type: 'number' },
            { key: 'status', label: 'Status', placeholder: 'OFFERED / ACCEPTED / REJECTED' },
        ],
    },
];

export default function Recruitment() {
    const [active, setActive] = useState(0);
    const t = tabs[active];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="page-header">
                <div>
                    <h1>Recruitment</h1>
                    <p>Job openings, candidates, applications, interviews, and offers</p>
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
