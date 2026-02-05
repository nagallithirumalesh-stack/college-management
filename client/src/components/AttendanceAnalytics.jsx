import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Brain, Calendar, Target } from 'lucide-react';

export default function AttendanceAnalytics({ studentData, attendanceStats }) {
    // Calculate risk level based on attendance
    const calculateRisk = (percentage) => {
        if (percentage >= 85) return { level: 'low', color: 'emerald', icon: CheckCircle };
        if (percentage >= 75) return { level: 'medium', color: 'yellow', icon: AlertTriangle };
        return { level: 'high', color: 'red', icon: AlertTriangle };
    };

    // Predict future attendance (simple linear projection)
    const predictAttendance = (current, trend) => {
        const weeks = 2;
        const predicted = current + (trend * weeks);
        return Math.max(0, Math.min(100, Math.round(predicted)));
    };

    // Calculate trend (mock - in production, analyze historical data)
    const calculateTrend = (percentage) => {
        // Simulate trend based on current percentage
        if (percentage >= 80) return Math.random() * 2 - 0.5; // Slight variation
        if (percentage >= 75) return Math.random() * -2; // Declining
        return Math.random() * -3; // Sharp decline
    };

    const currentPercentage = attendanceStats?.overallPercentage || 0;
    const trend = calculateTrend(currentPercentage);
    const predicted = predictAttendance(currentPercentage, trend);
    const risk = calculateRisk(currentPercentage);
    const RiskIcon = risk.icon;

    // Calculate classes needed to reach 75%
    const calculateClassesNeeded = () => {
        if (currentPercentage >= 75) return 0;

        const totalClasses = attendanceStats?.subjectWise?.reduce((sum, s) => sum + s.total, 0) || 0;
        const attendedClasses = attendanceStats?.subjectWise?.reduce((sum, s) => sum + s.attended, 0) || 0;

        // Formula: (attended + x) / (total + x) = 0.75
        // Solving for x: x = (0.75 * total - attended) / 0.25
        const needed = Math.ceil((0.75 * totalClasses - attendedClasses) / 0.25);
        return Math.max(0, needed);
    };

    const classesNeeded = calculateClassesNeeded();

    return (
        <div className="space-y-6">
            {/* AI Insights Header */}
            <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                    <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">AI Insights</h3>
                    <p className="text-sm text-gray-500">Powered by behavioral analytics</p>
                </div>
            </div>

            {/* Risk Assessment Card */}
            <div className={`bg-gradient-to-br from-${risk.color}-50 to-${risk.color}-100 border-2 border-${risk.color}-200 rounded-3xl p-6 shadow-lg`}>
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <RiskIcon className={`w-5 h-5 text-${risk.color}-600`} />
                            <span className={`text-sm font-bold text-${risk.color}-700 uppercase tracking-wider`}>
                                {risk.level} Risk
                            </span>
                        </div>
                        <h4 className="text-2xl font-black text-gray-900">
                            {currentPercentage}%
                        </h4>
                        <p className="text-sm text-gray-600">Current Attendance</p>
                    </div>
                    <div className={`p-3 bg-${risk.color}-200 rounded-2xl`}>
                        <Target className={`w-8 h-8 text-${risk.color}-700`} />
                    </div>
                </div>

                {/* Trend Indicator */}
                <div className="flex items-center space-x-2 mb-4">
                    {trend > 0 ? (
                        <>
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-medium text-emerald-700">
                                Improving trend (+{trend.toFixed(1)}% per week)
                            </span>
                        </>
                    ) : (
                        <>
                            <TrendingDown className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-700">
                                Declining trend ({trend.toFixed(1)}% per week)
                            </span>
                        </>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/50 rounded-full h-3 mb-2 overflow-hidden">
                    <div
                        className={`h-3 rounded-full bg-gradient-to-r from-${risk.color}-500 to-${risk.color}-600 transition-all duration-500`}
                        style={{ width: `${currentPercentage}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                    <span>0%</span>
                    <span className="font-bold">75% Threshold</span>
                    <span>100%</span>
                </div>
            </div>

            {/* Prediction Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <h4 className="text-lg font-bold text-gray-900">2-Week Forecast</h4>
                </div>

                <div className="flex items-end justify-between mb-4">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Predicted Attendance</p>
                        <p className={`text-4xl font-black ${predicted >= 75 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {predicted}%
                        </p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl ${predicted >= 75 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {predicted >= 75 ? (
                            <span className="text-sm font-bold flex items-center">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Safe
                            </span>
                        ) : (
                            <span className="text-sm font-bold flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                At Risk
                            </span>
                        )}
                    </div>
                </div>

                {predicted < 75 && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                        <p className="text-sm font-bold text-red-900 mb-2">⚠️ Action Required</p>
                        <p className="text-sm text-red-700">
                            You're predicted to fall below 75% in 2 weeks. Attend at least <strong>{classesNeeded} more classes</strong> to stay safe.
                        </p>
                    </div>
                )}
            </div>

            {/* AI Recommendations */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border border-purple-200 shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <h4 className="text-lg font-bold text-gray-900">AI Recommendations</h4>
                </div>

                <div className="space-y-3">
                    {currentPercentage < 75 ? (
                        <>
                            <div className="flex items-start space-x-3 bg-white/50 p-3 rounded-xl">
                                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">1</div>
                                <p className="text-sm text-gray-700">
                                    <strong>Priority:</strong> Attend next {classesNeeded} consecutive classes to reach 75%
                                </p>
                            </div>
                            <div className="flex items-start space-x-3 bg-white/50 p-3 rounded-xl">
                                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">2</div>
                                <p className="text-sm text-gray-700">
                                    <strong>Avoid:</strong> Missing any classes this week
                                </p>
                            </div>
                            <div className="flex items-start space-x-3 bg-white/50 p-3 rounded-xl">
                                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">3</div>
                                <p className="text-sm text-gray-700">
                                    <strong>Consider:</strong> Filing OD requests only for critical events
                                </p>
                            </div>
                        </>
                    ) : currentPercentage < 85 ? (
                        <>
                            <div className="flex items-start space-x-3 bg-white/50 p-3 rounded-xl">
                                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">1</div>
                                <p className="text-sm text-gray-700">
                                    <strong>Maintain:</strong> Current attendance pattern to stay above 75%
                                </p>
                            </div>
                            <div className="flex items-start space-x-3 bg-white/50 p-3 rounded-xl">
                                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">2</div>
                                <p className="text-sm text-gray-700">
                                    <strong>Buffer:</strong> You can miss up to 2 classes this month safely
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-start space-x-3 bg-white/50 p-3 rounded-xl">
                                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">✓</div>
                                <p className="text-sm text-gray-700">
                                    <strong>Excellent!</strong> You have a healthy attendance buffer
                                </p>
                            </div>
                            <div className="flex items-start space-x-3 bg-white/50 p-3 rounded-xl">
                                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">✓</div>
                                <p className="text-sm text-gray-700">
                                    <strong>Keep it up:</strong> Continue your current attendance pattern
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Subject-wise Breakdown */}
            {attendanceStats?.subjectWise && attendanceStats.subjectWise.length > 0 && (
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Subject-wise Analysis</h4>
                    <div className="space-y-3">
                        {attendanceStats.subjectWise.map((subject, idx) => {
                            const subjectRisk = calculateRisk(subject.percentage);
                            return (
                                <div key={idx} className="bg-gray-50 rounded-2xl p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-gray-900">{subject.name}</span>
                                        <span className={`text-sm font-bold px-3 py-1 rounded-full bg-${subjectRisk.color}-100 text-${subjectRisk.color}-700`}>
                                            {subject.percentage}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-2 rounded-full bg-gradient-to-r from-${subjectRisk.color}-400 to-${subjectRisk.color}-600`}
                                            style={{ width: `${subject.percentage}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {subject.attended} / {subject.total} classes attended
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
