import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

const Button = ({ children, className, variant = 'primary', size = 'md', icon: Icon, ...props }) => {
    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 border border-transparent",
        gradient: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/30 border border-transparent",
        secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm",
        danger: "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200/50 hover:border-rose-200",
        destruct: "bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-500/30",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        outline: "bg-transparent border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
        icon: "p-2",
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={cn(
                "inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none gap-2",
                variants[variant] || variants.primary,
                sizes[size],
                className
            )}
            {...props}
        >
            {Icon && <Icon size={size === 'sm' ? 14 : 18} />}
            {children}
        </motion.button>
    );
};

export default Button;
