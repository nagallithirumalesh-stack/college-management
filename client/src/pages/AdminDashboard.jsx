import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Activity, Settings, TrendingUp, AlertTriangle, Calendar, LogOut, Menu, X, User, Shield, Zap, Database } from 'lucide-react';
import Logo from '../components/Logo';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                const subRes = await fetch('http://localhost:5000/api/subjects', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const subData = await subRes.json();

                const facRes = await fetch('http://localhost:5000/api/subjects/faculties', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const facData = await facRes.json();

                // Fetch Fees Stats for Dashboard
                const feeRes = await fetch('http://localhost:5000/api/fees/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const feeData = await feeRes.json();

                setStats({
                    totalStudents: 120, // Mock for now
                    totalFaculty: facData.length,
                    totalSubjects: subData.length,
                    activeSessions: 15,
                    feesPending: feeData.totalPending,
                    feesCollected: feeData.totalCollected
                });
            } catch (error) {
                console.error("Error loading stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon: Icon, gradient, delay }) => (
        <div
            className="bg-surface p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-bold text-muted uppercase tracking-wider">{title}</p>
                    <p className="text-4xl font-black text-headings mt-2">{loading ? '...' : value}</p>
                </div>
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex font-sans relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/5 to-indigo-200/10 rounded-full blur-3xl -z-10"></div>
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-200/10 to-pink-200/10 rounded-full blur-3xl -z-10"></div>

            {/* Sidebar */}
            <aside className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white hidden lg:flex flex-col shadow-2xl relative overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

                <div className="p-6 flex items-center relative z-10 border-b border-white/10">
                    <Logo className="h-10 w-10 mr-3" />
                    <div>
                        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                            Admin Portal
                        </h1>
                        <p className="text-xs text-slate-400">System Management</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-6 relative z-10">
                    <button onClick={() => navigate('/admin')} className="w-full flex items-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105">
                        <Activity className="w-5 h-5 mr-3" />
                        <span className="font-bold">Dashboard</span>
                    </button>
                    <button onClick={() => navigate('/admin/subjects')} className="w-full flex items-center px-4 py-3 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl transition-all">
                        <BookOpen className="w-5 h-5 mr-3" />
                        Subjects
                    </button>
                    <button onClick={() => navigate('/admin/events')} className="w-full flex items-center px-4 py-3 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl transition-all">
                        <Calendar className="w-5 h-5 mr-3" />
                        Events
                    </button>
                    <button onClick={() => navigate('/admin/users')} className="w-full flex items-center px-4 py-3 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl transition-all">
                        <Users className="w-5 h-5 mr-3" />
                        Users
                    </button>
                    <button onClick={() => navigate('/admin/announcements')} className="w-full flex items-center px-4 py-3 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl transition-all">
                        <Shield className="w-5 h-5 mr-3" />
                        Announcements
                    </button>
                    <button onClick={() => navigate('/admin/system')} className="w-full flex items-center px-4 py-3 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl transition-all">
                        <Settings className="w-5 h-5 mr-3" />
                        Settings
                    </button>
                </nav>

                <div className="p-4 border-t border-white/10 relative z-10">
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg">
                            A
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">{user?.name}</p>
                            <p className="text-xs text-slate-400">Administrator</p>
                        </div>
                    </div>
                    <button onClick={logout} className="w-full flex items-center justify-center px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-all">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Mobile Header */}
                <div className="lg:hidden bg-white/70 backdrop-blur-xl border-b border-white/50 sticky top-0 z-50 shadow-sm">
                    <div className="px-4 py-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <Logo className="h-8 w-8 mr-2" />
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                Admin Portal
                            </span>
                        </div>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-xl text-gray-600 hover:bg-white/50 transition"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-lg">
                            <div className="px-4 py-3 space-y-1">
                                <button onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl flex items-center transition font-bold">
                                    <Activity className="w-5 h-5 mr-3" /> Dashboard
                                </button>
                                <button onClick={() => { navigate('/admin/subjects'); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl flex items-center transition">
                                    <BookOpen className="w-5 h-5 mr-3 text-blue-600" /> Subjects
                                </button>
                                <button onClick={() => { navigate('/admin/events'); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-xl flex items-center transition">
                                    <Calendar className="w-5 h-5 mr-3 text-purple-600" /> Events
                                </button>
                                <button onClick={() => { navigate('/admin/users'); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 text-gray-700 hover:bg-emerald-50 rounded-xl flex items-center transition">
                                    <Users className="w-5 h-5 mr-3 text-emerald-600" /> Users
                                </button>
                                <div className="border-t border-gray-200 my-2"></div>
                                <button onClick={logout} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl flex items-center transition font-medium">
                                    <LogOut className="w-5 h-5 mr-3" /> Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 lg:p-8">
                    {/* Header */}
                    <header className="mb-8 p-8 bg-surface rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden animate-in fade-in slide-in-from-top-4">
                        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-indigo-200/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <h2 className="text-4xl font-black text-headings">System Overview</h2>
                                <p className="text-secondary mt-2 text-lg font-medium">Welcome back, <strong className="text-primary">{user?.name}</strong></p>
                            </div>
                            <div className="hidden lg:flex items-center space-x-4">
                                <button
                                    onClick={logout}
                                    className="flex items-center px-4 py-2 bg-white text-red-600 hover:bg-red-50 rounded-xl font-bold transition shadow-sm border border-red-100 ring-1 ring-transparent hover:ring-red-200"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-white font-bold shadow-md text-xl">
                                    A
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard title="Total Students" value={stats.totalStudents} icon={Users} gradient="from-blue-500 to-cyan-500" delay={0} />
                        <StatCard title="Total Faculty" value={stats.totalFaculty} icon={Users} gradient="from-emerald-500 to-teal-500" delay={100} />
                        <StatCard title="Active Sessions" value={stats.activeSessions} icon={Activity} gradient="from-orange-500 to-red-500" delay={300} />
                        <div
                            onClick={() => navigate('/admin/fees')}
                            className="cursor-pointer bg-surface p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group animate-in fade-in slide-in-from-bottom-4"
                            style={{ animationDelay: '400ms' }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-muted uppercase tracking-wider">Fees Pending</p>
                                    <p className="text-2xl font-black text-danger mt-2">₹{(stats.feesPending || 0).toLocaleString()}</p>
                                    <p className="text-xs text-success font-bold mt-1">Col: ₹{(stats.feesCollected || 0).toLocaleString()}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-8 h-8" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Second Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Registrations */}
                        <div className="lg:col-span-2 bg-surface rounded-2xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '400ms' }}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-headings flex items-center">
                                    <Users className="w-5 h-5 mr-2 text-primary" />
                                    Recent Registrations
                                </h3>
                                <button className="text-sm text-primary hover:text-primary-hover font-bold">View All</button>
                            </div>
                            <div className="space-y-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-all group">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-white font-bold mr-4 shadow-sm group-hover:scale-110 transition-transform">
                                                S{i}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-headings">Student Name {i}</p>
                                                <p className="text-xs text-secondary">Computer Science • Batch 2026</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-muted font-medium">{i}h ago</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions & System Health */}
                        <div className="space-y-6">
                            <div className="bg-surface rounded-2xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '500ms' }}>
                                <h3 className="text-lg font-bold text-headings mb-4 flex items-center">
                                    <Zap className="w-5 h-5 mr-2 text-warning" />
                                    Quick Actions
                                </h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => navigate('/admin/subjects')}
                                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-md transition-all hover:scale-105"
                                    >
                                        <span className="font-bold">Add New Subject</span>
                                        <BookOpen className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => navigate('/admin/users')}
                                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-md transition-all hover:scale-105"
                                    >
                                        <span className="font-bold">Manage Users</span>
                                        <Users className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl p-6 text-white animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '600ms' }}>
                                <div className="flex items-center mb-4">
                                    <Database className="w-5 h-5 text-emerald-400 mr-2" />
                                    <h3 className="font-bold">System Health</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs mb-2 text-slate-400">
                                            <span>Server Load</span>
                                            <span className="text-emerald-400 font-bold">24%</span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                                            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full animate-pulse" style={{ width: '24%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-2 text-slate-400">
                                            <span>Database</span>
                                            <span className="text-blue-400 font-bold">Healthy</span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-2 text-slate-400">
                                            <span>API Response</span>
                                            <span className="text-purple-400 font-bold">Fast</span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                        </div>
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
