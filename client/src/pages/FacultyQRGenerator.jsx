import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { ArrowLeft, RefreshCw, MapPin, Loader, StopCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function FacultyQRGenerator() {
    const { id: subjectId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
    const [refreshKey, setRefreshKey] = useState(0);
    const [attendeeCount, setAttendeeCount] = useState(0);

    // Poll for updates
    useEffect(() => {
        if (!session || !session._id) return;

        const interval = setInterval(async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`http://localhost:5000/api/attendance/report/${session._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setAttendeeCount(data.length);
                }
            } catch (e) {
                console.error("Polling error", e);
            }
        }, 3000); // Poll every 3 seconds

        return () => clearInterval(interval);
    }, [session]);

    // Fetch existing or start new session
    const startSession = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            // Get location for geofence (optional, defaulting to Bangalore if failed/denied for now)
            // ideally we ask faculty for location

            const res = await fetch('http://localhost:5000/api/attendance/session/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    subjectId,
                    latitude: 12.9716, // Mock default for ease, or use navigator.geolocation
                    longitude: 77.5946,
                    radius: 200 // meters
                })
            });
            const data = await res.json();
            if (res.ok) {
                setSession(data);
                if (data.expiresAt) {
                    const expiry = new Date(data.expiresAt).getTime();
                    const now = new Date().getTime();
                    setTimeLeft(Math.max(0, Math.floor((expiry - now) / 1000)));
                } else {
                    setTimeLeft(600);
                }
            } else {
                alert("Failed to start session: " + data.error);
            }
        } catch (error) {
            console.error(error);
            alert("Error starting session");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        startSession();

        // Timer countdown
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [refreshKey]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-emerald-600 p-4 flex items-center justify-between text-white">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full transition">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-bold">Attendance Session</h1>
                    <div className="w-10"></div>
                </div>

                <div className="p-8 flex flex-col items-center text-center">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center">
                            <Loader className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
                            <p className="text-gray-500 font-medium">Generating Session...</p>
                        </div>
                    ) : session ? (
                        <>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">Scan to Mark Presence</h2>
                                <p className="text-gray-500 text-sm">Valid for {formatTime(timeLeft)}</p>
                            </div>

                            <div className="bg-white p-4 rounded-xl border-4 border-emerald-100 shadow-inner mb-6">
                                {/* The QR Code Value is simply the secure random code generated by server */}
                                {timeLeft > 0 ? (
                                    <QRCode
                                        value={session.qrCode}
                                        size={220}
                                        fgColor="#059669"
                                    />
                                ) : (
                                    <div className="w-[220px] h-[220px] bg-gray-100 flex items-center justify-center rounded-lg">
                                        <div className="text-gray-400 font-bold">EXPIRED</div>
                                    </div>
                                )}
                            </div>

                            <div className="w-full space-y-3">
                                <div className="flex items-center justify-center space-x-4">
                                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                                        <span>Geofence: <strong>200m</strong></span>
                                    </div>
                                    <div className="flex items-center text-sm text-emerald-800 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                                        <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                                        <span>Joined: <strong>{attendeeCount}</strong></span>
                                    </div>
                                </div>

                                <div className="text-xs text-gray-400 font-mono">
                                    Session ID: {session.qrCode}
                                </div>
                            </div>

                            {/* Live attendee list preview (optional/small) */}
                            {attendeeCount > 0 && (
                                <div className="w-full mt-4 bg-gray-50 rounded-lg p-2 max-h-24 overflow-y-auto">
                                    <p className="text-xs text-gray-400 mb-1">Latest scans:</p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {[...Array(Math.min(attendeeCount, 5))].map((_, i) => (
                                            <span key={i} className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {timeLeft === 0 && (
                                <button
                                    onClick={() => setRefreshKey(k => k + 1)}
                                    className="mt-6 flex items-center justify-center w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
                                >
                                    <RefreshCw className="w-5 h-5 mr-2" /> Start New Session
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="text-red-500 font-medium">Failed to load session.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
