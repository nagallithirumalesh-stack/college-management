import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle, XCircle, Camera } from 'lucide-react';

export default function StudentQRScanner() {
    const navigate = useNavigate();
    const [scanResult, setScanResult] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, scanning, verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );

        scanner.render(onScanSuccess, onScanFailure);

        function onScanSuccess(decodedText) {
            scanner.clear();
            handleAttendance(decodedText);
        }

        function onScanFailure(error) {
            // handle scan failure, usually better to ignore frame errors
        }

        return () => {
            scanner.clear().catch(error => console.error("Failed to clear scanner", error));
        };
    }, []);

    const handleAttendance = async (qrCode) => {
        setStatus('verifying');
        setMessage('Verifying location...');

        if (!navigator.geolocation) {
            setStatus('error');
            setMessage('Geolocation is not supported by your browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                submitAttendance(qrCode, latitude, longitude);
            },
            (error) => {
                setStatus('error');
                setMessage('Location access denied. Cannot verify attendance.');
            }
        );
    };

    const submitAttendance = async (qrCode, lat, lon) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/attendance/mark-qr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    qrCode,
                    latitude: lat,
                    longitude: lon
                })
            });
            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(data.message || 'Attendance Marked Successfully!');
            } else {
                setStatus('error');
                setMessage(data.error || 'Attendance Failed');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Network Error: Could not reach server.');
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center z-10">
                <button onClick={() => navigate(-1)} className="p-2 bg-white/10 text-white rounded-full backdrop-blur-md">
                    <ArrowLeft className="w-6 h-6" />
                </button>
            </div>

            <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl">

                {/* Status Header */}
                <div className="p-6 text-center border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Scan Attendance</h2>
                    <p className="text-sm text-gray-500">Point your camera at the faculty's QR code</p>
                </div>

                {/* Scanner Area */}
                <div className="relative bg-gray-100 min-h-[300px] flex flex-col justify-center">
                    {status === 'idle' && (
                        <div id="reader" className="w-full"></div>
                    )}

                    {status === 'verifying' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                            <p className="font-bold text-indigo-900">Verifying Location & Token...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-50 z-20 p-6 text-center animate-in fade-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-emerald-900 mb-2">Marked!</h3>
                            <p className="text-emerald-700/80 mb-8">{message}</p>
                            <button onClick={() => navigate('/student')} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200">
                                Return to Dashboard
                            </button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 z-20 p-6 text-center animate-in fade-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <XCircle className="w-10 h-10 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-red-900 mb-2">Failed</h3>
                            <p className="text-red-700/80 mb-8">{message}</p>
                            <button onClick={() => window.location.reload()} className="w-full py-3 bg-white border border-red-200 text-red-600 rounded-xl font-bold mb-3">
                                Try Again
                            </button>
                            <button onClick={() => navigate('/student')} className="text-sm text-gray-400 font-medium">
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-50 text-xs text-center text-gray-400">
                    <div className="flex items-center justify-center mb-1">
                        <MapPin className="w-3 h-3 mr-1" /> Location access required
                    </div>
                    Ensure you are within the classroom geofence.
                </div>
            </div>
        </div>
    );
}
