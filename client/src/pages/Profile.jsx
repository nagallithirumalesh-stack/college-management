import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, Mail, BookOpen, Award, Shield, LogOut, Camera, Sparkles, MapPin, Calendar, Smartphone, QrCode, Fingerprint, CheckSquare } from 'lucide-react';
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

    const [uploading, setUploading] = useState(false);
    const fileInputRef = React.useRef(null);
    const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || null);

    const handlePhotoClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('photo', file);

        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/auth/profile/photo', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();
            if (res.ok) {
                setProfilePhoto(data.photoUrl);
                alert('Profile photo updated successfully!');
            } else {
                alert(data.message || 'Upload failed');
            }
        } catch (err) {
            console.error(err);
            alert('Error uploaded photo');
        } finally {
            setUploading(false);
        }
    };

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-indigo-600 font-bold animate-pulse">
            Loading profile...
        </div>
    );

    const name = user.name || 'User';
    const email = user.email || '';
    const username = user.username || (email && email.includes('@') ? email.split('@')[0] : 'user');
    const role = user.role || 'student';
    const department = user.department || 'General';
    const semester = user.semester || 'N/A';
    const points = user.points || 0;
    const band = user.band || 'Bronze';
    const isIdentityVerified = !!user.isIdentityVerified;
    const userId = String(user.id || 'unknown');

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans pb-12 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-b-[3rem] shadow-2xl"></div>
            <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-40 left-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>

            {/* Navbar */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full transition-all"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Back to Dashboard</span>
                </button>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-red-100 hover:text-white bg-red-500/20 hover:bg-red-500/30 backdrop-blur-md px-4 py-2 rounded-full transition-all border border-red-500/30"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Sign Out</span>
                    </button>
                </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: ID Card & Quick Actions */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Digital ID Card */}
                        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                            <div className="flex flex-col items-center">

                                <div className="relative mb-4 group/avatar cursor-pointer" onClick={handlePhotoClick}>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg relative">
                                        <img
                                            src={profilePhoto || `https://ui-avatars.com/api/?name=${name}&background=fff&color=4f46e5&size=128&bold=true`}
                                            alt={name}
                                            className={`w-full h-full rounded-full object-cover border-4 border-white transition-opacity ${uploading ? 'opacity-50' : 'opacity-100'}`}
                                        />
                                        {uploading && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                            <Camera className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm z-10" title="Active Student">
                                        <CheckSquare className="w-3 h-3" />
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 text-center">{name}</h2>
                                <p className="text-indigo-600 font-medium text-sm mb-4">@{username}</p>

                                <div className="w-full space-y-3 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 flex items-center"><User className="w-4 h-4 mr-2" /> Role</span>
                                        <span className="font-semibold text-gray-900 capitalize bg-gray-100 px-2 py-0.5 rounded text-xs">{role}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 flex items-center"><Mail className="w-4 h-4 mr-2" /> Email</span>
                                        <span className="font-semibold text-gray-900 truncate max-w-[150px]">{email}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 flex items-center"><Fingerprint className="w-4 h-4 mr-2" /> ID</span>
                                        <span className="font-mono text-xs text-gray-400">{userId.substring(0, 8)}...</span>
                                    </div>
                                </div>

                                <div className="mt-6 w-full">
                                    <div className="p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center">
                                        <QrCode className="w-12 h-12 text-gray-400 opacity-50" />
                                        <div className="ml-3 text-xs text-gray-400">
                                            <p className="font-medium">Digital Campus ID</p>
                                            <p>Scan for access</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                            <h3 className="font-bold text-gray-900 flex items-center mb-4">
                                <Shield className="w-5 h-5 mr-2 text-emerald-500" /> Security
                            </h3>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl mb-4">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Face Identity</p>
                                    <p className="text-xs text-gray-500">{isIdentityVerified ? 'Biometrics enrolled' : 'Not configured'}</p>
                                </div>
                                {isIdentityVerified ? (
                                    <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                                        <Fingerprint className="w-5 h-5" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-lg flex items-center justify-center">
                                        <Fingerprint className="w-5 h-5" />
                                    </div>
                                )}
                            </div>

                            {!isIdentityVerified && (
                                <button
                                    onClick={handleEnrollIdentity}
                                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center shadow-lg shadow-indigo-200"
                                >
                                    <Camera className="w-4 h-4 mr-2" /> Setup Face ID
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Stats & Details */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-3xl p-6 shadow-lg border-l-4 border-indigo-500 flex items-center justify-between group hover:-translate-y-1 transition-transform">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Academic Standing</p>
                                    <h3 className="text-2xl font-black text-gray-900 mt-1">{department}</h3>
                                    <p className="text-xs text-indigo-500 font-semibold mt-1">Semester {semester}</p>
                                </div>
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                            </div>

                            {role === 'student' && (
                                <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-6 shadow-lg shadow-orange-200 text-white flex items-center justify-between group hover:-translate-y-1 transition-transform">
                                    <div>
                                        <p className="text-orange-100 text-sm font-medium">Gamification Rank</p>
                                        <h3 className="text-3xl font-black mt-1">{band}</h3>
                                        <p className="text-orange-100 text-xs font-semibold mt-1 flex items-center">
                                            <Sparkles className="w-3 h-3 mr-1" /> {points} XP Earned
                                        </p>
                                    </div>
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
                                        <Award className="w-8 h-8" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Detailed Info */}
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-lg text-gray-900">Personal Information</h3>
                                <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">Edit Details</button>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Full Name</label>
                                    <div className="flex items-center text-gray-900 font-medium">
                                        <User className="w-5 h-5 mr-3 text-indigo-500" /> {name}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Username</label>
                                    <div className="flex items-center text-gray-900 font-medium">
                                        <Smartphone className="w-5 h-5 mr-3 text-indigo-500" /> @{username}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Email Address</label>
                                    <div className="flex items-center text-gray-900 font-medium">
                                        <Mail className="w-5 h-5 mr-3 text-indigo-500" /> {email}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Campus Status</label>
                                    <div className="flex items-center text-emerald-600 font-medium">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-3 animate-pulse"></span> Active
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Department</label>
                                    <div className="flex items-center text-gray-900 font-medium">
                                        <BookOpen className="w-5 h-5 mr-3 text-indigo-500" /> {department}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Joined Date</label>
                                    <div className="flex items-center text-gray-900 font-medium">
                                        <Calendar className="w-5 h-5 mr-3 text-indigo-500" /> September 2023
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
                            <div className="relative z-10 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Need Help?</h3>
                                    <p className="text-indigo-200 text-sm max-w-md">Contact the administration if you need to update any locked information in your profile.</p>
                                </div>
                                <button className="px-5 py-2 bg-white text-indigo-900 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
                                    Contact Admin
                                </button>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
