import './Skeleton.css';

export default function Skeleton({ rows = 5, cols = 4 }) {
    return (
        <div className="skeleton-table">
            <div className="skeleton-header">
                {Array.from({ length: cols }).map((_, i) => (
                    <div key={i} className="skeleton-cell skeleton-pulse" style={{ width: `${60 + Math.random() * 80}px` }} />
                ))}
            </div>
            {Array.from({ length: rows }).map((_, r) => (
                <div key={r} className="skeleton-row" style={{ animationDelay: `${r * 0.08}s` }}>
                    {Array.from({ length: cols }).map((_, c) => (
                        <div key={c} className="skeleton-cell skeleton-pulse" style={{ width: `${40 + Math.random() * 100}px` }} />
                    ))}
                </div>
            ))}
        </div>
    );
}
