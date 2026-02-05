import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp, Trophy } from 'lucide-react';
import eventBus from '../../../core/EventBus';

const XPWidget = ({ context }) => {
    const [xp, setXp] = useState(1250);
    const [level, setLevel] = useState(5);
    const [progress, setProgress] = useState(65);

    useEffect(() => {
        // Listen for live attendance events
        const handleScanSuccess = (data) => {
            setXp(prev => prev + 50);
            // Show animation/toast here in future
            console.log("XP Gained!", data);
        };

        const unsubscribe = eventBus.on('attendance.scan.success', handleScanSuccess);
        // return () => unsubscribe(); // EventBus needs unlisten support, simplified for now
    }, []);

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 rounded-3xl border border-white/20 shadow-xl relative overflow-hidden h-full flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-300">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>

            <div className="flex justify-between items-start relative z-10">
                <div>
                    <h3 className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1 flex items-center">
                        <Zap className="w-3 h-3 mr-1 text-yellow-400" /> Current Level
                    </h3>
                    <div className="text-4xl font-black">{level}</div>
                    <p className="text-indigo-200 text-xs mt-1">Voyager</p>
                </div>
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/10">
                    <Trophy className="w-6 h-6 text-yellow-300" />
                </div>
            </div>

            <div className="mt-6 relative z-10">
                <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-indigo-200">{xp} XP</span>
                    <span className="text-white">Next: 2000 XP</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)] transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="mt-3 flex items-center text-xs text-indigo-100 bg-white/10 py-1.5 px-3 rounded-lg">
                    <TrendingUp className="w-3 h-3 mr-2 text-green-400" />
                    <span>Top 5% of class this week!</span>
                </div>
            </div>
        </div>
    );
};

export default XPWidget;
