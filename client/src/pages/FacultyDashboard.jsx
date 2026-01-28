import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Clock, AlertCircle, CheckCircle, XCircle, LogOut, Upload, FileText, AlertTriangle, Megaphone, Calendar } from 'lucide-react';
import Logo from '../components/Logo';
import LetterPreviewModal from '../components/LetterPreviewModal';

export default function FacultyDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [myClassroom, setMyClassroom] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null); // For Modal

    // ... upload state ...
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        subjectId: '',
        title: '',
        file: null
    });

    useEffect(() => { /* ... existing fetchData logic ... */
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                // 1. Fetch Subjects
                const subRes = await fetch('http://localhost:5000/api/subjects', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const subData = await subRes.json();
                // Filter for subjects belonging to this faculty
                const mySubjects = subData.filter(sub => sub.faculty?._id === user._id || sub.faculty === user._id);
                setSubjects(mySubjects);

                // 2. Fetch Pending Approvals (OD/Leave)
                const odRes = await fetch('http://localhost:5000/api/od/list?status=Pending', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (odRes.ok) {
                    const odData = await odRes.json();
                    setPendingRequests(odData);
                }

                // 3. Fetch My Classroom (Class Teacher Role)
                const classRes = await fetch('http://localhost:5000/api/classroom/my-class', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (classRes.ok) {
                    const classData = await classRes.json();
                    setMyClassroom(classData);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user._id]);

    const handleApprovalAction = async (id, status) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:5000/api/od/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    status,
                    remarks: status === 'Approved' ? 'Approved via Dashboard' : 'Rejected via Dashboard'
                })
            });

            if (res.ok) {
                // Remove from local state
                setPendingRequests(prev => prev.filter(req => req._id !== id));
                setSelectedRequest(null); // Close modal
                alert(`Request ${status} successfully.`);
            } else {
                alert('Failed to update status.');
            }
        } catch (error) {
            console.error("Action Error:", error);
            alert("Error processing request.");
        }
    };

    // ... handleFileChange, handleQuickUpload ...
    const handleFileChange = (e) => {
        setUploadForm({ ...uploadForm, file: e.target.files[0] });
    };

    const handleQuickUpload = async (e) => {
        e.preventDefault();
        if (!uploadForm.subjectId || !uploadForm.file || !uploadForm.title) {
            alert("Please fill all fields");
            return;
        }

        setUploadLoading(true);
        const formData = new FormData();
        formData.append('title', uploadForm.title);
        formData.append('description', 'Quick upload from dashboard');
        formData.append('subjectId', uploadForm.subjectId);
        formData.append('file', uploadForm.file);
        formData.append('isPublic', 'true');

        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/notes', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }, // FormData sets Content-Type automatically
                body: formData
            });

            if (res.ok) {
                alert("File uploaded successfully!");
                setUploadForm({ ...uploadForm, title: '', file: null });
                // Reset file input manually if needed
            } else {
                const data = await res.json();
                alert(`Upload failed: ${data.message}`);
            }
        } catch (error) {
            console.error("Upload Error:", error);
            alert("Error uploading file.");
        } finally {
            setUploadLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Modal */}
            {selectedRequest && (
                <LetterPreviewModal
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    onAction={handleApprovalAction}
                />
            )}

            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Logo className="h-8 w-8 mr-2" />
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                                SmartCampus Faculty
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center cursor-pointer group" onClick={() => navigate('/profile')}>
                                <img
                                    className="h-8 w-8 rounded-full bg-gray-200 ring-2 ring-emerald-100 group-hover:ring-emerald-400 transition"
                                    src={`https://ui-avatars.com/api/?name=${user?.name}&background=10b981&color=fff`}
                                    alt=""
                                />
                                <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-emerald-600 hidden sm:block transition-colors">
                                    {user?.name}
                                </span>
                            </div>
                            <button
                                onClick={logout}
                                className="ml-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition flex items-center"
                            >
                                <LogOut className="w-4 h-4 mr-1" /> Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-fade-in-up">

                {/* Hero / Welcome */}
                <header className="mb-8 p-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-white shadow-lg relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform translate-x-12"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold">Good Evening, Professor!</h1>
                        <p className="text-emerald-50 mt-1 text-lg">You have <strong className="text-white">{pendingRequests.length} pending items</strong> requiring your attention today.</p>
                    </div>
                </header>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Subjects</p>
                                <p className="text-3xl font-black text-gray-900 mt-1">{subjects.length}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                                <BookOpen className="w-8 h-8" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">My Students</p>
                                <p className="text-3xl font-black text-gray-900 mt-1">120</p>
                            </div>
                            <div className="p-3 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors">
                                <Users className="w-8 h-8" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Pending Tasks</p>
                                <p className="text-3xl font-black text-gray-900 mt-1">{pendingRequests.length}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-100 transition-colors">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Col - Subjects & Class Management */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Class Teacher Section - NEW */}
                        {myClassroom && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4">
                                    <Users className="w-5 h-5 mr-2 text-purple-600" /> My Class (Class Teacher)
                                </h2>
                                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white overflow-hidden relative">
                                    <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                    <div className="relative z-10 flex justify-between items-center">
                                        <div>
                                            <p className="text-purple-200 text-sm font-bold uppercase tracking-wider mb-1">
                                                {myClassroom.department} Department
                                            </p>
                                            <h3 className="text-3xl font-bold">Semester {myClassroom.semester} - {myClassroom.section}</h3>
                                            <p className="mt-2 text-purple-100 flex items-center">
                                                <Users className="w-4 h-4 mr-2" /> {myClassroom.studentCount} Students
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => navigate('/faculty/class')}
                                            className="bg-white text-purple-600 px-6 py-2 rounded-xl font-bold hover:bg-purple-50 transition shadow-lg"
                                        >
                                            Manage Class
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4">
                                <BookOpen className="w-5 h-5 mr-2 text-emerald-600" /> My Subjects
                            </h2>

                            {loading ? (
                                <div className="text-center py-12 text-gray-400 animate-pulse">Loading subjects...</div>
                            ) : subjects.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
                                    No subjects assigned yet.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {subjects.map((sub, idx) => (
                                        <div
                                            key={sub._id}
                                            className="group bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-emerald-300 transition-all relative overflow-hidden flex flex-col"
                                        >
                                            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-emerald-400 to-teal-600"></div>
                                            <div
                                                className="p-6 cursor-pointer flex-1"
                                                onClick={() => navigate(`/faculty/subject/${sub._id}`)}
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-md ${['bg-emerald-500', 'bg-teal-500', 'bg-cyan-500'][idx % 3]}`}>
                                                        {sub.name.charAt(0)}
                                                    </div>
                                                    <span className="bg-gray-100 text-gray-600 py-1 px-3 rounded-full text-xs font-bold font-mono">
                                                        {sub.code}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors mb-1 truncate">
                                                    {sub.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 mb-4 font-medium">{sub.department} • Semester {sub.semester}</p>

                                                <div className="flex justify-between text-xs font-semibold text-gray-500">
                                                    <span className="flex items-center group-hover:text-emerald-600 transition-colors">
                                                        <Users className="w-4 h-4 mr-1" /> 60/60
                                                    </span>
                                                    <span className="flex items-center text-orange-500">
                                                        <AlertCircle className="w-4 h-4 mr-1" /> {pendingRequests.length > 0 ? pendingRequests.length : 0} Pending
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Quick Actions Footer - NEW */}
                                            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex space-x-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/faculty/attendance/${sub._id}`); }}
                                                    className="flex-1 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center justify-center"
                                                >
                                                    <Users className="w-3 h-3 mr-1" /> Attendance
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setUploadForm(prev => ({ ...prev, subjectId: sub._id })); }}
                                                    className="flex-1 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center"
                                                >
                                                    <FileText className="w-3 h-3 mr-1" /> Notes
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Col - Feed & Widgets */}
                    <div className="space-y-6">

                        {/* Quick Actions (Announcements & Events) */}
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                onClick={() => navigate('/faculty/announcements')}
                                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all"
                            >
                                <div className="p-3 bg-white/20 rounded-xl w-fit mb-3">
                                    <Megaphone className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-lg leading-tight mb-1">Make<br />Announcement</h3>
                                <p className="text-blue-100 text-xs">Post circulars & news.</p>
                            </div>

                            <div
                                onClick={() => navigate('/faculty/events')}
                                className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-5 text-white cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all"
                            >
                                <div className="p-3 bg-white/20 rounded-xl w-fit mb-3">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-lg leading-tight mb-1">Book<br />Facility</h3>
                                <p className="text-purple-100 text-xs">Auditorium & Halls.</p>
                            </div>
                        </div>

                        {/* Approvals Widget */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="font-bold text-gray-800 flex items-center">
                                    <Clock className="w-4 h-4 mr-2 text-emerald-600" /> Approvals
                                </h3>
                                <button
                                    onClick={() => navigate('/faculty/approvals')}
                                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wide"
                                >
                                    View All
                                </button>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {pendingRequests.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500 text-sm">
                                        No pending requests.
                                    </div>
                                ) : (
                                    pendingRequests.map((req) => (
                                        <div
                                            key={req._id}
                                            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                                            onClick={() => setSelectedRequest(req)}
                                        >
                                            <div className="flex items-center space-x-3 mb-2">
                                                <div className={`w-8 h-8 rounded-full ${req.type === 'OD' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'} flex items-center justify-center text-xs font-bold`}>
                                                    {req.student?.name?.charAt(0) || 'S'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 leading-tight">
                                                        {req.student?.name || 'Student'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {new Date(req.dates[0]).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Reason Line */}
                                            <p className="text-sm text-gray-800 line-clamp-1 mb-3 pl-11">
                                                {req.reason}
                                            </p>

                                            <div className="flex space-x-2 pl-11">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleApprovalAction(req._id, 'Approved'); }}
                                                    className="flex-1 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100 flex items-center justify-center"
                                                >
                                                    <CheckCircle className="w-3 h-3 mr-1" /> Approve
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleApprovalAction(req._id, 'Rejected'); }}
                                                    className="flex-1 py-1.5 bg-red-50 text-red-700 text-xs font-bold rounded-lg hover:bg-red-100 flex items-center justify-center"
                                                >
                                                    <XCircle className="w-3 h-3 mr-1" /> Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Today's Schedule */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-bold text-gray-800 flex items-center">
                                    <Clock className="w-4 h-4 mr-2 text-indigo-600" /> Today's Schedule
                                </h3>
                            </div>
                            <div className="p-4">
                                <div className="space-y-4">
                                    {[
                                        { time: '09:30 AM', subject: 'Advanced Web Dev', type: 'Lecture', room: 'Lab 3' },
                                        { time: '11:00 AM', subject: 'Data Structures', type: 'Lab', room: 'Lab 1' },
                                        { time: '02:00 PM', subject: 'Cloud Computing', type: 'Lecture', room: 'CR-402' }
                                    ].map((cls, idx) => (
                                        <div key={idx} className="flex items-start">
                                            <div className="w-16 flex-shrink-0 text-xs font-bold text-gray-500 pt-1">{cls.time}</div>
                                            <div className="flex-1 pb-4 border-l-2 border-indigo-100 pl-4 relative">
                                                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white"></div>
                                                <h4 className="font-bold text-gray-900 text-sm">{cls.subject}</h4>
                                                <p className="text-xs text-gray-500">{cls.type} • {cls.room}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Needs Grading */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                <h3 className="font-bold text-gray-800 flex items-center">
                                    <CheckCircle className="w-4 h-4 mr-2 text-orange-500" /> Needs Grading
                                </h3>
                                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">5 New</span>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {[
                                    { title: 'React Components Assignment', subject: 'Advanced Web Dev', due: 'Yesterday', count: 12 },
                                    { title: 'Binary Trees Implementation', subject: 'Data Structures', due: '2 days ago', count: 8 }
                                ].map((item, idx) => (
                                    <div key={idx} className="p-4 hover:bg-gray-50 transition flex justify-between items-center group cursor-pointer">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                                            <p className="text-xs text-gray-500">{item.subject} • Due {item.due}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-lg font-bold text-gray-800">{item.count}</span>
                                            <span className="text-xs text-gray-400">Submissions</span>
                                        </div>
                                    </div>
                                ))}
                                <div className="p-3 bg-gray-50 text-center">
                                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Go to Gradebook</button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Upload Widget */}
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg p-6 text-white">
                            <h3 className="font-bold text-lg mb-4 flex items-center">
                                <Upload className="w-5 h-5 mr-2" /> Quick Upload Notes
                            </h3>
                            <form onSubmit={handleQuickUpload} className="space-y-3">
                                <div>
                                    <label className="text-xs font-medium text-indigo-100 uppercase">Subject</label>
                                    <select
                                        className="w-full mt-1 p-2 bg-white/10 border border-white/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/50"
                                        value={uploadForm.subjectId}
                                        onChange={(e) => setUploadForm({ ...uploadForm, subjectId: e.target.value })}
                                        style={{ color: 'black' }}
                                    >
                                        <option value="">Select Subject</option>
                                        {subjects.map(s => (
                                            <option key={s._id} value={s._id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-indigo-100 uppercase">Material Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Unit 1 Lecture Notes"
                                        className="w-full mt-1 p-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        value={uploadForm.title}
                                        onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-indigo-100 uppercase">File (PDF/PPT/IMG)</label>
                                    <input
                                        type="file"
                                        className="w-full mt-1 text-xs text-indigo-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white file:text-indigo-700 hover:file:bg-indigo-50"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={uploadLoading}
                                    className="w-full py-2 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-colors shadow-lg mt-2 disabled:opacity-70"
                                >
                                    {uploadLoading ? 'Uploading...' : 'Upload Material'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
