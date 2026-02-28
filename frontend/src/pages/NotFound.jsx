import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Ghost, ArrowLeft } from 'lucide-react';
import './NotFound.css';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <motion.div
            className="not-found"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="nf-icon"><Ghost size={64} /></div>
            <h1>404</h1>
            <p>Oops! The page you're looking for doesn't exist.</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
                <ArrowLeft size={16} /> Back to Dashboard
            </button>
        </motion.div>
    );
}
