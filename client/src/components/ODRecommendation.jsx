import { FileText, AlertCircle, CheckCircle, TrendingDown, Calendar, Brain, Info } from 'lucide-react';

export default function ODRecommendation({ attendanceStats, studentName }) {
    const currentPercentage = attendanceStats?.overallPercentage || 0;

    // Calculate impact of missing classes
    const calculateImpact = (missedClasses) => {
        const totalClasses = attendanceStats?.subjectWise?.reduce((sum, s) => sum + s.total, 0) || 0;
        const attendedClasses = attendanceStats?.subjectWise?.reduce((sum, s) => sum + s.attended, 0) || 0;

        const newTotal = totalClasses + missedClasses;
        const newPercentage = newTotal > 0 ? Math.round((attendedClasses / newTotal) * 100) : 100;

        return {
            newPercentage,
            drop: currentPercentage - newPercentage,
            safe: newPercentage >= 75
        };
    };

    // Calculate maximum classes that can be missed
    const calculateMaxMissable = () => {
        const totalClasses = attendanceStats?.subjectWise?.reduce((sum, s) => sum + s.total, 0) || 0;
        const attendedClasses = attendanceStats?.subjectWise?.reduce((sum, s) => sum + s.attended, 0) || 0;

        // Formula: (attended) / (total + x) = 0.75
        // Solving for x: x = (attended / 0.75) - total
        const maxMissable = Math.floor((attendedClasses / 0.75) - totalClasses);
        return Math.max(0, maxMissable);
    };

    const maxMissable = calculateMaxMissable();
    const impact1 = calculateImpact(1);
    const impact2 = calculateImpact(2);
    const impact3 = calculateImpact(3);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
                    <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">OD Impact Calculator</h3>
                    <p className="text-sm text-gray-500">AI-powered leave recommendations</p>
                </div>
            </div>

            {/* Current Status */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border-2 border-blue-200 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-1">Current Status</p>
                        <p className="text-4xl font-black text-gray-900">{currentPercentage}%</p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl ${currentPercentage >= 75 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {currentPercentage >= 75 ? (
                            <span className="text-sm font-bold flex items-center">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Safe
                            </span>
                        ) : (
                            <span className="text-sm font-bold flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                Below Threshold
                            </span>
                        )}
                    </div>
                </div>

                <div className="bg-white/50 rounded-2xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                        <Brain className="w-4 h-4 text-indigo-600" />
                        <p className="text-sm font-bold text-gray-900">AI Recommendation</p>
                    </div>
                    <p className="text-sm text-gray-700">
                        {maxMissable > 0 ? (
                            <>You can safely miss up to <strong className="text-indigo-600">{maxMissable} classes</strong> and still maintain 75% attendance.</>
                        ) : currentPercentage >= 75 ? (
                            <>You're at the threshold. Avoid missing any classes to stay safe.</>
                        ) : (
                            <>You're below 75%. Filing OD will further reduce your attendance. Consider attending all upcoming classes.</>
                        )}
                    </p>
                </div>
            </div>

            {/* Impact Scenarios */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <TrendingDown className="w-5 h-5 text-orange-600" />
                    <h4 className="text-lg font-bold text-gray-900">Impact Scenarios</h4>
                </div>

                <div className="space-y-3">
                    {/* 1 Day OD */}
                    <div className={`rounded-2xl p-4 border-2 ${impact1.safe ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center space-x-2">
                                <Calendar className={`w-4 h-4 ${impact1.safe ? 'text-emerald-600' : 'text-red-600'}`} />
                                <span className="font-bold text-gray-900">1 Day OD</span>
                            </div>
                            <span className={`text-2xl font-black ${impact1.safe ? 'text-emerald-600' : 'text-red-600'}`}>
                                {impact1.newPercentage}%
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Impact: -{impact1.drop}%</span>
                            {impact1.safe ? (
                                <span className="text-emerald-700 font-bold flex items-center">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Safe to file
                                </span>
                            ) : (
                                <span className="text-red-700 font-bold flex items-center">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Not recommended
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 2 Days OD */}
                    <div className={`rounded-2xl p-4 border-2 ${impact2.safe ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center space-x-2">
                                <Calendar className={`w-4 h-4 ${impact2.safe ? 'text-yellow-600' : 'text-red-600'}`} />
                                <span className="font-bold text-gray-900">2 Days OD</span>
                            </div>
                            <span className={`text-2xl font-black ${impact2.safe ? 'text-yellow-600' : 'text-red-600'}`}>
                                {impact2.newPercentage}%
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Impact: -{impact2.drop}%</span>
                            {impact2.safe ? (
                                <span className="text-yellow-700 font-bold flex items-center">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Proceed with caution
                                </span>
                            ) : (
                                <span className="text-red-700 font-bold flex items-center">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    High risk
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 3 Days OD */}
                    <div className={`rounded-2xl p-4 border-2 ${impact3.safe ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center space-x-2">
                                <Calendar className={`w-4 h-4 ${impact3.safe ? 'text-orange-600' : 'text-red-600'}`} />
                                <span className="font-bold text-gray-900">3 Days OD</span>
                            </div>
                            <span className={`text-2xl font-black ${impact3.safe ? 'text-orange-600' : 'text-red-600'}`}>
                                {impact3.newPercentage}%
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Impact: -{impact3.drop}%</span>
                            <span className="text-red-700 font-bold flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                {impact3.safe ? 'Risky' : 'Strongly discouraged'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Smart Recommendations */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border border-purple-200 shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <h4 className="text-lg font-bold text-gray-900">Smart Recommendations</h4>
                </div>

                <div className="space-y-3">
                    {currentPercentage >= 85 ? (
                        <>
                            <div className="flex items-start space-x-3 bg-white/50 p-3 rounded-xl">
                                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Healthy Buffer</p>
                                    <p className="text-xs text-gray-600">You have room for {maxMissable} OD requests this month</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 bg-white/50 p-3 rounded-xl">
                                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Best Practice</p>
                                    <p className="text-xs text-gray-600">File OD only for important events to maintain your buffer</p>
                                </div>
                            </div>
                        </>
                    ) : currentPercentage >= 75 ? (
                        <>
                            <div className="flex items-start space-x-3 bg-white/50 p-3 rounded-xl">
                                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-gray-900">At Threshold</p>
                                    <p className="text-xs text-gray-600">File OD only for critical events. Each day impacts your percentage</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 bg-white/50 p-3 rounded-xl">
                                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Recovery Plan</p>
                                    <p className="text-xs text-gray-600">Attend next 5 classes consecutively to build a safety buffer</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-start space-x-3 bg-white/50 p-3 rounded-xl">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Critical Status</p>
                                    <p className="text-xs text-gray-600">Avoid filing OD. Focus on attending all upcoming classes</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 bg-white/50 p-3 rounded-xl">
                                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Priority Action</p>
                                    <p className="text-xs text-gray-600">Speak with faculty about attendance recovery options</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <div className="flex items-start space-x-2">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-blue-900 mb-1">How it works</p>
                        <p className="text-xs text-blue-700">
                            This calculator uses AI to predict the impact of OD requests on your attendance.
                            It considers your current percentage, total classes, and the 75% threshold requirement.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
