import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Activity, BookOpen, Users, Calendar, Shield, Settings, LogOut,
    Megaphone, Clock, Award, CreditCard, Layout, Menu
} from 'lucide-react';
import Logo from '../Logo';

const NAV_ITEMS = {
    admin: [
        { label: 'Dashboard', path: '/admin', icon: Activity },
        { label: 'Subjects', path: '/admin/subjects', icon: BookOpen },
        { label: 'Events', path: '/admin/events', icon: Calendar },
        { label: 'Fees', path: '/admin/fees', icon: CreditCard },
        { label: 'Timetable', path: '/admin/timetable', icon: Calendar },
        { label: 'Users', path: '/admin/users', icon: Users },
        { label: 'System', path: '/admin/system', icon: Settings },
    ],
    faculty: [
        { label: 'Dashboard', path: '/faculty', icon: Layout },
        { label: 'My Classes', path: '/faculty/class', icon: Users },
        { label: 'Approvals', path: '/faculty/approvals', icon: Clock },
        { label: 'Announcements', path: '/faculty/announcements', icon: Megaphone },
        { label: 'Events', path: '/faculty/events', icon: Calendar },
        { label: 'Timetable', path: '/faculty/timetable', icon: Calendar },
    ],
    student: [
        { label: 'Dashboard', path: '/student', icon: Layout },
        { label: 'My Subjects', path: '/student/subjects', icon: BookOpen },
        { label: 'Timetable', path: '/student/timetable', icon: Calendar },
        { label: 'Fees', path: '/student/fees', icon: CreditCard },
        { label: 'Assignments', path: '/student/assignments', icon: BookOpen },
        { label: 'Profile', path: '/profile', icon: Users },
    ]
};

const Sidebar = ({ role }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const items = NAV_ITEMS[role] || [];

    // Role-based accent color (Subtle usage)
    const getAccentClass = () => {
        switch (role) {
            case 'admin': return 'text-indigo-600 bg-indigo-50';
            case 'faculty': return 'text-teal-600 bg-teal-50';
            case 'student': return 'text-indigo-600 bg-indigo-50';
            default: return 'text-indigo-600 bg-indigo-50';
        }
    };

    const accentClass = getAccentClass();

    return (
        <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col h-screen sticky top-0 font-sans">
            {/* Header */}
            <div className="p-6 flex items-center border-b border-slate-100">
                <Logo className="h-8 w-8 mr-3 text-indigo-600" />
                <div>
                    <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                        EdTrack
                    </h1>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{role} Portal</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1 mt-6 overflow-y-auto custom-scrollbar">
                {items.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-medium text-sm group ${isActive
                                ? accentClass + ' shadow-sm'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'opacity-100' : 'text-slate-400 group-hover:text-slate-600'
                                }`} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* User Profile Footer */}
            <div className="p-4 border-t border-slate-100">
                <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer mb-2">
                    <img
                        src={`https://ui-avatars.com/api/?name=${user?.name}&background=eff6ff&color=4f46e5`}
                        className="w-9 h-9 rounded-full border border-slate-200"
                        alt="Profile"
                    />
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center px-4 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all text-xs font-bold uppercase tracking-wider"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
