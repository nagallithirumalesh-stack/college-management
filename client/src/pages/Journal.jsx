import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, Plus, Calendar, Smile, Meh, Frown, Zap, Coffee } from 'lucide-react';

export default function Journal() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('Neutral');

    const moods = [
        { name: 'Happy', icon: Smile, color: 'text-green-500 bg-green-50' },
        { name: 'Neutral', icon: Meh, color: 'text-gray-500 bg-gray-50' },
        { name: 'Stressed', icon: Frown, color: 'text-red-500 bg-red-50' },
        { name: 'Excited', icon: Zap, color: 'text-yellow-500 bg-yellow-50' },
        { name: 'Tired', icon: Coffee, color: 'text-blue-500 bg-blue-50' }
    ];

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/journal', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setEntries(data);
            }
        } catch (error) {
            console.error("Error fetching journal:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/journal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title, content, mood })
            });

            if (res.ok) {
                await fetchEntries();
                setShowForm(false);
                setTitle('');
                setContent('');
                setMood('Neutral');
            }
        } catch (error) {
            console.error("Error creating entry:", error);
        }
    };

    const getMoodIcon = (moodName) => {
        const m = moods.find(m => m.name === moodName) || moods[1];
        const Icon = m.icon;
        return <Icon className={`w-5 h-5 ${m.color.split(' ')[0]}`} />;
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate('/student')}
                            className="mr-4 p-2 rounded-full hover:bg-gray-200 text-gray-500 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                <Book className="w-6 h-6 mr-2 text-indigo-600" /> Class Journal
                            </h1>
                            <p className="text-gray-500 text-sm">Reflect on your daily learning journey.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" /> New Entry
                    </button>
                </div>

                {/* Entry Form */}
                {showForm && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 animate-fade-in-down">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">New Reflection</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="What did you learn today?"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Write your thoughts..."
                                    rows="4"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
                                <div className="flex space-x-3">
                                    {moods.map(m => {
                                        const Icon = m.icon;
                                        return (
                                            <button
                                                key={m.name}
                                                type="button"
                                                onClick={() => setMood(m.name)}
                                                className={`p-3 rounded-xl border flex flex-col items-center justify-center w-20 transition ${mood === m.name ? `border-indigo-500 ring-2 ring-indigo-200 ${m.color.split(' ')[1]}` : 'border-gray-200 hover:bg-gray-50'}`}
                                            >
                                                <Icon className={`w-6 h-6 mb-1 ${m.color.split(' ')[0]}`} />
                                                <span className="text-xs font-medium text-gray-600">{m.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-sm"
                                >
                                    Save Entry
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Timeline */}
                <div className="space-y-6">
                    {loading ? (
                        <p className="text-center text-gray-400 py-12">Loading journal...</p>
                    ) : entries.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                            <Book className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-gray-900">No entries yet</h3>
                            <p className="text-gray-500">Start documenting your journey today.</p>
                        </div>
                    ) : (
                        entries.map((entry) => (
                            <div key={entry._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center">
                                        <div className="bg-indigo-50 p-2 rounded-lg mr-3">
                                            {getMoodIcon(entry.mood)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{entry.title}</h3>
                                            <p className="text-xs text-gray-500 flex items-center mt-0.5">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded text-gray-600">
                                        {entry.mood}
                                    </span>
                                </div>
                                <p className="text-gray-700 leading-relaxed pl-[3.25rem]">
                                    {entry.content}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
