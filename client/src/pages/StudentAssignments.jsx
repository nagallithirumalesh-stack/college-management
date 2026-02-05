import { useState, useEffect } from 'react';

import { BookOpen, Calendar, Clock, Upload, CheckCircle, AlertCircle, FileText, Download } from 'lucide-react';

export default function StudentAssignments() {
    const [assignments, setAssignments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [loading, setLoading] = useState(true);
    const [uploadingId, setUploadingId] = useState(null);

    useEffect(() => {
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (subjects.length > 0) {
            fetchAssignments();
        }
    }, [selectedSubject, subjects]);

    const fetchSubjects = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/subjects/my', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSubjects(data);
            }
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    const fetchAssignments = async () => {
        const token = localStorage.getItem('token');
        setLoading(true);
        try {
            if (selectedSubject === 'all') {
                // Fetch assignments from all subjects
                const allAssignments = [];
                for (const subject of subjects) {
                    const res = await fetch(`http://localhost:5000/api/assignments/subject/${subject.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        allAssignments.push(...data.map(a => ({ ...a, subjectName: subject.name })));
                    }
                }
                setAssignments(allAssignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
            } else {
                const res = await fetch(`http://localhost:5000/api/assignments/subject/${selectedSubject}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    const subject = subjects.find(s => s.id === parseInt(selectedSubject));
                    setAssignments(data.map(a => ({ ...a, subjectName: subject?.name })));
                }
            }
        } catch (error) {
            console.error("Error fetching assignments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (assignmentId, file) => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('assignmentId', assignmentId);
        formData.append('file', file);

        setUploadingId(assignmentId);
        try {
            const res = await fetch('http://localhost:5000/api/assignments/submit', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                alert('Assignment submitted successfully!');
                fetchAssignments(); // Refresh to show submission status
            } else {
                const error = await res.json();
                alert(error.message || 'Failed to submit assignment');
            }
        } catch (error) {
            console.error("Error submitting assignment:", error);
            alert('Failed to submit assignment');
        } finally {
            setUploadingId(null);
        }
    };

    const getStatusBadge = (assignment) => {
        const dueDate = new Date(assignment.dueDate);
        const now = new Date();
        const isOverdue = now > dueDate;

        if (assignment.submission) {
            if (assignment.submission.status === 'Graded') {
                return (
                    <span className="flex items-center text-xs font-bold text-success bg-green-50 px-3 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Graded ({assignment.submission.grade}/{assignment.maxMarks})
                    </span>
                );
            }
            return (
                <span className="flex items-center text-xs font-bold text-info bg-blue-50 px-3 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Submitted
                </span>
            );
        }

        if (isOverdue) {
            return (
                <span className="flex items-center text-xs font-bold text-danger bg-red-50 px-3 py-1 rounded-full">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Overdue
                </span>
            );
        }

        return (
            <span className="flex items-center text-xs font-bold text-warning bg-amber-50 px-3 py-1 rounded-full">
                <Clock className="w-3 h-3 mr-1" />
                Pending
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-headings">My Assignments</h1>
                    <p className="text-secondary">View and submit your assignments</p>
                </div>

                {/* Subject Filter */}
                <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="px-4 py-2 bg-surface border border-slate-200 rounded-xl font-medium text-headings focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="all">All Subjects</option>
                    {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                </select>
            </div>

            {/* Assignments List */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-surface p-6 rounded-2xl border border-slate-200 animate-pulse h-48"></div>
                    ))}
                </div>
            ) : assignments.length === 0 ? (
                <div className="bg-surface p-12 rounded-2xl border border-slate-200 text-center">
                    <BookOpen className="w-16 h-16 mx-auto text-muted mb-4" />
                    <h3 className="text-lg font-bold text-headings mb-2">No Assignments Found</h3>
                    <p className="text-secondary">There are no assignments for the selected subject.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {assignments.map(assignment => (
                        <div key={assignment.id} className="bg-surface p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-headings mb-1">{assignment.title}</h3>
                                    <p className="text-xs text-primary font-semibold">{assignment.subjectName}</p>
                                </div>
                                {getStatusBadge(assignment)}
                            </div>

                            {/* Description */}
                            <p className="text-sm text-secondary mb-4 line-clamp-2">{assignment.description}</p>

                            {/* Metadata */}
                            <div className="flex items-center gap-4 text-xs text-muted mb-4">
                                <span className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    Due: {formatDate(assignment.dueDate)}
                                </span>
                                <span className="flex items-center">
                                    <FileText className="w-3 h-3 mr-1" />
                                    Max: {assignment.maxMarks} marks
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                {assignment.fileUrl && (
                                    <a
                                        href={`http://localhost:5000/${assignment.fileUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center px-4 py-2 bg-slate-100 text-headings rounded-xl hover:bg-slate-200 transition text-sm font-semibold"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </a>
                                )}

                                {!assignment.submission && (
                                    <label className="flex-1 flex items-center justify-center px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover transition text-sm font-semibold cursor-pointer">
                                        <Upload className="w-4 h-4 mr-2" />
                                        {uploadingId === assignment.id ? 'Uploading...' : 'Submit'}
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files[0]) {
                                                    handleFileUpload(assignment.id, e.target.files[0]);
                                                }
                                            }}
                                            disabled={uploadingId === assignment.id}
                                        />
                                    </label>
                                )}
                            </div>

                            {/* Submission Feedback */}
                            {assignment.submission?.feedback && (
                                <div className="mt-4 p-3 bg-slate-50 rounded-xl">
                                    <p className="text-xs font-bold text-headings mb-1">Feedback:</p>
                                    <p className="text-xs text-secondary">{assignment.submission.feedback}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
