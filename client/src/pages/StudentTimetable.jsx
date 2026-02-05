import { useState, useEffect } from 'react';

import { Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react';

export default function StudentTimetable() {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [today, setToday] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

    useEffect(() => {
        // Sample Data for Demonstration
        const sampleSchedule = [
            { id: 1, day: 'Monday', startTime: '09:00', endTime: '10:00', subject: { name: 'Data Structures' }, faculty: { name: 'Dr. Alan' }, room: 'CS-101', type: 'LECTURE' },
            { id: 2, day: 'Monday', startTime: '11:00', endTime: '13:00', subject: { name: 'Web Dev Lab' }, faculty: { name: 'Prof. Sarah' }, room: 'LAB-2', type: 'LAB' },
            { id: 3, day: 'Tuesday', startTime: '10:00', endTime: '11:00', subject: { name: 'Database Systems' }, faculty: { name: 'Dr. James' }, room: 'CS-102', type: 'LECTURE' },
            { id: 4, day: 'Wednesday', startTime: '09:00', endTime: '10:00', subject: { name: 'Algorithms' }, faculty: { name: 'Dr. K' }, room: 'CS-103', type: 'LECTURE' },
            { id: 5, day: 'Wednesday', startTime: '14:00', endTime: '16:00', subject: { name: 'Python Lab' }, faculty: { name: 'Mr. John' }, room: 'LAB-1', type: 'LAB' },
            { id: 6, day: 'Thursday', startTime: '11:00', endTime: '12:00', subject: { name: 'Operating Systems' }, faculty: { name: 'Ms. Emily' }, room: 'CS-104', type: 'LECTURE' },
            { id: 7, day: 'Friday', startTime: '10:00', endTime: '11:00', subject: { name: 'Computer Networks' }, faculty: { name: 'Dr. Robert' }, room: 'CS-105', type: 'LECTURE' },
            { id: 8, day: 'Friday', startTime: '15:00', endTime: '16:00', subject: { name: 'Soft Skills' }, faculty: { name: 'Mrs. Linda' }, room: 'HALL-A', type: 'LECTURE' }
        ];

        // Simulate API delay
        setTimeout(() => {
            setSchedule(sampleSchedule);
            setLoading(false);
        }, 500);

        // Original API Call (Commented out for sample data mode)
        /*
        const fetchSchedule = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch('http://localhost:5000/api/timetable/my', {
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
        */
    }, []);

    const getSlot = (day, time) => {
        // Simple match for MVP: checks if slot starts within the hour
        return schedule.find(s => s.day === day && s.startTime.startsWith(time.split(':')[0]));
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        My Timetable
                    </h1>
                    <p className="text-gray-500">Weekly Class Schedule</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 font-bold text-indigo-600 flex items-center">
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
                                <div className="flex flex-col items-center justify-center w-16 bg-indigo-50 rounded-xl text-indigo-700 font-bold text-xs p-2">
                                    <span>{slot.startTime}</span>
                                    <div className="w-px h-2 bg-indigo-200 my-1"></div>
                                    <span>{slot.endTime}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{slot.subject?.name}</h3>
                                    <p className="text-xs text-gray-500 flex items-center mt-1">
                                        <User className="w-3 h-3 mr-1" /> {slot.faculty?.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
                                            <MapPin className="w-3 h-3 mr-1" /> {slot.room}
                                        </span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${slot.type === 'LAB' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {slot.type}
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
                                    <th key={day} className={`p-4 min-w-[150px] font-bold text-sm text-center border-l border-gray-100 ${day === today ? 'text-indigo-600 bg-indigo-50/50' : 'text-gray-600'}`}>
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
                                            <td key={day} className={`p-2 border-l border-gray-50 h-28 align-top ${day === today ? 'bg-indigo-50/10' : ''}`}>
                                                {slot && (
                                                    <div className={`h-full rounded-xl p-3 shadow-sm border flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-default
                                                        ${slot.type === 'LAB' ? 'bg-purple-50 border-purple-100 text-purple-900' : 'bg-blue-50 border-blue-100 text-blue-900'}
                                                    `}>
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="font-bold text-xs leading-tight line-clamp-2">{slot.subject?.name}</h4>
                                                            <span className="text-[10px] font-black opacity-50">{slot.room}</span>
                                                        </div>
                                                        <div className="mt-2">
                                                            <p className="text-[10px] opacity-70 flex items-center">
                                                                <User className="w-3 h-3 mr-1" /> {slot.faculty?.name?.split(' ')[0]}
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
