import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, MapPin, Calendar as CalIcon, Clock, Trash2, ArrowLeft, Users, Building2 } from 'lucide-react';
import Logo from '../components/Logo';

export default function AdminEvents() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        resource: 'Main Auditorium',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '11:00'
    });

    // Resources (Columns)
    const resources = ['Main Auditorium', 'Seminar Hall A', 'Seminar Hall B', 'Conference Room'];

    useEffect(() => {
        fetchEvents();
    }, [currentDate]);

    const fetchEvents = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/events', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setEvents(data);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const start = new Date(`${newEvent.date}T${newEvent.startTime}`);
        const end = new Date(`${newEvent.date}T${newEvent.endTime}`);

        try {
            const res = await fetch('http://localhost:5000/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...newEvent,
                    start,
                    end
                })
            });

            if (res.ok) {
                // alert("Event scheduled successfully!"); // Removed annoying alert
                setShowModal(false);
                fetchEvents();
                setNewEvent({ ...newEvent, title: '', description: '', startTime: '09:00', endTime: '11:00' });
            } else {
                const err = await res.json();
                alert(`Scheduling Failed: ${err.message}`);
            }
        } catch (error) {
            console.error("Schedule error:", error);
            alert("Error scheduling event");
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!confirm("Are you sure you want to cancel this event?")) return;
        const token = localStorage.getItem('token');
        try {
            await fetch(`http://localhost:5000/api/events/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchEvents();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const getEventsForResource = (resourceName) => {
        return events.filter(ev => {
            const evDate = new Date(ev.start).toDateString();
            const curDate = currentDate.toDateString();
            return ev.resource === resourceName && evDate === curDate;
        });
    };

    const changeDate = (days) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + days);
        setCurrentDate(newDate);
        setNewEvent(prev => ({ ...prev, date: newDate.toISOString().split('T')[0] }));
    };

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans text-slate-800">
            {/* Ambient Background Gradient */}
            <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/50 via-white to-white pointer-events-none" />

            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-6 py-4 flex items-center justify-between shadow-sm supports-[backdrop-filter]:bg-white/60">
                <div className="flex items-center cursor-pointer group" onClick={() => navigate('/admin')}>
                    <div className="p-2 rounded-full hover:bg-gray-100 transition mr-2">
                        <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Logo className="h-6 w-6" />
                            Auditorium Scheduler
                        </h1>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition flex items-center shadow-md shadow-indigo-600/20 active:scale-95 duration-200"
                    >
                        <Plus className="w-5 h-5 mr-2" /> New Booking
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:shadow-lg transition">
                        {user?.name?.[0] || 'A'}
                    </div>
                </div>
            </div>

            <main className="flex-1 max-w-[1600px] mx-auto w-full p-6 lg:p-8">

                {/* Calendar Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100/80">
                    <div className="flex items-center space-x-2 p-2 w-full md:w-auto justify-between md:justify-start">
                        <button onClick={() => changeDate(-1)} className="p-2 hover:bg-gray-100/80 rounded-xl text-slate-500 hover:text-indigo-600 transition">
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col items-center px-4">
                            <span className="text-xs uppercase tracking-wider font-bold text-indigo-500 mb-0.5">
                                {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
                            </span>
                            <h2 className="text-2xl font-bold text-slate-800">
                                {currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                <span className="text-slate-400 font-normal ml-2">{currentDate.getFullYear()}</span>
                            </h2>
                        </div>

                        <button onClick={() => changeDate(1)} className="p-2 hover:bg-gray-100/80 rounded-xl text-slate-500 hover:text-indigo-600 transition">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex items-center space-x-3 px-4 pb-2 md:pb-0 w-full md:w-auto justify-end">
                        <button
                            onClick={() => { const d = new Date(); setCurrentDate(d); setNewEvent(prev => ({ ...prev, date: d.toISOString().split('T')[0] })) }}
                            className="px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                        >
                            Today
                        </button>
                        <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block"></div>
                        <div className="flex items-center text-sm text-slate-500 hidden md:flex">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>Time Zone: IST</span>
                        </div>
                    </div>
                </div>

                {/* Scheduler Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {resources.map((resource, idx) => (
                        <div key={resource} className="bg-white rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col h-[700px] overflow-hidden group">
                            {/* Resource Header */}
                            <div className={`p-5 border-b border-gray-100 bg-gradient-to-r ${idx === 0 ? 'from-blue-50 to-indigo-50/50' : 'from-gray-50 to-white'}`}>
                                <h3 className="font-bold text-slate-800 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className={`p-1.5 rounded-lg mr-3 ${idx === 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                                            <Building2 className="w-4 h-4" />
                                        </div>
                                        {resource}
                                    </div>
                                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-500">
                                        Cap: {resource.includes('Auditorium') ? '500' : '100'}
                                    </span>
                                </h3>
                            </div>

                            {/* Timeline Items */}
                            <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar bg-slate-50/30">
                                {getEventsForResource(resource).length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400/60 p-6 text-center">
                                        <div className="w-16 h-16 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center mb-4">
                                            <Clock className="w-8 h-8" />
                                        </div>
                                        <span className="text-sm font-medium">No bookings yet</span>
                                        <span className="text-xs mt-1">Slot available all day</span>
                                    </div>
                                ) : (
                                    getEventsForResource(resource).map((ev, i) => {
                                        const startTime = new Date(ev.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                        const endTime = new Date(ev.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                        return (
                                            <div key={ev.id}
                                                className="bg-white border text-left p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group/card relative overflow-hidden border-l-4 border-l-indigo-500 animate-in fade-in slide-in-from-bottom-2"
                                                style={{ animationDelay: `${i * 100}ms` }}
                                            >
                                                <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleDeleteEvent(ev.id)}
                                                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                                                        title="Cancel Booking"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="mb-2">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 tracking-wide uppercase">
                                                        {startTime} - {endTime}
                                                    </span>
                                                </div>

                                                <h4 className="font-bold text-slate-800 text-sm leading-snug mb-1 pr-6">{ev.title}</h4>

                                                {ev.description && (
                                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">{ev.description}</p>
                                                )}

                                                <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-2">
                                                    <div className="flex items-center text-xs text-slate-400">
                                                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 flex items-center justify-center text-[9px] text-slate-600 font-bold mr-1.5 ring-2 ring-white">
                                                            {ev.organizer?.name ? ev.organizer.name[0] : 'U'}
                                                        </div>
                                                        <span className="truncate max-w-[100px]">{ev.organizer?.name || 'Unknown'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    ))}
                </div>

            </main>

            {/* Booking Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Book Facility</h3>
                                <p className="text-sm text-slate-500 mt-0.5">Create a new reservation</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 text-slate-400 hover:text-slate-600 transition shadow-sm border border-gray-100">
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleCreateEvent} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Event Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
                                    placeholder="e.g. Guest Lecture on AI"
                                    value={newEvent.title}
                                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Location</label>
                                    <select
                                        className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none"
                                        value={newEvent.resource}
                                        onChange={e => setNewEvent({ ...newEvent, resource: e.target.value })}
                                    >
                                        {resources.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        value={newEvent.date}
                                        onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Start Time</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        value={newEvent.startTime}
                                        onChange={e => setNewEvent({ ...newEvent, startTime: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">End Time</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        value={newEvent.endTime}
                                        onChange={e => setNewEvent({ ...newEvent, endTime: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Description <span className="text-gray-400 font-normal">(Optional)</span></label>
                                <textarea
                                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all h-24 resize-none placeholder:text-gray-400"
                                    placeholder="Add details regarding the event..."
                                    value={newEvent.description}
                                    onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30 active:scale-[0.98] duration-200"
                                >
                                    Confirm Booking
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
