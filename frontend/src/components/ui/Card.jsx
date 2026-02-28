import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Card = ({ children, className, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

const CardHeader = ({ children, className }) => (
    <div className={cn("px-6 py-4 border-b border-slate-50", className)}>
        {children}
    </div>
);

const CardTitle = ({ children, className }) => (
    <h3 className={cn("text-lg font-semibold text-slate-800", className)}>
        {children}
    </h3>
);

const CardContent = ({ children, className }) => (
    <div className={cn("p-6", className)}>
        {children}
    </div>
);

export { Card, CardHeader, CardTitle, CardContent };
