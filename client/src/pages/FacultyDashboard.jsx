import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Clock, AlertCircle, CheckCircle, XCircle, LogOut, Upload, FileText, AlertTriangle, Megaphone, Calendar, Menu, X, User } from 'lucide-react';
import Logo from '../components/Logo';
import LetterPreviewModal from '../components/LetterPreviewModal';

export default function FacultyDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [myClassroom, setMyClassroom] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [todaySchedule, setTodaySchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [feeDefaulters, setFeeDefaulters] = useState(0);

    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        subjectId: '',
        title: '',
        file: null
    });

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const subRes = await fetch('http://localhost:5000/api/subjects', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const subData = await subRes.json();
                const mySubjects = subData.filter(sub => sub.faculty?.id === user.id || sub.facultyId === user.id);
                setSubjects(mySubjects);

                const odRes = await fetch('http://localhost:5000/api/od/list?status=Pending', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (odRes.ok) {
                    const odData = await odRes.json();
                    setPendingRequests(odData);
                }

                const classRes = await fetch('http://localhost:5000/api/classroom/my-class', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (classRes.status === 403 || classRes.status === 401) {
                    console.error("Auth Error on Classroom Fetch");
                    // Optionally force logout here or set UI state
                }

                if (classRes.ok) {
                    const classData = await classRes.json();
                    setMyClassroom(classData);

                    if (classData) {
                        // Fetch students for my class to count defaulters
                        const studRes = await fetch('http://localhost:5000/api/classroom/students', {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        if (studRes.ok) {
                            const studData = await studRes.json();
                            const defaulters = studData.filter(s => s.feeStatus === 'OVERDUE' || s.feeStatus === 'PENDING').length;
                            setFeeDefaulters(defaulters);
                        }
                    }
                }

                // Fetch Teaching Schedule
                const schedRes = await fetch('http://localhost:5000/api/timetable/teaching', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (schedRes.status === 403 || schedRes.status === 401) {
                    console.error("Auth Error on Timetable Fetch");
                }

                if (schedRes.ok) {
                    const allSlots = await schedRes.json();
                    const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                    setTodaySchedule(allSlots.filter(s => s.day === todayName).sort((a, b) => a.startTime.localeCompare(b.startTime)));
                }

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user.id]);

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
                setPendingRequests(prev => prev.filter(req => req.id !== id));
                setSelectedRequest(null);
                alert(`Request ${status} successfully.`);
            } else {
                alert('Failed to update status.');
            }
        } catch (error) {
            console.error("Action Error:", error);
            alert("Error processing request.");
        }
    };

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
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                alert("File uploaded successfully!");
                setUploadForm({ ...uploadForm, title: '', file: null });
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
        <div className="flex flex-col h-full bg-background font-sans text-secondary">
            {selectedRequest && (
                <LetterPreviewModal
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    onAction={handleApprovalAction}
                />
            )}

            {/* Navbar (Mobile Only - Desktop uses Sidebar) */}
            <div className="md:hidden bg-surface border-b border-gray-200 sticky top-0 z-50 px-4 py-3 flex justify-between items-center shadow-sm">
                <div className="flex items-center">
                    <Logo className="h-8 w-8 mr-2 text-primary" />
                    <span className="text-lg font-bold text-headings">EdTrack</span>
                </div>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-secondary">
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-surface border-b border-gray-200 z-40 fixed w-full top-[57px]">
                    <div className="flex flex-col p-4 space-y-2">
                        {/* Simplified for brevity - reuse logic if needed or rely on Sidebar content */}
                        <button onClick={logout} className="flex items-center text-danger font-bold py-2"><LogOut className="w-4 h-4 mr-2" /> Sign Out</button>
                    </div>
                </div>
            )}


            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Header - Clean White */}
                <header className="bg-surface p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-headings tracking-tight">
                            Good Evening, <span className="text-primary">{user?.name?.split(' ')[0]}</span>
                        </h1>
                        <p className="text-secondary mt-1 max-w-2xl">
                            Manage your classes, approve requests, and track student performance.
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-3">
                        <div className="text-right hidden md:block">
                            <p className="text-xs font-bold uppercase text-muted tracking-wider">Current Role</p>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-100">
                                Faculty
                            </span>
                        </div>
                    </div>
                </header>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stat Card 1 */}
                    <div className="bg-surface p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-muted uppercase tracking-wider">Total Subjects</p>
                                <p className="text-3xl font-bold text-headings mt-2">{subjects.length}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                                <BookOpen className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div
                        className="bg-surface p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group"
                        onClick={() => navigate('/faculty/class-teacher')}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-muted uppercase tracking-wider group-hover:text-warning transition-colors">Fee Defaulters</p>
                                <p className={`text-3xl font-bold mt-2 ${feeDefaulters > 0 ? 'text-danger' : 'text-success'}`}>
                                    {feeDefaulters}
                                </p>
                                <p className="text-[10px] text-muted">Action Required</p>
                            </div>
                            <div className={`p-3 rounded-xl ${feeDefaulters > 0 ? 'bg-red-50 text-danger' : 'bg-green-50 text-success'}`}>
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div
                        className="bg-surface p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate('/faculty/approvals')}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-muted uppercase tracking-wider">Pending Approvals</p>
                                <p className="text-3xl font-bold text-headings mt-2">{pendingRequests.length}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                                <Clock className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Col - Subjects & Class (2/3 width) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Class Teacher Section */}
                        {myClassroom && (
                            <div className="bg-surface rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-headings flex items-center">
                                        <Users className="w-5 h-5 mr-2 text-primary" /> My Class
                                    </h2>
                                    <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">Class Teacher</span>
                                </div>
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-headings">
                                                {myClassroom.department} - Sem {myClassroom.semester}
                                            </h3>
                                            <p className="text-secondary mt-1 flex items-center text-sm">
                                                Section {myClassroom.section} • {myClassroom.studentCount} Students Enrolled
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => navigate('/faculty/class')}
                                            className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-sm text-sm"
                                        >
                                            Manage Class
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <h2 className="text-lg font-bold text-headings mb-4 flex items-center">
                                <BookOpen className="w-5 h-5 mr-2 text-primary" /> Assigned Subjects
                            </h2>

                            {loading ? (
                                <div className="text-center py-12 text-muted animate-pulse">Loading subjects...</div>
                            ) : subjects.length === 0 ? (
                                <div className="bg-surface rounded-2xl border border-dashed border-slate-300 p-8 text-center text-muted">
                                    No subjects assigned.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {subjects.map((sub) => (
                                        <div
                                            key={sub.id}
                                            className="bg-surface rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group p-5 flex flex-col justify-between h-full"
                                            onClick={() => navigate(`/faculty/subject/${sub.id}`)}
                                        >
                                            <div>
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md font-mono">
                                                        {sub.code}
                                                    </span>
                                                    <Users className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <h3 className="font-bold text-headings text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                                    {sub.name}
                                                </h3>
                                                <p className="text-xs text-muted mt-1 font-medium">{sub.department} • Sem {sub.semester}</p>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-slate-50 flex gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/faculty/attendance/${sub.id}`); }}
                                                    className="flex-1 py-2 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
                                                >
                                                    Attendance
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setUploadForm(prev => ({ ...prev, subjectId: sub.id })); }}
                                                    className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                                                >
                                                    Notes
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Col - Feed & Widgets (1/3 width) */}
                    <div className="space-y-6">

                        {/* Today's Schedule Widget */}
                        <div className="bg-surface rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="font-bold text-headings text-sm flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-primary" /> Today's Schedule
                                </h3>
                                <div className="text-[10px] font-bold text-muted uppercase">
                                    {new Date().toLocaleDateString('en-US', { weekday: 'short' })}
                                </div>
                            </div>
                            <div className="p-4 space-y-4">
                                {todaySchedule.length === 0 ? (
                                    <div className="text-center text-muted text-xs py-4">No classes today.</div>
                                ) : (
                                    todaySchedule.map((cls, idx) => (
                                        <div key={idx} className="flex gap-3 items-start group">
                                            <div className="w-14 flex-shrink-0 text-right">
                                                <p className="text-xs font-bold text-headings">{cls.startTime}</p>
                                                <p className="text-[10px] text-muted">{cls.endTime}</p>
                                            </div>
                                            <div className="relative flex-1 pl-4 border-l-2 border-slate-100 group-hover:border-primary/50 transition-colors pb-1">
                                                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 group-hover:bg-primary border-2 border-surface transition-colors"></div>
                                                <p className="text-xs font-bold text-headings line-clamp-1">{cls.subject?.name}</p>
                                                <p className="text-[10px] text-secondary mt-0.5">
                                                    {cls.room} • {cls.classroom?.department} S{cls.classroom?.semester}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Approvals Widget */}
                        <div className="bg-surface rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="font-bold text-headings text-sm flex items-center">
                                    <Clock className="w-4 h-4 mr-2 text-warning" /> Pending Approvals
                                </h3>
                                <button onClick={() => navigate('/faculty/approvals')} className="text-[10px] font-bold text-primary hover:underline">VIEW ALL</button>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {pendingRequests.length === 0 ? (
                                    <div className="p-6 text-center text-muted text-xs">All clear! No requests.</div>
                                ) : (
                                    pendingRequests.slice(0, 3).map((req) => (
                                        <div key={req.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedRequest(req)}>
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-bold text-xs text-headings">{req.student?.name}</span>
                                                <span className="text-[10px] text-muted">{new Date(req.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-xs text-secondary line-clamp-1 mb-2">
                                                {req.type}: {req.reason}
                                            </p>
                                            <div className="flex gap-2">
                                                <button onClick={(e) => { e.stopPropagation(); handleApprovalAction(req.id, 'Approved'); }} className="text-[10px] font-bold text-success hover:bg-green-50 px-2 py-1 rounded">Approve</button>
                                                <button onClick={(e) => { e.stopPropagation(); handleApprovalAction(req.id, 'Rejected'); }} className="text-[10px] font-bold text-danger hover:bg-red-50 px-2 py-1 rounded">Reject</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-surface rounded-2xl shadow-sm border border-slate-200 p-4">
                            <h3 className="font-bold text-headings text-sm mb-3">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => navigate('/faculty/announcements')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-center transition-colors">
                                    <Megaphone className="w-5 h-5 mx-auto text-blue-500 mb-1" />
                                    <span className="text-[10px] font-bold text-secondary">Post Notice</span>
                                </button>
                                <button onClick={() => navigate('/faculty/events')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-center transition-colors">
                                    <Calendar className="w-5 h-5 mx-auto text-purple-500 mb-1" />
                                    <span className="text-[10px] font-bold text-secondary">Book Hall</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
}
