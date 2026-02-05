import React, { useState, useEffect } from 'react';
import { CreditCard, ChevronRight, AlertCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const FeesWidget = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // If token needed
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        status: 'PENDING',
        dueDate: null
    });

    useEffect(() => {
        const fetchFees = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch('http://localhost:5000/api/fees/my', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const result = await res.json();
                if (result.hasFeeRecord) {
                    setData(result);
                }
            } catch (error) {
                console.error("Error fetching fees:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFees();
    }, []);

    const percentage = data.totalAmount > 0
        ? Math.round((data.paidAmount / data.totalAmount) * 100)
        : 0;

    if (loading) {
        return (
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-lg h-full flex items-center justify-center">
                <Loader className="w-6 h-6 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col justify-between relative overflow-hidden group">

            {/* Ambient Background for Finance Feel */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-200/50 transition-colors"></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide flex items-center">
                    <CreditCard className="w-4 h-4 mr-2 text-emerald-600" /> Fees Status
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${data.status === 'PAID' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                        data.status === 'OVERDUE' ? 'bg-red-100 text-red-700 border-red-200' :
                            'bg-orange-100 text-orange-700 border-orange-200'
                    }`}>
                    {data.status}
                </span>
            </div>

            <div className="flex items-center space-x-6 relative z-10">
                {/* Circular Progress */}
                <div className="relative w-20 h-20 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                        <circle
                            cx="40" cy="40" r="36"
                            stroke="currentColor" strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={226}
                            strokeDashoffset={226 - (226 * percentage) / 100}
                            className={`transition-all duration-1000 ease-out ${percentage === 100 ? 'text-emerald-500' : 'text-indigo-500'}`}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-sm font-black text-gray-800">{percentage}%</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Paid</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex-1">
                    <div className="mb-2">
                        <p className="text-xs text-gray-500 font-medium">Pending Due</p>
                        <p className="text-xl font-black text-gray-900">₹{data.pendingAmount.toLocaleString()}</p>
                    </div>
                    {data.pendingAmount > 0 && (
                        <div className="w-full rounded-lg bg-red-50 border border-red-100 p-2 flex items-center">
                            <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-red-700 uppercase">
                                {data.dueDate ? `Due: ${data.dueDate}` : 'Due Soon'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={() => navigate('/student/fees')}
                className="mt-6 w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 flex items-center justify-center hover:scale-[1.02] transition-transform"
            >
                <span className="mr-2 text-sm">Pay Now</span>
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default FeesWidget;
