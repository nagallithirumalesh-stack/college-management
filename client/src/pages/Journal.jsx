import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, Plus, Calendar, Smile, Meh, Frown, Zap, Coffee, Sparkles, X } from 'lucide-react';

export default function Journal() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('Neutral');

    const moods = [
        { name: 'Happy', icon: Smile, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
        { name: 'Neutral', icon: Meh, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' },
        { name: 'Stressed', icon: Frown, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
        { name: 'Excited', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
        { name: 'Tired', icon: Coffee, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' }
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

    const getMoodData = (moodName) => {
        return moods.find(m => m.name === moodName) || moods[1];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 font-sans relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl -z-10"></div>
            <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-200/15 to-cyan-200/15 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate('/student')}
                            className="mr-4 p-2.5 rounded-xl hover:bg-white/50 text-gray-600 hover:text-indigo-600 transition backdrop-blur-sm"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 flex items-center">
                                <Book className="w-7 h-7 mr-3 text-indigo-600" /> Class Journal
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">Reflect on your daily learning journey and track your growth.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-105 flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" /> New Entry
                    </button>
                </div>

                {/* Entry Form */}
                {showForm && (
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 mb-8 animate-fade-in-down">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-gray-900 flex items-center">
                                <Sparkles className="w-5 h-5 mr-2 text-indigo-600" /> New Reflection
                            </h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="What did you learn today?"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none bg-white/50 backdrop-blur-sm transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Content</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Write your thoughts, insights, and reflections..."
                                    rows="5"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none resize-none bg-white/50 backdrop-blur-sm transition"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">How are you feeling?</label>
                                <div className="flex space-x-3">
                                    {moods.map(m => {
                                        const Icon = m.icon;
                                        return (
                                            <button
                                                key={m.name}
                                                type="button"
                                                onClick={() => setMood(m.name)}
                                                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center flex-1 transition-all ${mood === m.name ? `${m.border} ring-4 ring-indigo-100 ${m.bg} scale-105` : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}
                                            >
                                                <Icon className={`w-7 h-7 mb-2 ${mood === m.name ? m.color : 'text-gray-400'}`} />
                                                <span className={`text-xs font-bold ${mood === m.name ? 'text-gray-900' : 'text-gray-500'}`}>{m.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200"
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
                        <div className="text-center py-16">
                            <div className="inline-block w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                            <p className="text-gray-500 mt-4">Loading your journal...</p>
                        </div>
                    ) : entries.length === 0 ? (
                        <div className="text-center py-20 bg-white/60 backdrop-blur-xl rounded-3xl border-2 border-dashed border-gray-300">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                <Book className="w-10 h-10 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No entries yet</h3>
                            <p className="text-gray-600 mb-6">Start documenting your learning journey today.</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 inline-flex items-center"
                            >
                                <Plus className="w-4 h-4 mr-2" /> Create First Entry
                            </button>
                        </div>
                    ) : (
                        entries.map((entry, idx) => {
                            const moodData = getMoodData(entry.mood);
                            const MoodIcon = moodData.icon;

                            return (
                                <div
                                    key={entry.id}
                                    className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/50 relative hover:shadow-xl transition-all group"
                                    style={{ animationDelay: `${idx * 0.1}s` }}
                                >
                                    <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${moodData.color.replace('text', 'from')} to-transparent rounded-l-3xl`}></div>

                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center">
                                            <div className={`${moodData.bg} p-3 rounded-2xl mr-4 group-hover:scale-110 transition-transform`}>
                                                <MoodIcon className={`w-6 h-6 ${moodData.color}`} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{entry.title}</h3>
                                                <p className="text-xs text-gray-500 flex items-center mt-1">
                                                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                                    {new Date(entry.date).toLocaleDateString(undefined, {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-bold px-3 py-1.5 ${moodData.bg} ${moodData.color} rounded-xl border ${moodData.border}`}>
                                            {entry.mood}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed pl-[4.5rem] text-sm">
                                        {entry.content}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
