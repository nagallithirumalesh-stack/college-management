import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, Mail, BookOpen, Award, Shield, LogOut, Camera, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleEnrollIdentity = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/identity/enroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({})
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message);
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Identity Error:", error);
        }
    };

    // 1. Loading State
    if (!user) return (
        <div className="min-h-screen flex items-center justify-center text-indigo-600 font-bold animate-pulse">
            Loading profile...
        </div>
    );

    // 2. Safe Data Extraction (Prevents crashes if fields are missing)
    const name = user.name || 'User';
    const email = user.email || '';
    const username = user.username || (email && email.includes('@') ? email.split('@')[0] : 'user');
    const role = user.role || 'student';
    const department = user.department || 'General';
    const semester = user.semester || 'N/A';
    const points = user.points || 0;
    const band = user.band || 'Bronze';
    const isIdentityVerified = !!user.isIdentityVerified;
    const userId = user._id || 'unknown';

    const getRoleBadgeColor = (r) => {
        switch (r) {
            case 'student': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'faculty': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'admin': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50 font-sans pb-12">
            {/* Navbar / Header Area */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200/50">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors group"
                    >
                        <div className="p-2 rounded-full group-hover:bg-indigo-50 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="font-medium ml-1">Back</span>
                    </button>
                    <h1 className="ml-auto text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        My Profile
                    </h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-8">

                {/* Main Profile Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 overflow-hidden border border-white/50 relative">

                    {/* Decorative Background Pattern */}
                    <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute top-10 -left-10 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl"></div>
                    </div>

                    <div className="relative px-8 pt-24 pb-12">
                        {/* Avatar Image */}
                        <div className="absolute -top-16 left-8">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white overflow-hidden flex items-center justify-center text-5xl font-bold text-indigo-600">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff&size=128&bold=true`}
                                        alt={name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button className="absolute bottom-1 right-1 p-2 bg-gray-900/80 text-white rounded-full hover:bg-black transition shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-200">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Name & Role */}
                        <div className="ml-40 pt-2 flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">{name}</h2>
                                <div className="flex items-center mt-2 space-x-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getRoleBadgeColor(role)}`}>
                                        {role}
                                    </span>
                                    <span className="text-gray-500 text-sm font-medium flex items-center">
                                        <Mail className="w-4 h-4 mr-1.5 text-gray-400" />
                                        {email || 'No Email'}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <button onClick={handleLogout} className="px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-semibold rounded-xl text-sm transition-all flex items-center shadow-sm border border-red-100">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign Out
                                </button>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">

                            {/* Academic Details - Premium Card */}
                            <div className="group bg-slate-50 hover:bg-white p-6 rounded-2xl border border-slate-200/60 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
                                <div className="flex items-center mb-6">
                                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <h3 className="ml-4 text-lg font-bold text-gray-800">Academic Profile</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                                        <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Department</span>
                                        <span className="text-base font-bold text-slate-800">{department}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                                        <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                                            {role === 'faculty' ? 'Designation' : 'Current Semester'}
                                        </span>
                                        <span className="text-base font-bold text-slate-800">
                                            {role === 'faculty' ? 'Professor' : `Sem ${semester}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                                        <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Username</span>
                                        <span className="text-base font-bold text-slate-800 font-mono">@{username}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Gamification / Stats - Premium Card */}
                            {role === 'student' && (
                                <div className="group bg-gradient-to-br from-amber-50 to-orange-50 hover:from-white hover:to-white p-6 rounded-2xl border border-amber-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
                                    <div className="flex items-center mb-6">
                                        <div className="p-3 bg-amber-100 text-amber-600 rounded-xl group-hover:scale-110 group-hover:rotate-12 transition-transform">
                                            <Award className="w-6 h-6" />
                                        </div>
                                        <h3 className="ml-4 text-lg font-bold text-gray-800">Achievements</h3>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1 bg-white p-4 rounded-xl border border-amber-100/50 shadow-sm text-center transform hover:-translate-y-1 transition-transform">
                                            <p className="text-xs font-bold text-amber-500 uppercase">Rank Band</p>
                                            <p className="text-2xl font-black text-gray-800 mt-1">{band}</p>
                                        </div>
                                        <div className="flex-1 bg-white p-4 rounded-xl border border-amber-100/50 shadow-sm text-center transform hover:-translate-y-1 transition-transform delay-75">
                                            <p className="text-xs font-bold text-amber-500 uppercase">XP Points</p>
                                            <p className="text-2xl font-black text-gray-800 mt-1">{points}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 p-3 bg-white/60 rounded-lg text-xs text-amber-800 text-center font-medium border border-amber-100">
                                        <Sparkles className="w-3 h-3 inline mr-1" />
                                        You are top 15% in your class!
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Security Section - Full Width */}
                        <div className="mt-8">
                            <div className="bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="bg-slate-50 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between group hover:bg-slate-100/80 transition-colors">
                                    <div className="flex items-center mb-4 md:mb-0">
                                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl mr-4">
                                            <Shield className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">AI Security</h3>
                                            <p className="text-sm text-gray-500">Manage your Face Identity for secure campus access.</p>
                                        </div>
                                    </div>

                                    {isIdentityVerified ? (
                                        <div className="flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-bold border border-emerald-200">
                                            <Shield className="w-4 h-4 mr-2" /> Verified ID Active
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleEnrollIdentity}
                                            className="px-6 py-3 bg-indigo-600 from-indigo-600 to-purple-600 bg-gradient-to-r hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transform hover:scale-105 transition-all flex items-center"
                                        >
                                            <Camera className="w-4 h-4 mr-2" /> Enroll Face ID
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <p className="text-center text-gray-400 text-xs mt-12 mb-8">
                    SmartCampus ID: {userId} • v2.4.0
                </p>
            </div>
        </div>
    );
}
