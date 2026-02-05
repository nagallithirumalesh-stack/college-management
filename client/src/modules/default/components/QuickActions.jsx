import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Calendar, Rocket, QrCode } from 'lucide-react';

const QuickActions = () => {
    const navigate = useNavigate();

    const actions = [
        { label: 'Scan Presence', icon: QrCode, path: '/student/scan', color: 'from-indigo-500 to-purple-500' },
        { label: 'My Journal', icon: Calendar, path: '/student/journal', color: 'from-blue-500 to-cyan-500' },
        { label: 'Resources', icon: Rocket, path: '/student/resources', color: 'from-pink-500 to-rose-500' },
        { label: 'Apply Leave', icon: FileText, path: '/student/leave', color: 'from-orange-500 to-amber-500' },
    ];

    // Return buttons only — the parent Slot/grid will handle layout
    return (
        <>
            {actions.map((action, idx) => (
                <button
                    key={idx}
                    onClick={() => navigate(action.path)}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/50 border border-slate-200 shadow-sm hover:shadow-md transition-all group text-center"
                >
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-3 shadow-md`}> 
                        <action.icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm text-headings block">{action.label}</span>
                    <span className="text-xs text-muted">Click to open</span>
                </button>
            ))}
        </>
    );
};

export default QuickActions;
