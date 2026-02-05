import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Calendar, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import Logo from '../components/Logo';

export default function LeaveLetter() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        type: 'Leave', // Leave, OD, Permission
        addressee: 'Head of Department', // Default
        startDate: '',
        endDate: '',
        subjectId: '', // Optional: specific subject or null for general
        reason: '',
        purpose: 'Personal / Family', // Default 
        documentUrl: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [history, setHistory] = useState([]);

    const purposes = [
        "Medical / Sick",
        "Personal / Family",
        "Academic / Event",
        "On-Duty (External)",
        "Other"
    ];

    useEffect(() => {
        const fetchSubjects = async () => {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/subjects', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) setSubjects(await res.json());
        };

        const fetchHistory = async () => {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/od/my', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) setHistory(await res.json());
        };

        fetchSubjects();
        fetchHistory();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.reason || !formData.startDate) return;

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const dates = [formData.startDate];
            if (formData.endDate && formData.endDate !== formData.startDate) {
                dates.push(formData.endDate);
            }

            const res = await fetch('http://localhost:5000/api/od', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    type: formData.type,
                    purpose: formData.purpose,
                    reason: formData.reason,
                    dates: dates,
                    targetSubjectId: formData.subjectId || null,
                    documentUrl: formData.documentUrl
                })
            });

            if (res.ok) {
                alert('Request Sent Successfully!');
                setFormData({ ...formData, reason: '', startDate: '', endDate: '' });
                // Refresh history
                const histRes = await fetch('http://localhost:5000/api/od/my', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (histRes.ok) setHistory(await histRes.json());
            } else {
                const data = await res.json();
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to send request');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper for letter date format
    const formatDate = (dateString) => {
        if (!dateString) return '___________';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center cursor-pointer hover:opacity-80 transition" onClick={() => navigate('/student')}>
                    <ArrowLeft className="w-5 h-5 mr-3 text-gray-500" />
                    <Logo className="h-8 w-8 mr-2" />
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                        Leave / OD Request
                    </h1>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Input Form */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-blue-600" /> Compose Request
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">To (Addressee)</label>
                                    <select
                                        name="addressee"
                                        value={formData.addressee}
                                        onChange={handleChange}
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="Class Teacher">Class Teacher</option>
                                        <option value="Head of Department">Head of Department</option>
                                        <option value="Principal">The Principal</option>
                                        <option value="Lab In-Charge">Lab In-Charge</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="Leave">Leave of Absence</option>
                                        <option value="OD">On-Duty (OD)</option>
                                        <option value="Permission">Permission</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose / Category</label>
                                <select
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {purposes.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject (Optional)</label>
                                <select
                                    name="subjectId"
                                    value={formData.subjectId}
                                    onChange={handleChange}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">-- Apply to All --</option>
                                    {subjects.map(sub => (
                                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        required
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date (Optional)</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason / Letter Body</label>
                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    rows="6"
                                    required
                                    placeholder="I am writing to request..."
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                ></textarea>
                                <p className="text-xs text-gray-400 mt-1">This text will appear in the formal letter preview.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                {isSubmitting ? 'Sending Request...' : 'Submit Request'}
                            </button>
                        </form>
                    </div>

                    {/* History List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <Clock className="w-5 h-5 mr-2 text-gray-400" /> Request History
                        </h2>
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {history.length === 0 ? (
                                <p className="text-gray-400 text-sm">No past requests.</p>
                            ) : (
                                history.map(req => (
                                    <div key={req.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center group hover:bg-white hover:shadow-xs transition">
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-2 py-0.5 text-xs font-bold rounded ${req.type === 'OD' ? 'bg-purple-100 text-purple-700' :
                                                    req.type === 'Permission' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {req.type}
                                                </span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {req.dates && req.dates.length > 0 ? new Date(req.dates[0]).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 truncate max-w-[200px] font-medium">{req.purpose || 'General'}</p>
                                            <p className="text-xs text-gray-400 truncate max-w-[200px]">{req.reason || 'No reason provided'}</p>
                                        </div>
                                        <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                            req.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {req.status === 'Approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                                            {req.status === 'Rejected' && <XCircle className="w-3 h-3 mr-1" />}
                                            {req.status}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Live Letter Preview */}
                <div className="hidden lg:block">
                    <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-200 p-8 min-h-[600px] flex flex-col">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-8 text-center border-b pb-4">
                            Letter Preview
                        </h3>

                        {/* Letter Content */}
                        <div className="font-serif text-gray-800 leading-relaxed text-sm space-y-6 flex-1">
                            <div className="text-right">
                                <p>{formatDate(new Date().toISOString())}</p>
                            </div>

                            <div>
                                <p className="font-bold">To,</p>
                                <p>The {formData.addressee},</p>
                                <p>Smart Campus University.</p>
                            </div>

                            <div>
                                <p><span className="font-bold">From:</span> {user?.name} ({user?.userId || 'Student'})</p>
                            </div>

                            <div>
                                <p className="font-bold underline">
                                    Subject: Request for {formData.type === 'OD' ? 'On-Duty' : formData.type === 'Permission' ? 'Permission' : 'Leave'} ({formData.purpose}) - Reg.
                                </p>
                            </div>

                            <div>
                                <p>Respected Sir/Madam,</p>
                                <p className="mt-4 indent-8">
                                    I am writing to formally request {formData.type === 'OD' ? 'On-Duty permission' : formData.type === 'Permission' ? 'permission' : 'leave'}
                                    {formData.purpose ? ` on account of my ${formData.purpose.toLowerCase()}` : ''}
                                    {formData.type === 'Leave' ? ' from' : ' on'} <span className="font-semibold">{formatDate(formData.startDate)}</span>
                                    {formData.endDate && formData.endDate !== formData.startDate ? <span> to <span className="font-semibold">{formatDate(formData.endDate)}</span></span> : ''}.
                                </p>
                                <p className="mt-2 indent-8">
                                    {formData.reason || <span className="text-gray-300 italic">[Your reason will appear here...]</span>}
                                </p>
                                <p className="mt-4">
                                    I kindly request you to approve my application. I will ensure to catch up on any missed coursework.
                                </p>
                            </div>

                            <div className="mt-12">
                                <p>Thanking You,</p>
                                <p className="mt-8 font-bold">{user?.name}</p>
                                <p className="text-gray-500 text-xs">Student ID: {user?.userId}</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-gray-100 text-center">
                            <p className="text-xs text-gray-400">Generated by EdTrack Digital System</p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
