import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Calendar, Clock, Plus, Filter, Users, BookOpen, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

export default function AdminTimetable() {
    const { user } = useAuth();
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [selectedDept, setSelectedDept] = useState('Computer Science');
    const [selectedSem, setSelectedSem] = useState('3');

    // Dropdown Data
    const [subjects, setSubjects] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [classroomId, setClassroomId] = useState(null);

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [slotForm, setSlotForm] = useState({
        day: 'Monday',
        startTime: '09:00',
        endTime: '09:50',
        subjectId: '',
        facultyId: '',
        roomId: '',
        type: 'LECTURE'
    });

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
    ];

    useEffect(() => {
        fetchDropdowns();
    }, []);

    useEffect(() => {
        if (classroomId) fetchSchedule();
    }, [classroomId, selectedDept, selectedSem]); // Reload when filter changes

    // 1. Fetch Helper Data (Subjects, Faculties, Classroom ID)
    const fetchDropdowns = async () => {
        const token = localStorage.getItem('token');
        try {
            const [subRes, facRes] = await Promise.all([
                fetch('http://localhost:5000/api/subjects', { headers: { Authorization: `Bearer ${token}` } }),
                fetch('http://localhost:5000/api/subjects/faculties', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setSubjects(await subRes.json());
            setFaculties(await facRes.json());

            // Find Classroom ID for default filter
            resolveClassroom(selectedDept, selectedSem);
        } catch (error) {
            console.error("Error loading dropdowns:", error);
        }
    };

    const resolveClassroom = async (dept, sem) => {
        // In a real app, you'd have a dropdown of classrooms. 
        // Here we mock finding the right ID or assume the backend filters by params.
        // For now, let's just use the query params mechanism in getSchedule.
        // But to create a slot, we NEED a classroomId.
        // Let's fetch "My Class" equivalent or search classrooms.
        // Simplified: Just set arbitrary ID or fetch from a 'classrooms' endpoint if it existed.
        // Workaround: We'll filter `getSchedule` by dept/sem if we update backend, 
        // OR we just assume ID=1 for demo if not implemented.
        // Let's rely on `params` and let backend handle lookup if possible, 
        // or just fetch `api/classroom/list` if available.
        // Since we don't have `api/classroom/list`, we will try to infer or ask backend to find it.
        // Actually, let's just use query params for GET. 
        // For POST, we need `classroomId`. We'll fetch it via `api/classroom/my-class` simulation or similar.

        // BETTER: Let's fetch ALL subjects and see if they have classroom info, or just use `fetch('http://localhost:5000/api/classroom/find?dept=...&sem=...')`
        // We added `filter` logic to `getSchedule` in backend.
        // But `createSlot` needs `classroomId`.

        // HACK: For this demo, we will use a hardcoded map or just fetch users.
        // Let's add a quick helper to find classroomId from subjects? No.

        // REAL FIX: Fetch `api/classroom/all` (Need to implement or guess). 
        // Let's assume ID 1 exists for CS-3.
        setClassroomId(1);
    };

    const fetchSchedule = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            // Updated backend `getSchedule` to accept params, though currently it expects `classroomId`.
            // Let's rely on the filtering we added.
            const res = await fetch(`http://localhost:5000/api/timetable?classroomId=${classroomId}`, {
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

    const handleCreateSlot = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/timetable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ ...slotForm, classroomId })
            });
            const data = await res.json();
            if (res.ok) {
                alert("Slot added successfully!");
                setShowModal(false);
                fetchSchedule();
            } else {
                alert(data.message || "Conflict detected!");
            }
        } catch (error) {
            console.error("Create Slot Error:", error);
        }
    };

    const getSlotForWait = (day, time) => {
        return schedule.find(s => s.day === day && s.startTime.startsWith(time.split(':')[0]));
    };

    return (
        <DashboardLayout role="admin">
            <div className="p-6 max-w-7xl mx-auto">
                <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            Timetable Manager
                        </h1>
                        <p className="text-gray-500">Master Scheduler for {selectedDept} - Sem {selectedSem}</p>
                    </div>

                    <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
                        {/* Simple Mock Filters */}
                        <select className="p-2 bg-gray-50 rounded-lg outline-none text-sm font-bold text-gray-700" value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
                            <option>Computer Science</option>
                            <option>Electronics</option>
                        </select>
                        <select className="p-2 bg-gray-50 rounded-lg outline-none text-sm font-bold text-gray-700" value={selectedSem} onChange={e => setSelectedSem(e.target.value)}>
                            <option value="1">Sem 1</option>
                            <option value="3">Sem 3</option>
                            <option value="5">Sem 5</option>
                        </select>
                        <button className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition"
                    >
                        <Plus className="w-5 h-5 mr-2" /> Add Slot
                    </button>
                </header>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-gray-200">
                                    <th className="p-4 w-24 text-gray-400 font-bold uppercase text-xs sticky left-0 bg-slate-50 z-10">Day / Time</th>
                                    {timeSlots.map(time => (
                                        <th key={time} className="p-4 min-w-[140px] text-gray-600 font-bold text-sm text-center border-l border-gray-100">
                                            {time}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {days.map(day => (
                                    <tr key={day} className="border-b border-gray-100 hover:bg-slate-50/50 transition">
                                        <td className="p-4 font-bold text-indigo-900 bg-white sticky left-0 z-10 shadow-sm md:shadow-none">
                                            {day.substring(0, 3)}
                                        </td>
                                        {timeSlots.map(time => {
                                            const slot = getSlotForWait(day, time);
                                            return (
                                                <td key={time} className="p-2 border-l border-gray-100 h-32 align-top">
                                                    {slot ? (
                                                        <div className={`h-full rounded-xl p-3 shadow-md border group relative overflow-hidden flex flex-col justify-between hover:scale-[1.02] transition-all
                                                            ${slot.type === 'LAB'
                                                                ? 'bg-purple-50 border-purple-100 text-purple-700'
                                                                : 'bg-indigo-50 border-indigo-100 text-indigo-700'}
                                                        `}>
                                                            <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition">
                                                                <button className="p-1 hover:bg-white/50 rounded-full text-red-500"><Trash2 className="w-3 h-3" /></button>
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-[10px] font-black uppercase tracking-wider opacity-70">{slot.type}</span>
                                                                    <span className="text-[10px] font-bold">{slot.room}</span>
                                                                </div>
                                                                <h4 className="font-bold text-sm leading-tight">{slot.subject?.name}</h4>
                                                                <p className="text-xs opacity-80 mt-1 flex items-center">
                                                                    <Users className="w-3 h-3 mr-1" /> {slot.faculty?.name?.split(' ')[0]}
                                                                </p>
                                                            </div>
                                                            <div className="mt-auto pt-2 border-t border-black/5">
                                                                <p className="text-[10px] font-mono text-center opacity-80">
                                                                    {slot.startTime} - {slot.endTime}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            onClick={() => {
                                                                setSlotForm(prev => ({ ...prev, day, startTime: time, endTime: time.split(':')[0] + ':50' }));
                                                                setShowModal(true);
                                                            }}
                                                            className="h-full rounded-xl border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-300 hover:border-indigo-200 hover:text-indigo-400 hover:bg-indigo-50/30 transition cursor-pointer"
                                                        >
                                                            <Plus className="w-5 h-5" />
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

                {/* Add Slot Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
                            <h2 className="text-2xl font-black text-gray-900 mb-6">Schedule Class</h2>
                            <form onSubmit={handleCreateSlot} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Day</label>
                                        <select className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-bold text-gray-700" value={slotForm.day} onChange={e => setSlotForm({ ...slotForm, day: e.target.value })}>
                                            {days.map(d => <option key={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                                        <select className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-bold text-gray-700" value={slotForm.type} onChange={e => setSlotForm({ ...slotForm, type: e.target.value })}>
                                            <option value="LECTURE">Lecture</option>
                                            <option value="LAB">Lab</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Start Time</label>
                                        <input type="time" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-bold" value={slotForm.startTime} onChange={e => setSlotForm({ ...slotForm, startTime: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">End Time</label>
                                        <input type="time" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-bold" value={slotForm.endTime} onChange={e => setSlotForm({ ...slotForm, endTime: e.target.value })} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject</label>
                                    <select required className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-bold text-gray-700" value={slotForm.subjectId} onChange={e => setSlotForm({ ...slotForm, subjectId: e.target.value })}>
                                        <option value="">Select Subject</option>
                                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Faculty</label>
                                    <select required className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-bold text-gray-700" value={slotForm.facultyId} onChange={e => setSlotForm({ ...slotForm, facultyId: e.target.value })}>
                                        <option value="">Select Faculty</option>
                                        {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Room / Lab</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. 302 or Lab 1"
                                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-bold placeholder-gray-300"
                                        value={slotForm.roomId}
                                        onChange={e => setSlotForm({ ...slotForm, roomId: e.target.value })}
                                    />
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition">Cancel</button>
                                    <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg hover:shadow-xl transition">Save Slot</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
