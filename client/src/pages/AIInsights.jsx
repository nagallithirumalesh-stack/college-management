import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, TrendingUp, FileText, BarChart3 } from 'lucide-react';
import AttendanceAnalytics from '../components/AttendanceAnalytics';
import ODRecommendation from '../components/ODRecommendation';

export default function AIInsights() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('analytics');
    const [attendanceStats, setAttendanceStats] = useState({ overallPercentage: 0, subjectWise: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`http://localhost:5000/api/attendance/stats/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setAttendanceStats(data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchStats();
    }, [user]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-4 md:p-8">
            {/* Ambient Background */}
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-200/15 to-pink-200/15 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <button
                        onClick={() => navigate('/student')}
                        className="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Dashboard</span>
                    </button>

                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
                        <div className="flex items-center space-x-4">
                            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                                <Brain className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                                    AI Insights
                                </h1>
                                <p className="text-gray-600 mt-1">Powered by advanced behavioral analytics</p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex space-x-2 mt-6 bg-gray-100 p-1 rounded-2xl">
                            <button
                                onClick={() => setActiveTab('analytics')}
                                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'analytics'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Analytics
                            </button>
                            <button
                                onClick={() => setActiveTab('od')}
                                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'od'
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                OD Calculator
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
                    {loading ? (
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-12 text-center">
                            <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-600 font-medium">Loading AI insights...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'analytics' && (
                                <AttendanceAnalytics
                                    studentData={user}
                                    attendanceStats={attendanceStats}
                                />
                            )}
                            {activeTab === 'od' && (
                                <ODRecommendation
                                    attendanceStats={attendanceStats}
                                    studentName={user?.name}
                                />
                            )}
                        </>
                    )}
                </div>

                {/* Footer Info */}
                <div className="mt-8 text-center text-sm text-gray-500 animate-in fade-in duration-500" style={{ animationDelay: '200ms' }}>
                    <p>AI predictions are based on current attendance patterns and historical data</p>
                </div>
            </div>
        </div>
    );
}
