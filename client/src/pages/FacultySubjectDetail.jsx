import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Upload, FilePlus, BookOpen, Users, Clock, Plus, XCircle, MoreVertical } from 'lucide-react';

export default function FacultySubjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [subject, setSubject] = useState(null);
    const [activeTab, setActiveTab] = useState('content');
    const [notes, setNotes] = useState([]);
    const [studentStats, setStudentStats] = useState(null);

    // QR Session State
    const [showQRModal, setShowQRModal] = useState(false);
    const [qrValue, setQrValue] = useState('');

    // Upload & Assignment State
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);

    // Assignment Form
    const [assignmentForm, setAssignmentForm] = useState({
        title: '',
        description: '',
        dueDate: '',
        maxMarks: 100,
        file: null
    });

    // Upload Form State (renamed from uploadData to uploadForm and simplified file handling)
    const [uploadForm, setUploadForm] = useState({
        title: '',
        description: '',
        unit: '1',
        tags: '',
        isPublic: true,
        linkUrl: '',
        file: null // Moved file state into uploadForm
    });

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        try {
            // Fetch Subject Details
            const subRes = await fetch(`http://localhost:5000/api/subjects/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const subData = await subRes.json();
            setSubject(subData);

            // Fetch Notes
            const notesRes = await fetch(`http://localhost:5000/api/notes/subject/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const notesData = await notesRes.json();

            setNotes(notesData);

            // Fetch Student Stats
            const statsRes = await fetch(`http://localhost:5000/api/attendance/subject/${id}/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStudentStats(statsData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('title', assignmentForm.title);
        formData.append('description', assignmentForm.description);
        formData.append('subjectId', id);
        formData.append('dueDate', assignmentForm.dueDate);
        formData.append('maxMarks', assignmentForm.maxMarks);
        if (assignmentForm.file) {
            formData.append('file', assignmentForm.file);
        }

        try {
            const res = await fetch('http://localhost:5000/api/assignments', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                alert('Assignment Created Successfully!');
                setShowAssignmentModal(false);
                setAssignmentForm({ title: '', description: '', dueDate: '', maxMarks: 100, file: null });
                // Optional: Refresh assignments list if we had one
            } else {
                const err = await res.json();
                alert('Error: ' + err.message);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to create assignment');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('title', uploadForm.title);
        formData.append('description', uploadForm.description);
        formData.append('subjectId', id);
        formData.append('unit', uploadForm.unit);
        formData.append('tags', uploadForm.tags);
        formData.append('isPublic', uploadForm.isPublic);
        formData.append('linkUrl', uploadForm.linkUrl);
        if (uploadForm.file) {
            formData.append('file', uploadForm.file);
        }
        try {
            const res = await fetch('http://localhost:5000/api/notes', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                alert('Uploaded successfully!');
                setShowUploadModal(false);
                setUploadData({ title: '', description: '', unit: '1', tags: '', isPublic: true, linkUrl: '' });
                setFile(null);
                fetchData(); // Refresh list
            } else {
                alert('Upload failed.');
                const err = await res.json();
                console.error(err);
            }
        } catch (error) {
            console.error("Upload error:", error);
        }
    };

    if (!subject) return <div className="p-8 text-center text-gray-500">Loading subject...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <button
                        onClick={() => navigate('/faculty')}
                        className="flex items-center text-gray-500 hover:text-gray-700 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </button>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{subject.name}</h1>
                            <p className="text-gray-500 mt-1">{subject.code} • {subject.department} • Semester {subject.semester}</p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => navigate(`/faculty/attendance/${id}`)}
                                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
                            >
                                <Clock className="w-4 h-4 mr-2" />
                                Start Session
                            </button>
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-sm"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Note
                            </button>
                            <button
                                onClick={() => setShowAssignmentModal(true)}
                                className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Assignment
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-8 mt-8 border-b border-gray-100">
                        {['overview', 'content', 'assignments', 'students'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-sm font-medium capitalize transition-colors border-b-2 ${activeTab === tab
                                    ? 'border-emerald-600 text-emerald-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* ... existing content ... */}

                {/* QR Modal */}
                {showQRModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                        <div className="bg-white rounded-3xl p-8 flex flex-col items-center max-w-sm w-full animate-in zoom-in duration-300 shadow-2xl relative">
                            <button
                                onClick={() => setShowQRModal(false)}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
                            >
                                <XCircle className="w-6 h-6 text-gray-500" />
                            </button>

                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Scan for Attendance</h2>
                            <p className="text-gray-500 text-sm mb-6 text-center">Ask students to scan this code using their app</p>

                            <div className="bg-white p-4 rounded-xl border-4 border-indigo-100 shadow-inner mb-6">
                                {/* Use a library like react-qr-code in real app. Here using an API for image */}
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrValue}`}
                                    alt="QR Code"
                                    className="w-64 h-64"
                                />
                            </div>

                            <div className="text-center bg-indigo-50 p-3 rounded-lg w-full mb-4">
                                <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">Session Token</p>
                                <p className="font-mono text-lg font-bold text-indigo-900 tracking-widest">{qrValue}</p>
                            </div>

                            <p className="text-xs text-gray-400 animate-pulse">Waiting for scans...</p>
                        </div>
                    </div>
                )}


                {/* CONTENT TAB */}
                {activeTab === 'content' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-900">Uploaded Materials</h2>
                            <div className="text-sm text-gray-500">{notes.length} files</div>
                        </div>

                        {notes.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed text-gray-400">
                                No notes uploaded yet. Click "Upload Note" to start.
                            </div>
                        ) : (
                            <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                                <ul className="divide-y divide-gray-100">
                                    {notes.map(note => (
                                        <li key={note._id} className="p-4 hover:bg-gray-50 transition flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mr-4">
                                                    <BookOpen className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-900">{note.title}</h4>
                                                    <p className="text-xs text-gray-500">Unit {note.unit} • {new Date(note.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${note.isPublic ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                                    {note.isPublic ? 'Public' : 'Private'}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* ASSIGNMENTS TAB */}
                {activeTab === 'assignments' && (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed text-gray-400">
                        Assignments module coming soon.
                    </div>
                )}

                {/* STUDENTS TAB */}
                {/* STUDENTS TAB */}
                {activeTab === 'students' && (
                    <div className="space-y-6">
                        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-gray-900">Enrolled Students</h3>
                                <button className="text-sm text-indigo-600 font-bold hover:text-indigo-800">Export CSV</button>
                            </div>

                            {studentStats ? (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/50 text-xs uppercase text-gray-500 font-bold tracking-wider">
                                            <th className="p-4">Student</th>
                                            <th className="p-4 text-center">Attended</th>
                                            <th className="p-4 text-center">Total Classes</th>
                                            <th className="p-4 text-center">Percentage</th>
                                            <th className="p-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {studentStats.students.map((student) => (
                                            <tr key={student._id} className="hover:bg-gray-50 transition">
                                                <td className="p-4">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs mr-3">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 text-sm">{student.name}</p>
                                                            <p className="text-xs text-gray-500">{student.rollNumber || student.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center font-mono text-sm">{student.attended}</td>
                                                <td className="p-4 text-center font-mono text-sm">{studentStats.totalSessions}</td>
                                                <td className="p-4 text-center">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${student.percentage >= 75 ? 'bg-green-100 text-green-700' :
                                                        student.percentage >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {student.percentage}%
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button className="text-gray-400 hover:text-indigo-600">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {studentStats.students.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="p-8 text-center text-gray-500">No students found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-12 text-center text-gray-400 animate-pulse">Loading student data...</div>
                            )}
                        </div>
                    </div>
                )}

            </main>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Upload New Note</h3>
                            <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                        </div>

                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    value={uploadForm.title}
                                    onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full border rounded-lg p-2.5 h-20 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    value={uploadForm.description}
                                    onChange={e => setUploadForm({ ...uploadForm, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                                        value={uploadForm.unit}
                                        onChange={e => setUploadForm({ ...uploadForm, unit: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                                    <select
                                        className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                                        value={uploadForm.isPublic}
                                        onChange={e => setUploadForm({ ...uploadForm, isPublic: e.target.value === 'true' })}
                                    >
                                        <option value="true">Public (Class)</option>
                                        <option value="false">Private (Draft)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition">
                                <input
                                    type="file"
                                    onChange={e => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                />
                                <div className="mt-2 text-xs text-gray-400">- OR -</div>
                                <input
                                    type="url"
                                    placeholder="Paste external link URL"
                                    className="mt-2 w-full text-sm border-b border-gray-300 p-1 focus:border-emerald-500 outline-none"
                                    value={uploadForm.linkUrl}
                                    onChange={e => setUploadForm({ ...uploadForm, linkUrl: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowUploadModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-sm font-medium"
                                >
                                    Upload Material
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Assignment Modal */}
            {showAssignmentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Create New Assignment</h3>
                            <button onClick={() => setShowAssignmentModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                        </div>

                        <form onSubmit={handleCreateAssignment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    required
                                    value={assignmentForm.title}
                                    onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    rows="3"
                                    value={assignmentForm.description}
                                    onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                                        required
                                        value={assignmentForm.dueDate}
                                        onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Marks</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                                        value={assignmentForm.maxMarks}
                                        onChange={(e) => setAssignmentForm({ ...assignmentForm, maxMarks: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reference File (Optional)</label>
                                <input
                                    type="file"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                    onChange={(e) => setAssignmentForm({ ...assignmentForm, file: e.target.files[0] })}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold hover:bg-emerald-700 transition"
                            >
                                <Plus className="w-4 h-4 inline mr-2" /> Create Assignment
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
