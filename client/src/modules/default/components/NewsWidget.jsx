import React from 'react';
import { Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewsWidget = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center">
                <Megaphone className="w-4 h-4 mr-2 text-indigo-500" /> Campus News
            </h3>
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Megaphone className="w-8 h-8 text-indigo-600" />
                </div>
                <p className="text-gray-600 text-sm mb-4">Check for circulars, events, and important news.</p>
                <button
                    onClick={() => navigate('/student/announcements')}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200"
                >
                    View Announcements
                </button>
            </div>
        </div>
    );
};

export default NewsWidget;
