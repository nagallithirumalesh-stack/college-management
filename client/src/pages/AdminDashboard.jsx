import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Activity, Settings, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';
import Logo from '../components/Logo';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Mock Stats - In real app, fetch these from an endpoint like /api/admin/stats
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalFaculty: 0,
        totalSubjects: 0,
        activeSessions: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('token');
            try {
                // Fetching individual counts as a poor man's stats API
                const subRes = await fetch('http://localhost:5000/api/subjects', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const subData = await subRes.json();

                const facRes = await fetch('http://localhost:5000/api/subjects/faculties', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const facData = await facRes.json();

                setStats({
                    totalStudents: 120, // Mock
                    totalFaculty: facData.length,
                    totalSubjects: subData.length,
                    activeSessions: 15 // Mock
                });
            } catch (error) {
                console.error("Error loading stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center">
            <div className={`p-3 rounded-full mr-4 ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : value}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
                <div className="p-6 flex items-center">
                    <Logo className="h-8 w-8 mr-2" />
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                        Admin Portal
                    </h1>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <button onClick={() => navigate('/admin')} className="w-full flex items-center px-4 py-3 bg-slate-800 text-white rounded-lg transition-colors">
                        <Activity className="w-5 h-5 mr-3 text-blue-400" />
                        Dashboard
                    </button>
                    <button onClick={() => navigate('/admin/subjects')} className="w-full flex items-center px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <BookOpen className="w-5 h-5 mr-3" />
                        Subjects
                    </button>
                    <button onClick={() => navigate('/admin/events')} className="w-full flex items-center px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <Calendar className="w-5 h-5 mr-3" />
                        Events
                    </button>
                    <button onClick={() => navigate('/admin/users')} className="w-full flex items-center px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <Users className="w-5 h-5 mr-3" />
                        Users
                    </button>
                    <button onClick={() => { }} className="w-full flex items-center px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <Settings className="w-5 h-5 mr-3" />
                        Settings
                    </button>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button onClick={logout} className="flex items-center text-slate-400 hover:text-red-400 transition-colors">
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Overiew</h2>
                        <p className="text-gray-500">Welcome back, Administrator.</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-600">{user?.name}</span>
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            A
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Total Students" value={stats.totalStudents} icon={Users} color="bg-blue-500" />
                    <StatCard title="Total Faculty" value={stats.totalFaculty} icon={Users} color="bg-emerald-500" />
                    <StatCard title="Total Subjects" value={stats.totalSubjects} icon={BookOpen} color="bg-purple-500" />
                    <StatCard title="Active Sessions" value={stats.activeSessions} icon={Activity} color="bg-orange-500" />
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Registrations (Mock) */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800">Recent Registrations</h3>
                            <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold mr-4">
                                            S
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Student Name {i}</p>
                                            <p className="text-xs text-gray-500">Computer Science • Batch 2026</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">2h ago</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* System Health / Quick Actions */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/admin/subjects')}
                                    className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                                >
                                    <span className="font-medium">Add New Subject</span>
                                    <BookOpen className="w-4 h-4" />
                                </button>
                                <button className="w-full flex items-center justify-between p-3 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition">
                                    <span className="font-medium">Approve Faculty</span>
                                    <Users className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center mb-4">
                                <TrendingUp className="w-5 h-5 text-emerald-400 mr-2" />
                                <h3 className="font-bold">System Health</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-1 text-slate-400">
                                        <span>Server Load</span>
                                        <span>24%</span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '24%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1 text-slate-400">
                                        <span>Database</span>
                                        <span>Healthy</span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '98%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

