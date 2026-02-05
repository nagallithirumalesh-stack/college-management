import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft, Send, Trash2, Megaphone, Info, Calendar, Plus, X } from 'lucide-react';

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
            setAnnouncements(announcements.filter(a => a.id !== id));
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

    const getTypeColor = (type) => {
        switch (type) {
            case 'Event': return 'from-purple-500 to-pink-500';
            case 'News': return 'from-blue-500 to-cyan-500';
            case 'Alert': return 'from-red-500 to-orange-500';
            default: return 'from-emerald-500 to-teal-500';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/30 flex flex-col font-sans relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl -z-10"></div>
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/15 to-cyan-200/15 rounded-full blur-3xl -z-10"></div>

            {/* Header */}
            <div className="bg-white/70 backdrop-blur-xl border-b border-white/50 sticky top-0 z-10 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <button onClick={() => navigate(-1)} className="mr-4 p-2 hover:bg-white/50 rounded-xl transition group">
                            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">Announcements</h1>
                            <p className="text-xs text-gray-500 font-medium">Post circulars & news to students</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-xl transition-all shadow-lg hover:scale-105"
                    >
                        {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                        {showForm ? 'Cancel' : 'Post New'}
                    </button>
                </div>
            </div>

            <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">

                {/* Create Form */}
                {showForm && (
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/50 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h3 className="font-black text-2xl text-gray-900 mb-6 flex items-center">
                            <Megaphone className="w-6 h-6 mr-3 text-emerald-600" />
                            Draft Announcement
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Title / Subject</label>
                                <input
                                    type="text"
                                    placeholder="Enter announcement title..."
                                    className="w-full border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-semibold text-gray-800 bg-white/50 backdrop-blur-sm"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                                    <select
                                        className="w-full border-gray-200 rounded-xl p-4 outline-none bg-white/50 backdrop-blur-sm font-medium text-gray-700 focus:ring-2 focus:ring-emerald-500"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="Circular">Circular</option>
                                        <option value="Event">Event</option>
                                        <option value="News">News</option>
                                        <option value="Alert">Urgent Alert</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Audience</label>
                                    <select
                                        className="w-full border-gray-200 rounded-xl p-4 outline-none bg-white/50 backdrop-blur-sm font-medium text-gray-700 focus:ring-2 focus:ring-emerald-500"
                                        value={formData.targetAudience}
                                        onChange={e => setFormData({ ...formData, targetAudience: e.target.value })}
                                    >
                                        <option value="All">Everyone</option>
                                        <option value="Student">Students Only</option>
                                        <option value="Faculty">Faculty Only</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Message Content</label>
                                <textarea
                                    placeholder="Write your announcement message here..."
                                    rows="5"
                                    className="w-full border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white/50 backdrop-blur-sm text-gray-700"
                                    required
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-3 pt-2">
                                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition">Cancel</button>
                                <button type="submit" className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:shadow-xl transition-all shadow-lg flex items-center">
                                    <Send className="w-4 h-4 mr-2" /> Publish
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Feed */}
                <div className="space-y-5">
                    {loading ? (
                        <div className="text-center py-16 text-gray-400 animate-pulse">
                            <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            Loading announcements...
                        </div>
                    ) : announcements.length === 0 ? (
                        <div className="text-center py-16 bg-white/80 backdrop-blur-xl rounded-3xl border border-dashed border-gray-300 text-gray-500">
                            <Megaphone className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="font-semibold">No announcements found.</p>
                            <p className="text-sm mt-1">Click "Post New" to create your first announcement.</p>
                        </div>
                    ) : (
                        announcements.map(item => (
                            <div key={item.id} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 overflow-hidden hover:shadow-2xl transition-all group">
                                {/* Gradient Top Bar */}
                                <div className={`h-1.5 bg-gradient-to-r ${getTypeColor(item.type)}`}></div>

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-start space-x-4 flex-1">
                                            <div className={`p-3 rounded-2xl bg-gradient-to-br ${getTypeColor(item.type)} shadow-lg flex-shrink-0`}>
                                                <div className="text-white">
                                                    {getIcon(item.type)}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-emerald-700 transition-colors">{item.title}</h3>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${item.type === 'Alert' ? 'bg-red-100 text-red-700' :
                                                            item.type === 'Event' ? 'bg-purple-100 text-purple-700' :
                                                                item.type === 'News' ? 'bg-blue-100 text-blue-700' :
                                                                    'bg-emerald-100 text-emerald-700'
                                                        }`}>
                                                        {item.type}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 font-medium flex items-center flex-wrap gap-2">
                                                    <span>By {item.createdBy?.name || 'Admin'}</span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                    <span>{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs uppercase font-bold tracking-wide text-gray-600">{item.targetAudience}</span>
                                                </p>
                                            </div>
                                        </div>
                                        {(user.role === 'admin' || user.id === item.createdBy?.id) && (
                                            <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed pl-16">
                                        {item.content}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
