import React from 'react';
import { Crown, Star, Flame } from 'lucide-react';

const HeaderBadges = () => {
    return (
        <div className="flex items-center space-x-2 animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
            <div className="group relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-100 to-amber-200 border border-yellow-300 flex items-center justify-center shadow-sm cursor-help">
                    <Crown className="w-4 h-4 text-amber-700" />
                </div>
                {/* Tooltip */}
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Class Topper
                </span>
            </div>

            <div className="group relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-cyan-200 border border-cyan-300 flex items-center justify-center shadow-sm cursor-help">
                    <Star className="w-4 h-4 text-cyan-700" />
                </div>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Perfect Week
                </span>
            </div>

            <div className="group relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-red-200 border border-red-300 flex items-center justify-center shadow-sm cursor-help">
                    <Flame className="w-4 h-4 text-red-600" />
                </div>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    3 Day Streak
                </span>
            </div>

            <div className="h-6 w-px bg-gray-300/50 mx-2"></div>
        </div>
    );
};

export default HeaderBadges;
