import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Book, Clock, Award, Bell, Calendar, ChevronRight, Users, CheckSquare, Plus, Trash2, LogOut, FileText, Rocket, Megaphone } from 'lucide-react';
import Logo from '../components/Logo';
import NotificationDropdown from '../components/NotificationDropdown';

export default function StudentDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [latestNotes, setLatestNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [attendanceStats, setAttendanceStats] = useState({ overallPercentage: 0, subjectWise: [] });
    const [marks, setMarks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            const token = localStorage.getItem('token');
            try {
                // Fetch Subjects
                const subRes = await fetch('http://localhost:5000/api/subjects', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const subData = await subRes.json();
                setSubjects(subData);

                // Fetch Latest Notes for "New in your subjects"
                const notesRes = await fetch('http://localhost:5000/api/notes/latest', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const notesData = await notesRes.json();
                setLatestNotes(notesData);

                // Fetch Todos
                const todoRes = await fetch('http://localhost:5000/api/todos', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (todoRes.ok) {
                    const todoData = await todoRes.json();
                    setTodos(todoData);
                }

                // Fetch Attendance Stats
                const attRes = await fetch(`http://localhost:5000/api/attendance/stats/${user._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (attRes.ok) setAttendanceStats(await attRes.json());

                // Fetch Marks
                const markRes = await fetch('http://localhost:5000/api/marks/my-marks', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (markRes.ok) setMarks(await markRes.json());

            } catch (error) {
                console.error("Error loading dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const getBandColor = (band) => {
        switch (band) {
            case 'Gold': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
            case 'Silver': return 'text-slate-500 bg-slate-50 border-slate-200';
            case 'Platinum': return 'text-indigo-500 bg-indigo-50 border-indigo-200';
            default: return 'text-orange-600 bg-orange-50 border-orange-200';
        }
    };

    const getSubjectStats = (subjectId) => {
        return attendanceStats.subjectWise.find(s => s.subjectId === subjectId) || { percentage: 0 };
    };

    const getSubjectMark = (subjectId) => {
        const subjectMarks = marks.filter(m => m.subject?._id === subjectId || m.subject === subjectId);
        return subjectMarks.length > 0 ? subjectMarks[0] : null;
    };

    const handleScanQR = () => {
        navigate('/student/scan');
    };

    const handleIdentityAction = async (action) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:5000/api/identity/${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(action === 'verify' ? { simulateFailure: false } : {})
            });
            const data = await res.json();

            if (res.ok) {
                alert(data.message + (data.similarity ? ` (Similarity: ${data.similarity})` : ''));
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Identity Error:", error);
        }
    };

    const handleAddTodo = async (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ text: newTodo })
            });
            const data = await res.json();
            if (res.ok) {
                setTodos([data, ...todos]);
                setNewTodo('');
            }
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    const handleToggleTodo = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setTodos(todos.map(t => t._id === id ? { ...t, completed: !t.completed } : t));
            }
        } catch (error) {
            console.error("Error toggling todo:", error);
        }
    };

    const handleDeleteTodo = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setTodos(todos.filter(t => t._id !== id));
            }
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Logo className="h-8 w-8 mr-2" />
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                                SmartCampus
                            </span>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center space-x-1">
                            {/* Navigation Links - Subtle, minimal */}
                            <button onClick={() => navigate('/student/journal')} className="px-3 py-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition text-sm font-medium flex items-center">
                                <Book className="w-4 h-4 mr-2" />
                                Journal
                            </button>
                            <button onClick={() => navigate('/student/resources')} className="px-3 py-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition text-sm font-medium flex items-center">
                                <Rocket className="w-4 h-4 mr-2" />
                                Resources
                            </button>
                            <button onClick={() => navigate('/student/leave')} className="px-3 py-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition text-sm font-medium flex items-center">
                                <FileText className="w-4 h-4 mr-2" />
                                Leave
                            </button>

                            <div className="h-6 w-px bg-gray-200 mx-2"></div>

                            {/* Primary Action */}
                            <button onClick={handleScanQR} className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition text-sm font-bold flex items-center">
                                <Users className="w-4 h-4 mr-2" />
                                Scan Presence
                            </button>

                            {/* Notifications & Profile */}
                            <div className="ml-3 flex items-center space-x-3 pl-3 border-l border-gray-100">
                                <NotificationDropdown />

                                <div className="group relative z-50">
                                    <div className="flex items-center cursor-pointer p-1 rounded-full hover:bg-gray-50 transition">
                                        <img className="h-9 w-9 rounded-full bg-gray-200 border-2 border-white shadow-sm" src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt="" />
                                    </div>

                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 hidden group-hover:block transform transition-all duration-200 origin-top-right">
                                        <div className="px-4 py-3 border-b border-gray-50">
                                            <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                                            <p className="text-xs text-gray-500">Student • {user?.section || 'A'}</p>
                                        </div>
                                        <div className="p-1">
                                            <button onClick={() => navigate('/profile')} className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg flex items-center transition">
                                                <Users className="w-4 h-4 mr-2 text-gray-400" /> My Profile
                                            </button>
                                            <button onClick={() => handleIdentityAction('enroll')} className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg flex items-center transition">
                                                <Users className="w-4 h-4 mr-2 text-purple-400" /> Enroll Face ID
                                            </button>
                                            <button onClick={() => handleIdentityAction('verify')} className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg flex items-center transition">
                                                <CheckSquare className="w-4 h-4 mr-2 text-green-400" /> Verify ID
                                            </button>
                                        </div>
                                        <div className="border-t border-gray-50 p-1">
                                            <button onClick={logout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center transition">
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">

                {/* 1. Band Strip */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                        <div className="mr-4">
                            <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
                            <p className="text-gray-500">You're doing great this semester.</p>
                        </div>
                    </div>

                    <div className={`flex items-center px-4 py-2 rounded-xl border ${getBandColor(user?.band || 'Bronze')}`}>
                        <div className="mr-4 text-right">
                            <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Current Rank</p>
                            <p className="text-lg font-bold">{user?.band || 'Bronze'} Band</p>
                        </div>
                        <Award className="w-8 h-8 opacity-90" />
                        <div className="ml-4 pl-4 border-l border-current/20">
                            <div className="text-xs font-medium mb-1 flex justify-between w-24">
                                <span>{user?.points || 0} pts</span>
                                <span className="opacity-60">/ 100</span>
                            </div>
                            <div className="w-24 h-1.5 bg-black/10 rounded-full overflow-hidden">
                                <div className="h-full bg-current rounded-full" style={{ width: `${Math.min(user?.points || 0, 100)}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Widgets Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Attendance at a Glance */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center">
                            <Calendar className="w-4 h-4 mr-2" /> Attendance
                        </h3>
                        <div className="space-y-4">
                            {attendanceStats.subjectWise.length > 0 ? (
                                attendanceStats.subjectWise.slice(0, 3).map(stat => (
                                    <div key={stat.subjectId} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-gray-700">{stat.name}</span>
                                            <span className={`font-bold ${stat.percentage < 75 ? 'text-red-600' : 'text-emerald-600'}`}>
                                                {stat.percentage}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${stat.percentage < 75 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                style={{ width: `${stat.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-400 text-sm py-8">No attendance data yet.</p>
                            )}

                            {attendanceStats.overallPercentage < 75 && attendanceStats.overallPercentage > 0 && (
                                <div className="mt-4 pt-3 border-t border-gray-50">
                                    <p className="text-xs text-red-500 font-medium flex items-center">
                                        <Award className="w-3 h-3 mr-1" />
                                        Warning: Low overall attendance
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Homework / Todo List */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col h-96">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center">
                            <CheckSquare className="w-4 h-4 mr-2" /> My Tasks
                        </h3>

                        <form onSubmit={handleAddTodo} className="flex mb-4">
                            <input
                                type="text"
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                                placeholder="Add a new task..."
                                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-3 py-2 rounded-r-lg hover:bg-blue-700 transition"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </form>

                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                            {todos.length === 0 ? (
                                <p className="text-center text-gray-400 text-sm mt-8">No tasks yet. Enjoy!</p>
                            ) : (
                                todos.map(todo => (
                                    <div key={todo._id} className="flex items-center justify-between group p-2 hover:bg-gray-50 rounded-lg transition">
                                        <div className="flex items-center flex-1 min-w-0">
                                            <button
                                                onClick={() => handleToggleTodo(todo._id)}
                                                className={`w-5 h-5 rounded border mr-3 flex items-center justify-center transition-colors ${todo.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-blue-500'}`}
                                            >
                                                {todo.completed && <CheckSquare className="w-3 h-3" />}
                                            </button>
                                            <span className={`text-sm truncate ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                                {todo.text}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteTodo(todo._id)}
                                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Campus News / Announcements */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center">
                            <Megaphone className="w-4 h-4 mr-2" /> Campus News
                        </h3>
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {/* We need to fetch announcements here or just link to the page. 
                               For simplicity, let's load them or just show a button to view all if not fetched.
                               Actually, let's just make it a big CTA card since we didn't add fetch logic in dashboard yet.
                           */}
                            <div className="text-center py-6">
                                <p className="text-gray-500 text-sm mb-4">Check for circulars, events, and important news.</p>
                                <button
                                    onClick={() => navigate('/student/announcements')}
                                    className="w-full py-2 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition"
                                >
                                    View Announcements
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Subject Grid */}
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <Book className="w-5 h-5 mr-2 text-gray-400" /> Your Subjects
                    </h3>

                    {loading ? (
                        <div className="text-center py-12 text-gray-400">Loading subjects...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subjects.map((sub, idx) => {
                                const stats = getSubjectStats(sub._id);
                                const lastMark = getSubjectMark(sub._id);

                                return (
                                    <div
                                        key={sub._id}
                                        onClick={() => navigate(`/student/subject/${sub._id}`)}
                                        className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-lg ${['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-pink-500'][idx % 4]}`}>
                                                {sub.name.charAt(0)}
                                            </div>
                                            <div className={`px-2 py-1 rounded text-xs font-bold ${stats.percentage >= 75 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                {stats.percentage}% Att.
                                            </div>
                                        </div>

                                        <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                            {sub.name}
                                        </h4>
                                        <p className="text-sm text-gray-500 mb-6">{sub.code}</p>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-400">Last Grade</span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {lastMark ? `${Math.round((lastMark.score / lastMark.maxScore) * 100)}%` : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <ChevronRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
