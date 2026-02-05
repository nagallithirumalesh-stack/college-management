import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { useSearchParams } from 'react-router-dom';
import { Users, Clock, MapPin, AlertTriangle, Sparkles, XCircle, Loader2, Play } from 'lucide-react';

export default function FacultyQRGenerator() {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const subjectIdFromUrl = searchParams.get('subjectId');

    const [session, setSession] = useState(null);
    const [stats, setStats] = useState({ present: 0 });
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(subjectIdFromUrl || '');
    const [period, setPeriod] = useState('1');
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        // Fetch subjects
        fetch('http://localhost:5000/api/subjects', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => res.json())
            .then(data => setSubjects(data))
            .catch(console.error);

        // Get Location immediately
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        radius: 10
                    });
                },
                (err) => setError('Location access denied. Geo-fencing will be disabled.')
            );
        } else {
            setError('Geolocation not supported.');
        }
    }, []);

    // Timer logic
    useEffect(() => {
        let interval;
        if (session) {
            const updateTimer = () => {
                const expiryTime = new Date(session.createdAt).getTime() + (10 * 60 * 1000); // 10 minutes
                const remaining = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
                setTimeLeft(remaining);
                if (remaining <= 0) handleFinalizeSession();
            };
            updateTimer();
            interval = setInterval(updateTimer, 1000);
        }
        return () => clearInterval(interval);
    }, [session]);

    const handleStartSession = async () => {
        if (!selectedSubject) return setError('Select a subject');
        if (!location) return setError('Waiting for location...');

        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/attendance/session/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    subjectId: selectedSubject,
                    periodId: period,
                    type: 'QR',
                    location: location
                })
            });

            const data = await res.json();
            if (res.ok) {
                setSession(data);
                setError('');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to start session');
        } finally {
            setLoading(false);
        }
    };

    const handleFinalizeSession = () => {
        setSession(null);
        setTimeLeft(0);
        setStats({ present: 0 });
    };

    const selectedSubjectName = subjects.find(s => s.id == selectedSubject)?.name || '';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">QR Attendance</h1>
                        <p className="text-slate-500 text-sm font-medium">Generate QR code for students to scan</p>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                        <Users size={20} />
                        <span className="font-bold">{user.name}</span>
                    </div>
                </div>

                {!session ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Session Setup Form */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="text-indigo-600" size={20} />
                                <h3 className="font-black text-slate-800 text-lg">Session Setup</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Subject</label>
                                    <select
                                        value={selectedSubject}
                                        onChange={e => setSelectedSubject(e.target.value)}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                                    >
                                        <option value="">Choose Course...</option>
                                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Period</label>
                                    <select
                                        value={period}
                                        onChange={e => setPeriod(e.target.value)}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(p => <option key={p} value={p}>Period {p}</option>)}
                                    </select>
                                </div>

                                {location ? (
                                    <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 p-3 rounded-xl font-bold">
                                        <MapPin size={14} /> Location Ready (±{location.radius}m radius)
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-3 rounded-xl font-bold">
                                        <AlertTriangle size={14} /> Waiting for GPS...
                                    </div>
                                )}

                                {error && <div className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl">{error}</div>}
                            </div>

                            <button
                                onClick={handleStartSession}
                                disabled={loading || !location || !selectedSubject}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] text-lg"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Generating QR...
                                    </>
                                ) : (
                                    <>
                                        <Play size={20} />
                                        Start QR Session
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Preview Card */}
                        <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col items-center justify-center min-h-[400px]">
                            <div className="text-center text-slate-300 space-y-4">
                                <div className="w-24 h-24 mx-auto bg-slate-50 rounded-full flex items-center justify-center">
                                    <Clock size={40} className="text-slate-300" />
                                </div>
                                <p className="font-bold text-slate-400">QR Code will appear here</p>
                                <p className="text-xs text-slate-400">Start a session to generate QR code</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* QR Display */}
                        <div className="bg-white p-10 rounded-3xl border border-indigo-100 shadow-2xl shadow-indigo-100 flex flex-col items-center space-y-6 animate-in zoom-in duration-500">
                            <div className="text-center space-y-1">
                                <p className="text-xs uppercase font-black text-indigo-400 tracking-widest">Scan to Mark Attendance</p>
                                <h3 className="text-xl font-black text-slate-800">{selectedSubjectName}</h3>
                                <p className="text-sm text-slate-500">Period {period}</p>
                            </div>

                            <div className="p-6 bg-white border-4 border-indigo-50 rounded-3xl shadow-inner">
                                <QRCodeSVG
                                    value={JSON.stringify({
                                        sessionId: session.id,
                                        qrCode: session.qrCode,
                                        type: 'secure-attendance'
                                    })}
                                    size={250}
                                    level={"H"}
                                    includeMargin={true}
                                />
                            </div>

                            <div className="text-center bg-indigo-50 p-4 rounded-2xl w-full">
                                <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">Session Token</p>
                                <p className="font-mono text-2xl font-black text-indigo-900 tracking-widest">{session.qrCode}</p>
                            </div>

                            <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
                                <Sparkles size={16} className="animate-pulse" />
                                Active Session Live
                            </div>
                        </div>

                        {/* Stats & Timer */}
                        <div className="space-y-6">
                            {/* Timer Card */}
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 rounded-3xl shadow-2xl shadow-indigo-200 text-white">
                                <p className="text-xs uppercase font-black tracking-widest opacity-80 mb-2">Time Remaining</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-6xl font-mono font-black">
                                        {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                                    </p>
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                        <Clock className="animate-pulse" size={32} />
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-lg">
                                    <div className="text-4xl font-black text-green-600">{stats.present}</div>
                                    <div className="text-xs text-green-500 font-bold uppercase tracking-wider mt-1">Present</div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg">
                                    <div className="text-4xl font-black text-slate-700">10m</div>
                                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Range</div>
                                </div>
                            </div>

                            {/* Finalize Button */}
                            <button
                                onClick={handleFinalizeSession}
                                className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-100 active:scale-[0.98]"
                            >
                                <XCircle size={20} />
                                Finalize Session
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
