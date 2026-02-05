import { useState, useEffect } from 'react';

import { Calendar, Clock, MapPin, Users, BookOpen } from 'lucide-react';

export default function FacultyTimetable() {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [today, setToday] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

    useEffect(() => {
        const fetchSchedule = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch('http://localhost:5000/api/timetable/teaching', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    setSchedule(await res.json());
                }
            } catch (error) {
                console.error("Fetch Schedule Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    const getSlot = (day, time) => {
        return schedule.find(s => s.day === day && s.startTime.startsWith(time.split(':')[0]));
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                        Teaching Schedule
                    </h1>
                    <p className="text-gray-500">Your Weekly Classes</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 font-bold text-emerald-600 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Today is {today}
                </div>
            </div>

            {/* Mobile: Today's Schedule Card */}
            <div className="md:hidden space-y-4">
                <h2 className="font-bold text-lg">Today's Classes</h2>
                {schedule.filter(s => s.day === today).length > 0 ? (
                    schedule.filter(s => s.day === today)
                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                        .map(slot => (
                            <div key={slot.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                                <div className="flex flex-col items-center justify-center w-16 bg-emerald-50 rounded-xl text-emerald-700 font-bold text-xs p-2">
                                    <span>{slot.startTime}</span>
                                    <div className="w-px h-2 bg-emerald-200 my-1"></div>
                                    <span>{slot.endTime}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{slot.subject?.name}</h3>
                                    <p className="text-xs text-gray-500 flex items-center mt-1">
                                        <Users className="w-3 h-3 mr-1" /> {slot.classroom?.department} - Sem {slot.classroom?.semester}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
                                            <MapPin className="w-3 h-3 mr-1" /> {slot.room}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                ) : (
                    <div className="p-8 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                        No classes scheduled for today.
                    </div>
                )}
            </div>

            {/* Desktop: Weekly Grid */}
            <div className="hidden md:block bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-gray-100">
                                <th className="p-4 w-24 text-gray-400 font-bold uppercase text-xs sticky left-0 bg-slate-50 z-10">Time</th>
                                {days.map(day => (
                                    <th key={day} className={`p-4 min-w-[150px] font-bold text-sm text-center border-l border-gray-100 ${day === today ? 'text-emerald-600 bg-emerald-50/50' : 'text-gray-600'}`}>
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {timeSlots.map(time => (
                                <tr key={time} className="border-b border-gray-50 hover:bg-slate-50/30 transition">
                                    <td className="p-4 font-mono text-xs font-bold text-gray-400 text-center sticky left-0 bg-white z-10">
                                        {time}
                                    </td>
                                    {days.map(day => {
                                        const slot = getSlot(day, time);
                                        return (
                                            <td key={day} className={`p-2 border-l border-gray-50 h-28 align-top ${day === today ? 'bg-emerald-50/10' : ''}`}>
                                                {slot && (
                                                    <div className={`h-full rounded-xl p-3 shadow-sm border flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-default
                                                            bg-emerald-50 border-emerald-100 text-emerald-900
                                                        `}>
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="font-bold text-xs leading-tight line-clamp-2">{slot.subject?.name}</h4>
                                                            <span className="text-[10px] font-black opacity-50">{slot.room}</span>
                                                        </div>
                                                        <div className="mt-2 text-[10px] opacity-80">
                                                            <p className="font-bold flex items-center">
                                                                <Users className="w-3 h-3 mr-1" /> {slot.classroom?.department} - S{slot.classroom?.semester}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
