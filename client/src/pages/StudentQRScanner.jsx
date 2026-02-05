import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, X, CheckCircle, MapPin, XCircle, RotateCcw } from 'lucide-react';
import jsQR from 'jsqr';
import { useAuth } from '../context/AuthContext';

export default function StudentQRScanner() {
    const { user } = useAuth(); // Now properly imported
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // States
    const [scanResult, setScanResult] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, scanning, validating, success, error
    const [message, setMessage] = useState('');
    const [hasPermission, setHasPermission] = useState(null);

    // Start Camera on Mount
    // Start Camera on Mount
    useEffect(() => {
        let mounted = true;

        const initCamera = async () => {
            // Wait a bit to ensure clean mount
            await new Promise(r => setTimeout(r, 100));
            if (!mounted) return;

            setStatus('scanning');
            setMessage('');
            setScanResult(null);

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" }
                });

                if (mounted && videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.setAttribute("playsinline", true);

                    try {
                        await videoRef.current.play();

                        if (mounted) {
                            requestAnimationFrame(tick);
                            setHasPermission(true);
                        }
                    } catch (playError) {
                        // Ignore abort errors caused by rapid unmounting
                        if (playError.name !== 'AbortError') {
                            console.error("Video play error:", playError);
                        }
                    }
                } else {
                    // Cleanup if unmounted during setup
                    stream.getTracks().forEach(track => track.stop());
                }
            } catch (err) {
                if (mounted) {
                    console.error("Camera Error:", err);
                    setHasPermission(false);
                    setStatus('error');
                    setMessage('Camera access denied or not available.');
                }
            }
        };

        initCamera();

        return () => {
            mounted = false;
            stopScanner();
        };
    }, []);

    // Reuse stopScanner for cleanup
    const stopScanner = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const tick = () => {
        if (status === 'success' || status === 'validating') return; // Stop scanning if busy

        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const context = canvas.getContext("2d", { willReadFrequently: true });
            canvas.height = videoRef.current.videoHeight;
            canvas.width = videoRef.current.videoWidth;

            if (canvas.width > 0 && canvas.height > 0) {
                context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert",
                });

                if (code) {
                    console.log("QR Found:", code.data);
                    handleScan(code.data);
                    return; // Stop loop
                }
            }
        }
        requestAnimationFrame(tick);
    };

    const handleScan = (data) => {
        stopScanner(); // Stop camera
        setScanResult(data);
        setStatus('validating');
        processAttendance(data);
    };

    const processAttendance = (qrCode) => {
        if (!navigator.geolocation) {
            setStatus('error');
            setMessage('Geolocation is required but not supported.');
            return;
        }

        setMessage('Verifying location...');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;

                    let codeToSend = qrCode;
                    try {
                        const parsed = JSON.parse(qrCode);
                        if (parsed.qrCode) codeToSend = parsed.qrCode;
                    } catch (e) {
                        // Not JSON, send as is
                    }

                    const res = await fetch('http://localhost:5000/api/attendance/mark', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({
                            qrCode: codeToSend,
                            latitude,
                            longitude
                        })
                    });

                    const data = await res.json();

                    if (res.ok) {
                        setStatus('success');
                        setMessage(data.message || 'Attendance Marked Successfully!');
                        // Optional: Navigate away after delay
                        // setTimeout(() => navigate('/student'), 3000);
                    } else {
                        setStatus('error');
                        if (data.distance) {
                            setMessage(`${data.error} (Distance: ${Math.round(data.distance)}m)`);
                        } else {
                            setMessage(data.error || 'Attendance Failed');
                        }
                    }

                } catch (err) {
                    setStatus('error');
                    setMessage('Network Error: Could not connect to server.');
                }
            },
            (err) => {
                setStatus('error');
                setMessage('Location Access Denied. Please enable GPS.');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative min-h-[500px] flex flex-col">

                {/* Header */}
                <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center shadow-lg z-10">
                    <h1 className="text-xl font-black flex items-center justify-center gap-2">
                        <Camera className="w-6 h-6" /> Scan Class QR
                    </h1>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">

                    {/* Camera Feed */}
                    {(status === 'scanning' || status === 'idle') && (
                        <>
                            <video
                                ref={videoRef}
                                className="absolute inset-0 w-full h-full object-cover"
                                muted // Muted is required for autoplay
                            />
                            {/* Scanning Overlay UI */}
                            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                                <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative">
                                    <div className="absolute inset-0 border-4 border-indigo-500/50 rounded-3xl animate-pulse"></div>
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-2xl -mt-1 -ml-1"></div>
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-2xl -mt-1 -mr-1"></div>
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-2xl -mb-1 -ml-1"></div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-2xl -mb-1 -mr-1"></div>
                                    {/* Scan Line */}
                                    <div className="absolute w-full h-0.5 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,1)] top-1/2 -translate-y-1/2 animate-[scan_2s_ease-in-out_infinite]"></div>
                                </div>
                                <p className="mt-8 text-white/80 font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                                    Align QR Code within the frame
                                </p>
                            </div>
                        </>
                    )}

                    {/* Canvas (Hidden, used for processing) */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Loading / Validating State */}
                    {status === 'validating' && (
                        <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center p-8 space-y-6">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-indigo-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                                <MapPin className="absolute inset-0 m-auto text-indigo-600 w-8 h-8 animate-bounce" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">Verifying...</h3>
                                <p className="text-slate-500">{message}</p>
                            </div>
                        </div>
                    )}

                    {/* Success State */}
                    {status === 'success' && (
                        <div className="absolute inset-0 bg-emerald-50 z-20 flex flex-col items-center justify-center p-8 space-y-6 animate-in fade-in zoom-in duration-300">
                            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
                                <CheckCircle className="w-12 h-12" />
                            </div>
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-black text-slate-800">Success!</h2>
                                <p className="text-slate-600 text-lg font-medium max-w-[250px] mx-auto leading-tight">{message}</p>
                            </div>
                            <div className="pt-4">
                                <button
                                    onClick={() => navigate('/student')}
                                    className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-xl"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {status === 'error' && (
                        <div className="absolute inset-0 bg-red-50 z-20 flex flex-col items-center justify-center p-8 space-y-6 animate-in fade-in zoom-in duration-300">
                            <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-200">
                                <XCircle className="w-12 h-12" />
                            </div>
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-black text-slate-800">Failed</h2>
                                <p className="text-red-500 font-bold text-lg max-w-[250px] mx-auto">{message}</p>
                            </div>
                            <div className="pt-4">
                                <button
                                    onClick={handleRetry}
                                    className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-xl"
                                >
                                    <RotateCcw className="w-5 h-5" />
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer / Instructions */}
                <div className="bg-white p-4 text-center border-t border-slate-100">
                    <p className="text-xs text-slate-400 font-medium">
                        Powered by EdTrack Secure Attendance
                    </p>
                </div>
            </div>

            {/* Global style for custom scan animation */}
            <style>{`
                @keyframes scan {
                    0%, 100% { top: 10%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    50% { top: 90%; }
                }
            `}</style>
        </div>
    );
}
