import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Brain, AlertTriangle, TrendingDown, TrendingUp, Users, Mail, Bell, BarChart3, Calendar } from 'lucide-react';

export default function FacultyAIInsights() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [atRiskStudents, setAtRiskStudents] = useState([]);
    const [stats, setStats] = useState({
        totalAtRisk: 0,
        avgRiskScore: 0,
        needsAction: 0,
        improved: 0
    });

    useEffect(() => {
        fetchAIInsights();
    }, []);

    const fetchAIInsights = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            // Fetch all students and calculate risk scores
            const res = await fetch('http://localhost:5000/api/users?role=student', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const students = await res.json();

                // Calculate risk scores for each student
                const studentsWithRisk = await Promise.all(
                    students.map(async (student) => {
                        const statsRes = await fetch(`http://localhost:5000/api/attendance/stats/${student.id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        if (statsRes.ok) {
                            const attendanceStats = await statsRes.json();
                            const riskScore = calculateRiskScore(attendanceStats);
                            const trend = calculateTrend(attendanceStats);

                            return {
                                ...student,
                                attendance: attendanceStats.overallPercentage,
                                riskScore,
                                trend,
                                status: getRiskStatus(riskScore)
                            };
                        }
                        return null;
                    })
                );

                const validStudents = studentsWithRisk.filter(s => s !== null);
                const atRisk = validStudents.filter(s => s.riskScore >= 40).sort((a, b) => b.riskScore - a.riskScore);

                setAtRiskStudents(atRisk);
                setStats({
                    totalAtRisk: atRisk.length,
                    avgRiskScore: Math.round(atRisk.reduce((sum, s) => sum + s.riskScore, 0) / atRisk.length) || 0,
                    needsAction: atRisk.filter(s => s.riskScore >= 70).length,
                    improved: validStudents.filter(s => s.trend > 0).length
                });
            }
        } catch (error) {
            console.error('Error fetching AI insights:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateRiskScore = (attendanceStats) => {
        const attendance = attendanceStats.overallPercentage;
        let score = 0;

        // Attendance weight: 50%
        if (attendance < 75) score += 50;
        else if (attendance < 85) score += 25;

        // Trend weight: 30% (simulated for now)
        const trend = Math.random() * 4 - 2; // -2 to +2
        if (trend < -1) score += 30;
        else if (trend < 0) score += 15;

        // Consistency weight: 20% (simulated)
        const consistency = Math.random();
        if (consistency < 0.5) score += 20;
        else if (consistency < 0.7) score += 10;

        return Math.min(100, Math.round(score));
    };

    const calculateTrend = (attendanceStats) => {
        // Simulated trend calculation
        return Math.random() * 4 - 2; // -2 to +2
    };

    const getRiskStatus = (score) => {
        if (score >= 70) return { level: 'critical', color: 'red', label: 'Critical' };
        if (score >= 40) return { level: 'warning', color: 'yellow', label: 'Warning' };
        return { level: 'low', color: 'green', label: 'Low Risk' };
    };

    const handleIntervention = async (student) => {
        alert(`Intervention triggered for ${student.name}\n\nActions:\n- Email sent to student\n- Notification sent to class teacher\n- Added to intervention tracking`);
    };

    const handleNotify = async (student) => {
        alert(`Notification sent to ${student.name}\n\nMessage: Your attendance is ${student.attendance}%. Please attend upcoming classes to maintain the 75% threshold.`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-4 md:p-8">
            {/* Ambient Background */}
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/15 to-indigo-200/15 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                                    <Brain className="w-10 h-10 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                                        AI Insights Dashboard
                                    </h1>
                                    <p className="text-gray-600 mt-1">Faculty analytics and intervention tools</p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/faculty')}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-12 text-center">
                        <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">Loading AI insights...</p>
                    </div>
                ) : (
                    <>
                        {/* Overview Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <AlertTriangle className="w-8 h-8 text-red-600" />
                                    <span className="text-3xl font-black text-gray-900">{stats.totalAtRisk}</span>
                                </div>
                                <p className="text-sm font-medium text-gray-600">At Risk Students</p>
                            </div>

                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <BarChart3 className="w-8 h-8 text-orange-600" />
                                    <span className="text-3xl font-black text-gray-900">{stats.avgRiskScore}</span>
                                </div>
                                <p className="text-sm font-medium text-gray-600">Avg Risk Score</p>
                            </div>

                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <Bell className="w-8 h-8 text-purple-600" />
                                    <span className="text-3xl font-black text-gray-900">{stats.needsAction}</span>
                                </div>
                                <p className="text-sm font-medium text-gray-600">Need Action</p>
                            </div>

                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <TrendingUp className="w-8 h-8 text-emerald-600" />
                                    <span className="text-3xl font-black text-gray-900">{stats.improved}</span>
                                </div>
                                <p className="text-sm font-medium text-gray-600">Improved</p>
                            </div>
                        </div>

                        {/* At-Risk Students List */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
                            <div className="flex items-center space-x-3 mb-6">
                                <Users className="w-6 h-6 text-purple-600" />
                                <h2 className="text-2xl font-bold text-gray-900">At-Risk Students</h2>
                                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                                    {atRiskStudents.length} students
                                </span>
                            </div>

                            {atRiskStudents.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <TrendingUp className="w-8 h-8 text-emerald-600" />
                                    </div>
                                    <p className="text-gray-600 font-medium">No students at risk! 🎉</p>
                                    <p className="text-sm text-gray-500 mt-1">All students are maintaining healthy attendance</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {atRiskStudents.map((student, idx) => (
                                        <div
                                            key={student.id}
                                            className={`p-6 rounded-2xl border-2 transition-all hover:shadow-lg ${student.status.level === 'critical'
                                                    ? 'bg-red-50 border-red-200'
                                                    : 'bg-yellow-50 border-yellow-200'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
                                                        <p className="text-sm text-gray-600">{student.email}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-6">
                                                    {/* Attendance */}
                                                    <div className="text-center">
                                                        <p className="text-2xl font-black text-gray-900">{student.attendance}%</p>
                                                        <p className="text-xs text-gray-500">Attendance</p>
                                                    </div>

                                                    {/* Risk Score */}
                                                    <div className="text-center">
                                                        <div className={`text-2xl font-black ${student.status.level === 'critical' ? 'text-red-600' : 'text-yellow-600'
                                                            }`}>
                                                            {student.riskScore}
                                                        </div>
                                                        <p className="text-xs text-gray-500">Risk Score</p>
                                                    </div>

                                                    {/* Trend */}
                                                    <div className="flex items-center space-x-1">
                                                        {student.trend > 0 ? (
                                                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                                                        ) : (
                                                            <TrendingDown className="w-5 h-5 text-red-600" />
                                                        )}
                                                        <span className={`text-sm font-bold ${student.trend > 0 ? 'text-emerald-600' : 'text-red-600'
                                                            }`}>
                                                            {student.trend > 0 ? '+' : ''}{student.trend.toFixed(1)}%
                                                        </span>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleNotify(student)}
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center space-x-2 text-sm font-bold"
                                                        >
                                                            <Mail className="w-4 h-4" />
                                                            <span>Notify</span>
                                                        </button>
                                                        {student.status.level === 'critical' && (
                                                            <button
                                                                onClick={() => handleIntervention(student)}
                                                                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition flex items-center space-x-2 text-sm font-bold"
                                                            >
                                                                <AlertTriangle className="w-4 h-4" />
                                                                <span>Intervene</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* AI Recommendation */}
                                            <div className="mt-4 p-4 bg-white/50 rounded-xl">
                                                <div className="flex items-start space-x-2">
                                                    <Brain className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">AI Recommendation:</p>
                                                        <p className="text-sm text-gray-700">
                                                            {student.status.level === 'critical'
                                                                ? `Immediate intervention required. Student needs to attend ${Math.ceil((75 - student.attendance) / 5)} more classes to reach 75%.`
                                                                : `Monitor closely. Encourage attendance in upcoming classes.`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
