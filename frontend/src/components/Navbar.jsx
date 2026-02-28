import { Bell, Search, ChevronDown, Calendar, Command } from 'lucide-react';

const Navbar = ({ title }) => {
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-20 backdrop-blur-sm transition-all">
            <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-2">
                    <Calendar size={12} /> {currentDate}
                </p>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative group hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-12 py-2.5 bg-white/60 border border-slate-200/60 rounded-full text-sm w-64 focus:w-80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm backdrop-blur-sm"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-[10px] text-slate-400 font-medium">
                        <Command size={10} /> K
                    </div>
                </div>

                <div className="flex items-center gap-3 pl-2">
                    <button className="relative p-2.5 text-slate-500 hover:bg-white/80 hover:text-indigo-600 rounded-full transition-all hover:shadow-md border border-transparent hover:border-white active:scale-95 group">
                        <Bell size={20} />
                        <span className="absolute top-2.5 right-3 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white/80 animate-pulse"></span>
                    </button>

                    <div className="w-px h-8 bg-slate-200 mx-2"></div>

                    <div className="flex items-center gap-3 cursor-pointer group p-1 pr-3 rounded-full hover:bg-white/60 hover:shadow-sm border border-transparent hover:border-white/50 transition-all active:scale-[0.98]">
                        <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt="Admin"
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
                        />
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Alex Morgan</p>
                            <p className="text-[10px] text-slate-500 font-medium">Administrator</p>
                        </div>
                        <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors ml-1" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
