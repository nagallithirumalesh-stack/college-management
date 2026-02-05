import { useRef, useState, useEffect } from 'react';
import { Camera, CheckCircle, XCircle, Loader, RefreshCw } from 'lucide-react';

export default function FaceRecognition({ onVerified, studentId, studentName }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(null); // 'success', 'failed', null
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        startCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 640, height: 480 }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setError('');
        } catch (err) {
            setError('Camera access denied. Please enable camera permissions.');
            console.error('Camera error:', err);
        }
    };

    const captureAndVerify = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        setIsVerifying(true);
        setCountdown(3);

        // Countdown animation
        const countdownInterval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Wait for countdown
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Capture image
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        // Convert to blob
        canvas.toBlob(async (blob) => {
            try {
                // Send to backend for verification
                const formData = new FormData();
                formData.append('image', blob, 'face.jpg');
                formData.append('studentId', studentId);

                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/attendance/verify-face', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                });

                const data = await response.json();

                if (response.ok && data.verified) {
                    setVerificationStatus('success');
                    setTimeout(() => {
                        onVerified(true);
                    }, 1500);
                } else {
                    setVerificationStatus('failed');
                    setTimeout(() => {
                        setVerificationStatus(null);
                        setIsVerifying(false);
                    }, 2000);
                }
            } catch (error) {
                console.error('Verification error:', error);
                setVerificationStatus('failed');
                setTimeout(() => {
                    setVerificationStatus(null);
                    setIsVerifying(false);
                }, 2000);
            }
        }, 'image/jpeg', 0.95);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                    <div className="flex items-center justify-center mb-2">
                        <Camera className="w-8 h-8 mr-3" />
                        <h2 className="text-2xl font-bold">Face Verification</h2>
                    </div>
                    <p className="text-blue-100 text-center text-sm">
                        Verifying identity for <strong>{studentName}</strong>
                    </p>
                </div>

                {/* Camera View */}
                <div className="p-6">
                    <div className="relative rounded-2xl overflow-hidden bg-gray-900 mb-6">
                        {error ? (
                            <div className="aspect-video flex items-center justify-center bg-red-50 text-red-600 p-8 text-center">
                                <div>
                                    <XCircle className="w-12 h-12 mx-auto mb-3" />
                                    <p className="font-medium">{error}</p>
                                    <button
                                        onClick={startCamera}
                                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                                    >
                                        Retry
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full aspect-video object-cover"
                                />

                                {/* Face Detection Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-64 h-80 border-4 border-blue-500 rounded-3xl relative">
                                        {/* Corner indicators */}
                                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-3xl"></div>
                                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-3xl"></div>
                                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-3xl"></div>
                                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-3xl"></div>

                                        {/* Center text */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-xl">
                                                <p className="text-white text-sm font-bold">
                                                    {countdown > 0 ? `${countdown}...` : 'Position your face'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Verification Status Overlay */}
                                {verificationStatus && (
                                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center animate-in fade-in zoom-in duration-300">
                                        {verificationStatus === 'success' ? (
                                            <div className="text-center">
                                                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                                    <CheckCircle className="w-16 h-16 text-white" />
                                                </div>
                                                <p className="text-white text-2xl font-bold">Verified!</p>
                                                <p className="text-emerald-300 mt-2">Identity confirmed</p>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                                    <XCircle className="w-16 h-16 text-white" />
                                                </div>
                                                <p className="text-white text-2xl font-bold">Verification Failed</p>
                                                <p className="text-red-300 mt-2">Please try again</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Hidden canvas for capture */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Instructions */}
                    <div className="bg-blue-50 rounded-2xl p-4 mb-6">
                        <h3 className="font-bold text-blue-900 mb-2 flex items-center">
                            <Camera className="w-4 h-4 mr-2" />
                            Instructions
                        </h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Position your face within the frame</li>
                            <li>• Ensure good lighting</li>
                            <li>• Remove glasses if possible</li>
                            <li>• Look directly at the camera</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={captureAndVerify}
                            disabled={isVerifying || !stream || verificationStatus === 'success'}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isVerifying ? (
                                <>
                                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Verify Face
                                </>
                            )}
                        </button>

                        {verificationStatus === 'failed' && (
                            <button
                                onClick={() => {
                                    setVerificationStatus(null);
                                    setIsVerifying(false);
                                }}
                                className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Try Again
                            </button>
                        )}
                    </div>

                    {/* AI Badge */}
                    <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
                        <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-full border border-purple-100">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                            <span className="font-medium text-purple-700">AI-Powered Verification</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
