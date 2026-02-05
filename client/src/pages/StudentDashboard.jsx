import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Award, Sparkles, BookOpen, Clock, AlertCircle } from 'lucide-react';

import Slot from '../components/Slot';
import ChatWidget from '../components/ChatWidget';

export default function StudentDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const getBandColor = (band) => {
        switch (band) {
            case 'Gold': return 'from-yellow-400 to-yellow-600';
            case 'Silver': return 'from-slate-300 to-slate-500';
            case 'Platinum': return 'from-indigo-400 to-purple-600';
            default: return 'from-orange-400 to-orange-600';
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">

            {/* 1. Student Identity Header (Compact & Premium) */}
            <div className="bg-surface rounded-2xl shadow-lg border border-slate-200 p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full -mr-20 -mt-20 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Student Panel</span>
                        </div>
                        <h2 className="text-3xl font-black text-headings leading-tight">
                            Welcome back, {user?.name?.split(' ')[0]}!
                        </h2>
                        <div className="flex items-center space-x-3 mt-2 text-sm text-secondary font-medium">
                            <span className="flex items-center"><BookOpen className="w-4 h-4 mr-1 text-muted" /> Sem {user?.semester || 1}</span>
                            <span>•</span>
                            <span className="flex items-center"><Clock className="w-4 h-4 mr-1 text-muted" /> {user?.section || 'Sec A'}</span>
                            <span>•</span>
                            <span className="font-mono text-xs bg-slate-100 text-secondary px-2 py-1 rounded-md">{user?.rollNo || 'ID:--'}</span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Slot name="student-header-badges" context={user} />
                        </div>
                    </div>

                    <div className={`px-6 py-4 rounded-2xl bg-gradient-to-br ${getBandColor(user?.band || 'Bronze')} text-white shadow-lg shadow-indigo-200/50 flex items-center space-x-4 transform group-hover:scale-105 transition-transform duration-300 ring-4 ring-white/30`}>
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md border border-white/20">
                            <Award className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold tracking-wider opacity-80 mb-0.5">Current Rank</p>
                            <p className="text-2xl font-black leading-none tracking-tight">{user?.band || 'Bronze'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Quick Actions (Slot) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <Slot name="student-quick-actions" context={user} />
            </div>

            {/* 3. Dashboard Widgets (Slot) - Tighter Grid */}
            <div>
                <h3 className="text-xl font-bold text-headings mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-primary" /> Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Slot name="student-dashboard-widgets" context={user} />

                    {/* Placeholder Widget for Attendance if not loaded via slot */}
                    {/* This ensures layout isn't empty if plugins fail */}

                </div>
            </div>

            <ChatWidget />
        </div>
    );
}

