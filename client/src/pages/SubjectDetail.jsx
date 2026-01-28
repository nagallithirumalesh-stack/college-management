import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Book, FileText, Award, Bell, ArrowLeft, Download, Clock } from 'lucide-react';

export default function SubjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [subject, setSubject] = useState(null);
    const [activeTab, setActiveTab] = useState('notes');
    const [notes, setNotes] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                // Fetch Subject Details
                const subRes = await fetch(`http://localhost:5000/api/subjects/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!subRes.ok) throw new Error('Failed to load subject');
                const subData = await subRes.json();
                setSubject(subData);

                // Fetch Notes
                const notesRes = await fetch(`http://localhost:5000/api/notes?subjectId=${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const notesData = await notesRes.json();
                setNotes(notesData);

                // Fetch Assignments
                const assgnRes = await fetch(`http://localhost:5000/api/assignments/subject/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const assgnData = await assgnRes.json();
                setAssignments(assgnData);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleUpload = async (e, assignmentId) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('assignmentId', assignmentId);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/assignments/submit', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                alert('Assignment submitted successfully!');
                // Refresh assignments to update status
                const assgnRes = await fetch(`http://localhost:5000/api/assignments/subject/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const assgnData = await assgnRes.json();
                setAssignments(assgnData);
            } else {
                alert('Failed to submit assignment');
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert('Error uploading file');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading subject details...</div>;
    if (!subject) return <div className="p-8 text-center">Subject not found.</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <button
                        onClick={() => navigate('/student')}
                        className="flex items-center text-gray-500 hover:text-gray-700 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </button>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{subject.name}</h1>
                            <p className="text-gray-500 mt-1">{subject.code} • {subject.faculty?.name || 'Unknown Faculty'}</p>
                        </div>
                        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold">
                            Attendance: 85% {/* Mock Data */}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-8 mt-8 border-b border-gray-100">
                        {['notes', 'attendance', 'assignments', 'marks', 'announcements'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-sm font-medium capitalize transition-colors border-b-2 ${activeTab === tab
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* NOTES TAB */}
                {activeTab === 'notes' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Study Materials</h2>
                            {/* Student upload button could go here */}
                        </div>

                        {notes.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No notes uploaded yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {notes.map(note => (
                                    <div key={note._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                        <div className="flex items-start justify-between">
                                            <div className={`p-2 rounded-lg ${note.fileType === 'pdf' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {new Date(note.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="mt-4 font-semibold text-gray-900 truncate" title={note.title}>{note.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{note.description}</p>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex space-x-2">
                                                {note.tags?.map(tag => (
                                                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">#{tag}</span>
                                                ))}
                                            </div>
                                            <a
                                                href={note.fileType === 'link' ? note.fileUrl : `http://localhost:5000/${note.fileUrl}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition"
                                            >
                                                <Download className="w-5 h-5" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ASSIGNMENTS TAB */}
                {activeTab === 'assignments' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Assignments</h2>
                        </div>

                        {assignments.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No assignments posted yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {assignments.map(assgn => (
                                    <div key={assgn._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900">{assgn.title}</h3>
                                            <p className="text-gray-600 mt-1">{assgn.description}</p>
                                            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${new Date(assgn.dueDate) < new Date() ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                    Due: {new Date(assgn.dueDate).toLocaleDateString()}
                                                </span>
                                                <span>Max Marks: {assgn.maxMarks}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 md:mt-0 flex items-center space-x-4">
                                            {assgn.submission ? (
                                                <div className="text-right">
                                                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold mb-1">
                                                        Submitted
                                                    </span>
                                                    {assgn.submission.grade && (
                                                        <p className="text-sm font-bold text-gray-900">
                                                            Grade: {assgn.submission.grade}/{assgn.maxMarks}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center">
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Submit Work
                                                    <input type="file" className="hidden" onChange={(e) => handleUpload(e, assgn._id)} />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {/* ATTENDANCE TAB */}
                {activeTab === 'attendance' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Attendance Stats & History */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Attendance Overview</h3>
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-blue-600">45</div>
                                        <div className="text-sm text-blue-800">Total Classes</div>
                                    </div>
                                    <div className="bg-emerald-50 p-4 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-emerald-600">38</div>
                                        <div className="text-sm text-emerald-800">Present</div>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-red-600">84.4%</div>
                                        <div className="text-sm text-red-800">Percentage</div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></div>
                                            <span className="text-sm font-medium text-gray-700">22 Jan 2026 (Today)</span>
                                        </div>
                                        <span className="text-sm font-bold text-emerald-600">Present</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 rounded-full bg-red-500 mr-3"></div>
                                            <span className="text-sm font-medium text-gray-700">20 Jan 2026</span>
                                        </div>
                                        <span className="text-sm font-bold text-red-600">Absent</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions & Policy */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Actions</h3>
                                <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm mb-3">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Apply for OD / Leave
                                </button>
                                <button className="w-full flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm">
                                    View Condonation Policy
                                </button>
                            </div>

                            <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                                <div className="flex items-start">
                                    <Award className="w-5 h-5 text-orange-600 mr-3 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-orange-800 text-sm">Low Attendance Warning</h4>
                                        <p className="text-xs text-orange-700 mt-1">
                                            Your attendance is approaching the 75% threshold. Please ensure you attend upcoming classes or file valid OD requests.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
