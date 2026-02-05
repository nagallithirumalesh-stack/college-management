import { Calendar, TrendingUp, Clock } from 'lucide-react';

export default function AttendanceHeatmap({ data }) {
    // Days of the week
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Time slots (8 AM - 5 PM)
    const timeSlots = [
        '8-9', '9-10', '10-11', '11-12',
        '12-1', '1-2', '2-3', '3-4', '4-5'
    ];

    // Generate mock heatmap data (in production, this comes from backend)
    const generateHeatmapData = () => {
        const heatmapData = {};
        days.forEach(day => {
            heatmapData[day] = {};
            timeSlots.forEach(slot => {
                // Simulate attendance percentages
                // Lower attendance for early morning and late afternoon
                let baseAttendance = 85;
                if (slot === '8-9') baseAttendance = 70;
                if (slot === '4-5') baseAttendance = 75;
                if (day === 'Sat') baseAttendance -= 10;

                heatmapData[day][slot] = Math.round(baseAttendance + (Math.random() * 15 - 7.5));
            });
        });
        return heatmapData;
    };

    const heatmapData = data || generateHeatmapData();

    // Get color based on attendance percentage
    const getColor = (percentage) => {
        if (percentage >= 90) return 'bg-emerald-500';
        if (percentage >= 85) return 'bg-emerald-400';
        if (percentage >= 80) return 'bg-yellow-400';
        if (percentage >= 75) return 'bg-yellow-500';
        if (percentage >= 70) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const getTextColor = (percentage) => {
        if (percentage >= 90) return 'text-emerald-700';
        if (percentage >= 85) return 'text-emerald-600';
        if (percentage >= 80) return 'text-yellow-700';
        if (percentage >= 75) return 'text-yellow-700';
        if (percentage >= 70) return 'text-orange-700';
        return 'text-red-700';
    };

    // Calculate insights
    const calculateInsights = () => {
        let lowestSlot = { day: '', time: '', percentage: 100 };
        let highestSlot = { day: '', time: '', percentage: 0 };

        days.forEach(day => {
            timeSlots.forEach(slot => {
                const percentage = heatmapData[day][slot];
                if (percentage < lowestSlot.percentage) {
                    lowestSlot = { day, time: slot, percentage };
                }
                if (percentage > highestSlot.percentage) {
                    highestSlot = { day, time: slot, percentage };
                }
            });
        });

        return { lowestSlot, highestSlot };
    };

    const insights = calculateInsights();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                    <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Attendance Heatmap</h3>
                    <p className="text-sm text-gray-500">Weekly attendance patterns by time slot</p>
                </div>
            </div>

            {/* Heatmap Grid */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg p-6 overflow-x-auto">
                <div className="min-w-[600px]">
                    {/* Time slot labels */}
                    <div className="flex mb-2">
                        <div className="w-16"></div>
                        {timeSlots.map(slot => (
                            <div key={slot} className="flex-1 text-center">
                                <span className="text-xs font-bold text-gray-600">{slot}</span>
                            </div>
                        ))}
                    </div>

                    {/* Heatmap rows */}
                    {days.map(day => (
                        <div key={day} className="flex items-center mb-2">
                            <div className="w-16 text-sm font-bold text-gray-700">{day}</div>
                            {timeSlots.map(slot => {
                                const percentage = heatmapData[day][slot];
                                return (
                                    <div
                                        key={`${day}-${slot}`}
                                        className="flex-1 mx-1 group relative"
                                    >
                                        <div
                                            className={`${getColor(percentage)} rounded-lg h-12 flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg cursor-pointer`}
                                        >
                                            <span className="text-white font-bold text-sm">{percentage}%</span>
                                        </div>

                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                            <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                                                <p className="font-bold">{day} {slot}</p>
                                                <p>{percentage}% attendance</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs font-bold text-gray-600 mb-2">Attendance Rate</p>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-red-500 rounded"></div>
                            <span className="text-xs text-gray-600">&lt;70%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-orange-500 rounded"></div>
                            <span className="text-xs text-gray-600">70-75%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                            <span className="text-xs text-gray-600">75-80%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                            <span className="text-xs text-gray-600">80-85%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-emerald-400 rounded"></div>
                            <span className="text-xs text-gray-600">85-90%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                            <span className="text-xs text-gray-600">≥90%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Lowest Attendance */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border-2 border-red-200 p-6">
                    <div className="flex items-center space-x-3 mb-3">
                        <TrendingUp className="w-5 h-5 text-red-600 rotate-180" />
                        <h4 className="font-bold text-gray-900">Lowest Attendance</h4>
                    </div>
                    <p className="text-3xl font-black text-red-600 mb-2">
                        {insights.lowestSlot.percentage}%
                    </p>
                    <p className="text-sm text-gray-700">
                        <strong>{insights.lowestSlot.day}</strong> at <strong>{insights.lowestSlot.time}</strong>
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                        💡 Consider rescheduling or offering incentives for this slot
                    </p>
                </div>

                {/* Highest Attendance */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-200 p-6">
                    <div className="flex items-center space-x-3 mb-3">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                        <h4 className="font-bold text-gray-900">Highest Attendance</h4>
                    </div>
                    <p className="text-3xl font-black text-emerald-600 mb-2">
                        {insights.highestSlot.percentage}%
                    </p>
                    <p className="text-sm text-gray-700">
                        <strong>{insights.highestSlot.day}</strong> at <strong>{insights.highestSlot.time}</strong>
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                        ✅ Optimal time slot for important classes
                    </p>
                </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <h4 className="font-bold text-gray-900">AI Recommendations</h4>
                </div>
                <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                        <span className="text-purple-600 font-bold">•</span>
                        <p className="text-sm text-gray-700">
                            Schedule important topics during <strong>{insights.highestSlot.day} {insights.highestSlot.time}</strong> for maximum engagement
                        </p>
                    </div>
                    <div className="flex items-start space-x-2">
                        <span className="text-purple-600 font-bold">•</span>
                        <p className="text-sm text-gray-700">
                            Consider hybrid/recorded sessions for <strong>{insights.lowestSlot.day} {insights.lowestSlot.time}</strong> slot
                        </p>
                    </div>
                    <div className="flex items-start space-x-2">
                        <span className="text-purple-600 font-bold">•</span>
                        <p className="text-sm text-gray-700">
                            Early morning (8-9 AM) shows lower attendance - consider starting at 9 AM
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
