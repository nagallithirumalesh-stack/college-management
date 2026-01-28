import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, MapPin, ArrowLeft, Plus } from 'lucide-react';

export default function FacultyEvents() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Booking Form
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        resource: 'Main Auditorium',
        start: '',
        end: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/events', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setEvents(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Booking Request Sent! Admin will review it.');
                setShowModal(false);
                fetchEvents();
            } else {
                const err = await res.json();
                alert('Error: ' + err.message);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to submit booking');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <button onClick={() => navigate('/faculty')} className="mr-4 p-2 hover:bg-gray-100 rounded-full transition">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">Campus Events & Bookings</h1>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Request Booking
                    </button>
                </div>
            </div>

            <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                            <div className={`h-2 w-full ${event.status === 'Approved' ? 'bg-emerald-500' : 'bg-orange-400'}`}></div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${event.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'}`}>
                                        {event.status}
                                    </span>
                                    <span className="text-xs text-gray-400 font-mono">
                                        {new Date(event.start).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg mb-1">{event.title}</h3>
                                <div className="flex items-center text-sm text-gray-500 mb-3">
                                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                    {event.resource}
                                </div>
                                <div className="flex items-center text-xs text-gray-400 bg-gray-50 p-2 rounded-lg">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                    {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Booking Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Request Hall Booking</h3>
                        <form onSubmit={handleBooking} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Venue Resource</label>
                                <select
                                    className="w-full border rounded-lg p-2.5 outline-none bg-gray-50"
                                    value={formData.resource}
                                    onChange={e => setFormData({ ...formData, resource: e.target.value })}
                                >
                                    <option>Main Auditorium</option>
                                    <option>Seminar Hall A</option>
                                    <option>Seminar Hall B</option>
                                    <option>Conference Room</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                        value={formData.start}
                                        onChange={e => setFormData({ ...formData, start: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                        value={formData.end}
                                        onChange={e => setFormData({ ...formData, end: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-purple-500"
                                    rows="3"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700">Submit Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
