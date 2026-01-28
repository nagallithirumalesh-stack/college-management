import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft, Send, Trash2, Megaphone, Info, Calendar } from 'lucide-react';

export default function FacultyAnnouncements() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'Circular',
        targetAudience: 'All'
    });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/announcements', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setAnnouncements(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/announcements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Announcement Posted!');
                setShowForm(false);
                setFormData({ title: '', content: '', type: 'Circular', targetAudience: 'All' });
                fetchAnnouncements();
            } else {
                alert('Failed to post');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this announcement?')) return;
        const token = localStorage.getItem('token');
        try {
            await fetch(`http://localhost:5000/api/announcements/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnnouncements(announcements.filter(a => a._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'Event': return <Calendar className="w-5 h-5 text-purple-500" />;
            case 'News': return <Megaphone className="w-5 h-5 text-blue-500" />;
            case 'Alert': return <Bell className="w-5 h-5 text-red-500" />;
            default: return <Info className="w-5 h-5 text-emerald-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <button onClick={() => navigate(-1)} className="mr-4 p-2 hover:bg-gray-100 rounded-full transition">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">Circulars & Announcements</h1>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition shadow-sm"
                    >
                        <Send className="w-4 h-4 mr-2" />
                        Post New
                    </button>
                </div>
            </div>

            <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">

                {/* Create Form */}
                {showForm && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-indigo-100 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h3 className="font-bold text-gray-800 mb-4">Draft Announcement</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Title / Subject"
                                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-800"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    className="w-full border rounded-lg p-3 outline-none bg-gray-50"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="Circular">Circular</option>
                                    <option value="Event">Event</option>
                                    <option value="News">News</option>
                                    <option value="Alert">Urgent Alert</option>
                                </select>
                                <select
                                    className="w-full border rounded-lg p-3 outline-none bg-gray-50"
                                    value={formData.targetAudience}
                                    onChange={e => setFormData({ ...formData, targetAudience: e.target.value })}
                                >
                                    <option value="All">Everyone</option>
                                    <option value="Student">Students Only</option>
                                    <option value="Faculty">Faculty Only</option>
                                </select>
                            </div>
                            <textarea
                                placeholder="Message content..."
                                rows="4"
                                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                                required
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                            ></textarea>
                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">Publish</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Feed */}
                <div className="space-y-4">
                    {loading ? <div className="text-center py-12 text-gray-400">Loading feeds...</div> :
                        announcements.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed text-gray-400">
                                No announcements found.
                            </div>
                        ) : (
                            announcements.map(item => (
                                <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-lg bg-gray-50`}>
                                                {getIcon(item.type)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{item.title}</h3>
                                                <p className="text-xs text-gray-500">
                                                    By {item.createdBy?.name || 'Admin'} • {new Date(item.createdAt).toLocaleDateString()}
                                                    <span className="mx-2">•</span>
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs uppercase font-bold tracking-wide text-gray-600">{item.targetAudience}</span>
                                                </p>
                                            </div>
                                        </div>
                                        {(user.role === 'admin' || user._id === item.createdBy?._id) && (
                                            <button onClick={() => handleDelete(item._id)} className="text-gray-400 hover:text-red-500 p-1">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-wrap pl-12 text-sm leading-relaxed">
                                        {item.content}
                                    </p>
                                </div>
                            ))
                        )}
                </div>
            </div>
        </div>
    );
}
