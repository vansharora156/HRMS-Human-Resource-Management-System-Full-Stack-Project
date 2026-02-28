import { motion } from 'framer-motion';
import './StatCard.css';

export default function StatCard({ icon: Icon, label, value, color = 'accent', delay = 0 }) {
    const colorMap = {
        accent: 'var(--accent-start)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        info: 'var(--info)',
    };

    return (
        <motion.div
            className="stat-card glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
        >
            <div className="stat-icon" style={{ color: colorMap[color], background: `${colorMap[color]}15` }}>
                <Icon size={22} />
            </div>
            <div className="stat-info">
                <span className="stat-value">{value}</span>
                <span className="stat-label">{label}</span>
            </div>
            <div className="stat-glow" style={{ background: colorMap[color] }} />
        </motion.div>
    );
}
