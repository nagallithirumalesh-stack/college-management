import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, MapPin, Calendar as CalIcon, Clock, Trash2, ArrowLeft } from 'lucide-react';
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
    }, [currentDate]); // Refresh when view changes (though we fetch all for now)

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

        // Construct ISO Dates
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
                alert("Event scheduled successfully!");
                setShowModal(false);
                fetchEvents();
                // Reset form
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

    // Filter events for current week view or day view
    // For simplicity, let's build a "Day View" column layout for the selected date
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
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center cursor-pointer hover:opacity-80 transition" onClick={() => navigate('/admin')}>
                    <ArrowLeft className="w-5 h-5 mr-3 text-gray-500" />
                    <Logo className="h-8 w-8 mr-2" />
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Auditorium Scheduler
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition flex items-center shadow-md"
                    >
                        <Plus className="w-5 h-5 mr-2" /> New Booking
                    </button>
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                        A
                    </div>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto w-full p-6">

                {/* Calendar Controls */}
                <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => changeDate(-1)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div className="flex items-center space-x-2">
                            <CalIcon className="w-5 h-5 text-indigo-500" />
                            <h2 className="text-xl font-bold text-gray-800">
                                {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                            </h2>
                        </div>
                        <button onClick={() => changeDate(1)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                    <button
                        onClick={() => { const d = new Date(); setCurrentDate(d); setNewEvent(prev => ({ ...prev, date: d.toISOString().split('T')[0] })) }}
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                        Today
                    </button>
                </div>

                {/* Scheduler Grid (Day View) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {resources.map(resource => (
                        <div key={resource} className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[600px]">
                            {/* Resource Header */}
                            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-bold text-gray-900 flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                                    {resource}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">Capacity: {resource.includes('Auditorium') ? '500' : '100'}</p>
                            </div>

                            {/* Timeline Items */}
                            <div className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar relative">
                                {getEventsForResource(resource).length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm italic opacity-60">
                                        <Clock className="w-8 h-8 mb-2" />
                                        <span>Available all day</span>
                                    </div>
                                ) : (
                                    getEventsForResource(resource).map(ev => {
                                        const startTime = new Date(ev.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                        const endTime = new Date(ev.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                        return (
                                            <div key={ev._id} className="bg-indigo-50 border-l-4 border-indigo-500 p-3 rounded shadow-sm hover:shadow-md transition group relative">
                                                <button
                                                    onClick={() => handleDeleteEvent(ev._id)}
                                                    className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                                                    title="Cancel Booking"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                                <h4 className="font-bold text-gray-900 text-sm leading-tight">{ev.title}</h4>
                                                <p className="text-xs text-indigo-700 font-semibold mt-1">
                                                    {startTime} - {endTime}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ev.description}</p>
                                                <div className="mt-2 flex items-center text-xs text-gray-400">
                                                    <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center text-[10px] text-white font-bold mr-1">
                                                        {ev.organizer?.name ? ev.organizer.name[0] : 'A'}
                                                    </div>
                                                    {ev.organizer?.name || 'Admin'}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Book Facility</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
                        </div>
                        <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="e.g. Guest Lecture on AI"
                                    value={newEvent.title}
                                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Facility</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                    value={newEvent.resource}
                                    onChange={e => setNewEvent({ ...newEvent, resource: e.target.value })}
                                >
                                    {resources.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={newEvent.date}
                                    onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={newEvent.startTime}
                                        onChange={e => setNewEvent({ ...newEvent, startTime: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={newEvent.endTime}
                                        onChange={e => setNewEvent({ ...newEvent, endTime: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none h-20"
                                    placeholder="Add details..."
                                    value={newEvent.description}
                                    onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg mt-2"
                            >
                                Confirm Booking
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
