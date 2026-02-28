import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Tabs = ({ tabs, activeTab, onChange }) => {
    return (
        <div className="flex border-b border-slate-200">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={cn(
                        "relative px-6 py-3 text-sm font-medium transition-colors outline-none",
                        activeTab === tab.id ? "text-indigo-600" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50/50 rounded-t-lg"
                    )}
                >
                    {tab.label}
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                        />
                    )}
                </button>
            ))}
        </div>
    );
};

export default Tabs;
