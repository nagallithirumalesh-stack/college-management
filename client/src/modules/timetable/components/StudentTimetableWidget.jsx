import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, BookOpen, MapPin, ArrowRight } from 'lucide-react';

export default function StudentTimetableWidget() {
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    useEffect(() => {
        const fetchSchedule = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch('http://localhost:5000/api/timetable/my', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const allSlots = await res.json();

                    // Filter for Today & Sort by Time
                    const todaySlots = allSlots
                        .filter(s => s.day === today)
                        .sort((a, b) => a.startTime.localeCompare(b.startTime));

                    setSchedule(todaySlots);
                } else if (res.status === 404) {
                    setSchedule([]); // Treat missing classroom/schedule as empty
                } else {
                    console.error("Widget API Error:", res.status, await res.text());
                }
            } catch (error) {
                console.error("Widget Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    if (loading) return <div className="p-6 bg-surface rounded-3xl animate-pulse h-40"></div>;

    return (
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-lg hover:shadow-xl transition-all h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-indigo-600" /> Today's Classes
                </h3>
                <button
                    onClick={() => navigate('/student/timetable')}
                    className="p-2 hover:bg-indigo-50 rounded-full text-indigo-600 transition"
                >
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
                {schedule.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-4">
                        <BookOpen className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-sm">No classes scheduled for today.</p>
                    </div>
                ) : (
                    schedule.map((slot, idx) => (
                        <div key={idx} className="flex items-start group">
                            <div className="w-14 flex-shrink-0 flex flex-col items-center mr-3 pt-1">
                                <span className="text-xs font-black text-gray-900">{slot.startTime}</span>
                                <span className="text-[10px] text-gray-400 font-mono mt-0.5">{slot.endTime}</span>
                            </div>

                            <div className={`flex-1 p-3 rounded-2xl border transition-all ${slot.type === 'LAB'
                                ? 'bg-purple-50 border-purple-100 group-hover:border-purple-200'
                                : 'bg-indigo-50 border-indigo-100 group-hover:border-indigo-200'
                                }`}>
                                <h4 className={`font-bold text-sm ${slot.type === 'LAB' ? 'text-purple-900' : 'text-indigo-900'}`}>
                                    {slot.subject?.name}
                                </h4>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center">
                                        <MapPin className="w-3 h-3 mr-1" /> {slot.room}
                                    </span>
                                    {slot.type === 'LAB' && <span className="text-[9px] bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded font-bold">LAB</span>}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{today}</span>
            </div>
        </div>
    );
}
