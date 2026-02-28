import { cn } from '../../utils/cn';

const Badge = ({ children, className, variant = 'default', ...props }) => {
    const variants = {
        default: "bg-slate-100 text-slate-700 ring-slate-600/20",
        success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
        warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
        error: "bg-rose-50 text-rose-700 ring-rose-600/20",
        info: "bg-blue-50 text-blue-700 ring-blue-700/10",
        purple: "bg-violet-50 text-violet-700 ring-violet-700/10",
        gray: "bg-slate-50 text-slate-600 ring-slate-500/10",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset",
                variants[variant] || variants.default,
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;
