import React from 'react';
import { CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeesAction = () => {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate('/student/fees')}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 hover:border-emerald-300 hover:shadow-lg transition-all group"
        >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-gray-700">Pay Fees</span>
        </button>
    );
};

export default FeesAction;
