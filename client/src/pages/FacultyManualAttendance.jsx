import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import { Search, Save, Lock, CheckCircle, XCircle, Users, CheckSquare, Square, Filter, Smartphone, User, RefreshCw } from 'lucide-react';

export default function FacultyManualAttendance() {
    const { user } = useAuth();
    const { subjectId } = useParams(); // URL Param for Subject

    // Filters
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(subjectId || ''); // Initialize from URL
    const [year, setYear] = useState('2');
    const [branch, setBranch] = useState('AIDSS');
    const [section, setSection] = useState('A');

    // Data State
    const [students, setStudents] = useState([]);
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [searchTerm, setSearchTerm] = useState('');

    // Local Attendance State (studentId -> status)
    const [attendanceState, setAttendanceState] = useState({});

    // Verification Method State (studentId -> 'qr' | 'manual')
    const [verificationMap, setVerificationMap] = useState({});

    // Track which records have been manually touched by user to prevent polling overwrite
    const [touched, setTouched] = useState(new Set());

    // Summary Stats
    const totalStudents = students.length;
    const presentCount = Object.values(attendanceState).filter(s => s === 'present').length;
    const absentCount = totalStudents - presentCount;
    const attendancePercentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

    // Initial Load
    useEffect(() => {
        fetch('http://localhost:5000/api/subjects', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch subjects');
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setSubjects(data);
                    // If subjectId param exists, ensure it matches a valid subject
                    if (subjectId && data.find(s => s.id === parseInt(subjectId))) {
                        setSelectedSubject(subjectId);
                    }
                } else {
                    console.error("Subjects API returned non-array:", data);
                    setSubjects([]);
                }
            })
            .catch(err => {
                console.error(err);
                setSubjects([]);
            });
    }, [subjectId]);

    // Fetch & Poll Logic
    useEffect(() => {
        let interval;
        if (selectedSubject && year && branch && section) {
            // Initial Load
            fetchStudentList(false);
            // Poll for Realtime Updates (QR Scans)
            interval = setInterval(() => fetchStudentList(true), 3000);
        }
        return () => clearInterval(interval);
    }, [selectedSubject, year, branch, section]);

    const fetchStudentList = async (isPolling = false) => {
        if (!isPolling) setLoading(true);
        try {
            const query = new URLSearchParams({
                subjectId: selectedSubject,
                year,
                department: branch,
                section
            });

            const res = await fetch(`http://localhost:5000/api/attendance/manual-list?${query}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            if (res.ok) {
                const data = await res.json();

                if (!isPolling) setStudents(data);

                // Merge Server Data with Local State
                setAttendanceState(prev => {
                    const next = { ...prev };
                    data.forEach(s => {
                        // Only update from server if NOT touched by user
                        // OR if it's the first load (!isPolling)
                        // OR if we want to allow server to override if it becomes PRESENT (e.g. QR scan happens)
                        if (!touched.has(s.id) || !isPolling) {
                            next[s.id] = s.attendanceStatus || 'absent';
                        }
                    });
                    return next;
                });

                // Update Verification Methods (Server always truth for source)
                const vMap = {};
                data.forEach(s => {
                    if (s.verificationMethod) vMap[s.id] = s.verificationMethod;
                });
                setVerificationMap(vMap);

                if (data.length > 0 && data[0].sessionId) {
                    setSessionId(data[0].sessionId);
                }
            }
        } catch (err) {
            console.error(err);
            if (!isPolling) setMessage({ type: 'error', text: 'Failed to fetch student list' });
        } finally {
            if (!isPolling) setLoading(false);
        }
    };

    const toggleStatus = (studentId) => {
        // Mark as touched so polling doesn't overwrite
        setTouched(prev => {
            const next = new Set(prev);
            next.add(studentId);
            return next;
        });

        setAttendanceState(prev => ({
            ...prev,
            [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
        }));
    };

    const markAll = (status) => {
        // Mark ALL as touched
        const allIds = students.map(s => s.id);
        const newTouched = new Set(touched);
        allIds.forEach(id => newTouched.add(id));
        setTouched(newTouched);

        const newState = {};
        students.forEach(s => newState[s.id] = status);
        setAttendanceState(newState);
    };

    const handleSave = async (lock = false) => {
        if (!selectedSubject) return;
        setLoading(true);

        try {
            const records = Object.entries(attendanceState).map(([studentId, status]) => ({
                studentId,
                status
            }));

            const res = await fetch('http://localhost:5000/api/attendance/manual-save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    subjectId: selectedSubject,
                    date: new Date(),
                    records,
                    lock
                })
            });

            if (res.ok) {
                const data = await res.json();
                setMessage({ type: 'success', text: lock ? 'Session Locked Successfully' : 'Attendance Saved Successfully' });
                setSessionId(data.sessionId);
                // Clear touched on save to resync with server
                setTouched(new Set());
            } else {
                throw new Error('Save failed');
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Error saving attendance' });
        } finally {
            setLoading(false);
        }
    };

    // Filtered Students logic
    const filteredStudents = students.filter(s => {
        const term = searchTerm.toLowerCase();
        return (s.name?.toLowerCase().includes(term) || s.rollNumber?.toLowerCase().includes(term));
    });

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        Manual Attendance
                        {sessionId && <span className="text-xs font-mono bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">LIVE SESSION</span>}
                    </h1>
                    <p className="text-slate-500 text-sm">Real-time Hybrid (QR + Manual) Mode</p>
                </div>
                {/* Summary Card */}
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex gap-6 text-sm">
                    <div className="text-center">
                        <div className="text-slate-500 text-xs uppercase font-bold">Total</div>
                        <div className="font-bold text-slate-900">{totalStudents}</div>
                    </div>
                    <div className="w-px bg-slate-100"></div>
                    <div className="text-center text-emerald-600">
                        <div className="text-xs uppercase font-bold">Present</div>
                        <div className="font-bold">{presentCount}</div>
                    </div>
                    <div className="w-px bg-slate-100"></div>
                    <div className="text-center text-red-600">
                        <div className="text-xs uppercase font-bold">Absent</div>
                        <div className="font-bold">{absentCount}</div>
                    </div>
                    <div className="w-px bg-slate-100"></div>
                    <div className="text-center text-blue-600">
                        <div className="text-xs uppercase font-bold">Rate</div>
                        <div className="font-bold">{attendancePercentage}%</div>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Year</label>
                    <select value={year} onChange={e => setYear(e.target.value)} className="w-full p-2 border rounded-lg text-sm font-semibold">
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Branch</label>
                    <select value={branch} onChange={e => setBranch(e.target.value)} className="w-full p-2 border rounded-lg text-sm font-semibold">
                        <option value="AIDSS">AIDSS</option>
                        <option value="CSE">CSE</option>
                        <option value="ECE">ECE</option>
                        <option value="IT">IT</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Section</label>
                    <select value={section} onChange={e => setSection(e.target.value)} className="w-full p-2 border rounded-lg text-sm font-semibold">
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                    </select>
                </div>
                <div className="space-y-1 col-span-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Subject</label>
                    <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="w-full p-2 border rounded-lg text-sm font-semibold">
                        <option value="">Select Subject...</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                    </select>
                </div>
            </div>

            {/* Controls & Message */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-2 w-full md:w-auto">
                    <button onClick={() => markAll('present')} className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-100 transition whitespace-nowrap">
                        Mark All Present
                    </button>
                    <button onClick={() => markAll('absent')} className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition whitespace-nowrap">
                        Mark All Absent
                    </button>
                </div>

                <div className="flex flex-1 w-full md:max-w-md items-center gap-4">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by Name or Roll No..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                    </div>

                    <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 whitespace-nowrap">
                        <span className="flex items-center gap-1"><Smartphone size={12} /> QR</span>
                        <span className="flex items-center gap-1"><User size={12} /> Manual</span>
                    </div>
                </div>

                {message.text && (
                    <div className={`px-4 py-1.5 rounded-lg text-xs font-bold ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {message.text}
                    </div>
                )}
            </div>

            {/* Student Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-xs">
                        <tr>
                            <th className="p-4 w-16 text-center">#</th>
                            <th className="p-4">Roll No</th>
                            <th className="p-4">Student Name</th>
                            <th className="p-4 text-center">Source</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="6" className="p-8 text-center text-slate-400">Loading...</td></tr>
                        ) : filteredStudents.length === 0 ? (
                            <tr><td colSpan="6" className="p-8 text-center text-slate-400">No students found matching filters.</td></tr>
                        ) : (
                            filteredStudents.map((student, index) => {
                                const status = attendanceState[student.id];
                                const method = verificationMap[student.id];

                                return (
                                    <tr key={student.id} className={`transition-colors ${status === 'absent' ? 'bg-red-50/30' : 'hover:bg-slate-50'}`}>
                                        <td className="p-4 text-center text-slate-400 font-mono text-xs">{index + 1}</td>
                                        <td className="p-4 font-mono font-bold text-slate-700">{student.rollNumber}</td>
                                        <td className="p-4">
                                            <div className="font-bold text-slate-900">{student.name}</div>
                                            <div className="text-xs text-slate-500">{student.email}</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            {status === 'present' && method === 'qr' && (
                                                <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                                    <Smartphone size={12} /> QR
                                                </div>
                                            )}
                                            {status === 'present' && method === 'manual' && (
                                                <div className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                                    <User size={12} /> Manual
                                                </div>
                                            )}
                                            {status === 'present' && !method && (
                                                <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                                    Pending
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status === 'present' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {status === 'present' ? 'Present' : 'Absent'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => toggleStatus(student.id)}
                                                className={`p-2 rounded-lg transition-all ${status === 'present'
                                                    ? 'text-emerald-600 hover:bg-emerald-50'
                                                    : 'text-red-600 hover:bg-red-50'
                                                    }`}
                                            >
                                                {status === 'present' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-20 md:pl-64">
                <div className="max-w-6xl mx-auto flex justify-end gap-4">
                    <button
                        disabled={loading || students.length === 0}
                        onClick={() => handleSave(false)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        Save Attendance
                    </button>
                    <button
                        disabled={loading || students.length === 0}
                        onClick={() => handleSave(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-50"
                    >
                        <Lock className="w-4 h-4" />
                        Lock Session
                    </button>
                </div>
            </div>
        </div>
    );
}
