import React from 'react';
import { Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LeaderboardAction = () => {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate('/student/leaderboard')}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-yellow-50 to-amber-50 border border-amber-100 hover:border-amber-300 hover:shadow-lg transition-all group"
        >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-xs font-bold text-gray-700">Leaderboard</span>
        </button>
    );
};

export default LeaderboardAction;
