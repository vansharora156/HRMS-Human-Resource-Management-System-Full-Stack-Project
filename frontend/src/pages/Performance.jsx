import { useState } from 'react';
import { motion } from 'framer-motion';
import CrudPage from '../components/CrudPage';

const tabs = [
    {
        label: 'Cycles', table: 'performance-cycles', pk: 'cycle_id',
        columns: [
            { key: 'cycle_id', label: 'ID' },
            { key: 'year', label: 'Year' },
        ],
        fields: [
            { key: 'year', label: 'Year', type: 'number', required: true },
        ],
    },
    {
        label: 'Goals', table: 'goals', pk: 'goal_id',
        columns: [
            { key: 'goal_id', label: 'ID' },
            { key: 'emp_id', label: 'Emp ID' },
            { key: 'description', label: 'Description' },
        ],
        fields: [
            { key: 'emp_id', label: 'Employee ID', type: 'number', required: true },
            { key: 'description', label: 'Goal Description', required: true },
        ],
    },
    {
        label: 'Reviews', table: 'reviews', pk: 'review_id',
        columns: [
            { key: 'review_id', label: 'ID' },
            { key: 'emp_id', label: 'Emp ID' },
            { key: 'cycle_id', label: 'Cycle ID' },
        ],
        fields: [
            { key: 'emp_id', label: 'Employee ID', type: 'number', required: true },
            { key: 'cycle_id', label: 'Cycle ID', type: 'number', required: true },
        ],
    },
    {
        label: 'Ratings', table: 'ratings', pk: 'rating_id',
        columns: [
            { key: 'rating_id', label: 'ID' },
            { key: 'review_id', label: 'Review ID' },
            { key: 'score', label: 'Score' },
        ],
        fields: [
            { key: 'review_id', label: 'Review ID', type: 'number', required: true },
            { key: 'score', label: 'Score (1-5)', type: 'number', required: true },
        ],
    },
    {
        label: 'Feedback', table: 'feedback', pk: 'feedback_id',
        columns: [
            { key: 'feedback_id', label: 'ID' },
            { key: 'from_emp', label: 'From' },
            { key: 'to_emp', label: 'To' },
            { key: 'comments', label: 'Comments' },
        ],
        fields: [
            { key: 'from_emp', label: 'From Employee ID', type: 'number', required: true },
            { key: 'to_emp', label: 'To Employee ID', type: 'number', required: true },
            { key: 'comments', label: 'Comments', required: true },
        ],
    },
];

export default function Performance() {
    const [active, setActive] = useState(0);
    const t = tabs[active];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="page-header">
                <div>
                    <h1>Performance</h1>
                    <p>Goals, reviews, ratings, and 360° feedback</p>
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
