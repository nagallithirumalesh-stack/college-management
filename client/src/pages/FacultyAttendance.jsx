import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Check, X, Search, ArrowLeft, Users, Calendar,
    Download, PieChart, Filter, MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function FacultyAttendance() {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); // If needed for auth context
    const [loading, setLoading] = useState(true);
    const [gridData, setGridData] = useState({ dates: [], students: [] });
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ total: 0, average: 0 });

    useEffect(() => {
        fetchAttendanceGrid();
    }, [subjectId]);

    const fetchAttendanceGrid = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/attendance/subject/${subjectId}/grid`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setGridData(data);

                // Calculate summary stats
                const totalStudents = data.students.length;
                const totalAvg = totalStudents > 0
                    ? data.students.reduce((acc, s) => acc + s.stats.percentage, 0) / totalStudents
                    : 0;

                setStats({
                    total: totalStudents,
                    average: Math.round(totalAvg)
                });
            } else {
                console.error("Failed to fetch grid");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (studentId, sessionId, currentStatus) => {
        const newStatus = currentStatus === 'present' ? 'absent' : 'present';

        // Optimistic Update
        setGridData(prev => {
            const updatedStudents = prev.students.map(s => {
                if (s.id === studentId) {
                    const newAttendance = { ...s.attendance, [sessionId]: newStatus };
                    // Recalculate stats for this student
                    const presentCount = Object.values(newAttendance).filter(st => st === 'present').length;
                    const totalSessions = Object.keys(newAttendance).length;
                    const percentage = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

                    return { ...s, attendance: newAttendance, stats: { ...s.stats, present: presentCount, percentage } };
                }
                return s;
            });
            return { ...prev, students: updatedStudents };
        });

        // API Call
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/attendance/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ sessionId, studentId, status: newStatus })
            });

            if (!res.ok) {
                // Revert if failed (todo)
                console.error("Failed to update status");
                fetchAttendanceGrid(); // Refresh to ensure consistency
            }
        } catch (error) {
            console.error("Error toggling attendance:", error);
            fetchAttendanceGrid();
        }
    };

    // Filter students
    const filteredStudents = gridData.students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.rollNumber && s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background font-sans text-secondary pb-12">

            {/* Header Section */}
            <div className="bg-surface border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-headings">{gridData.subjectName || 'Attendance Register'}</h1>
                                <p className="text-sm text-secondary">Manage student attendance records</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search student..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64"
                                />
                            </div>
                            <button className="p-2 border border-gray-200 rounded-lg hover:bg-slate-50 text-secondary">
                                <Filter className="w-5 h-5" />
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium text-sm">
                                <Download className="w-4 h-4" /> Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-surface p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-muted uppercase tracking-wider">Total Students</p>
                                <h3 className="text-2xl font-bold text-headings mt-2">{stats.total}</h3>
                            </div>
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-surface p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-muted uppercase tracking-wider">Total Sessions</p>
                                <h3 className="text-2xl font-bold text-headings mt-2">{gridData.dates.length}</h3>
                            </div>
                            <div className="p-3 bg-fuchsia-50 text-fuchsia-600 rounded-lg">
                                <Calendar className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-surface p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-muted uppercase tracking-wider">Class Average</p>
                                <h3 className="text-2xl font-bold text-headings mt-2">{stats.average}%</h3>
                            </div>
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                                <PieChart className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attendance Table */}
                <div className="bg-surface rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-center">
                            <thead className="bg-slate-50 text-secondary font-medium">
                                <tr>
                                    <th className="p-4 text-left font-bold border-b border-gray-200 sticky left-0 bg-slate-50 z-10 w-64 min-w-[200px]">
                                        Student Name
                                    </th>
                                    <th className="p-4 border-b border-gray-200 w-20">Stats</th>
                                    {gridData.dates.map(date => (
                                        <th key={date.id} className="p-4 border-b border-gray-200 min-w-[60px] whitespace-nowrap">
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs text-muted mb-1">
                                                    {new Date(date.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                                </span>
                                                <span className="font-bold text-headings">
                                                    {new Date(date.date).getDate()}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => (
                                        <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4 text-left font-medium text-headings border-r border-gray-100 sticky left-0 bg-surface z-10">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="line-clamp-1">{student.name}</div>
                                                        <div className="text-[10px] text-muted">{student.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className={`text-xs font-bold px-2 py-1 rounded inline-block ${student.stats.percentage >= 75 ? 'bg-green-50 text-emerald-600' :
                                                    student.stats.percentage >= 60 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                                                    }`}>
                                                    {student.stats.percentage}%
                                                </div>
                                            </td>
                                            {gridData.dates.map(date => {
                                                const status = student.attendance[date.id];
                                                return (
                                                    <td key={`${student.id}-${date.id}`} className="p-4">
                                                        <button
                                                            onClick={() => handleToggle(student.id, date.id, status)}
                                                            className={`p-2 rounded-full transition-all duration-200 transform hover:scale-110 ${status === 'present'
                                                                ? 'text-emerald-500 hover:bg-emerald-50'
                                                                : 'text-red-400 hover:bg-red-50'
                                                                }`}
                                                            title={`Mark as ${status === 'present' ? 'Absent' : 'Present'}`}
                                                        >
                                                            {status === 'present' ? (
                                                                <Check className="w-5 h-5 stroke-[3]" />
                                                            ) : (
                                                                <X className="w-5 h-5 stroke-[3]" />
                                                            )}
                                                        </button>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={gridData.dates.length + 2} className="p-8 text-center text-muted">
                                            No students found matching "{searchTerm}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State if no sessions */}
                    {gridData.dates.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-medium text-headings">No attendance records yet</h3>
                            <p className="text-secondary mt-1">Start a session to begin tracking attendance.</p>
                            <button
                                onClick={() => navigate('/faculty/qr-generator')}
                                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover font-medium text-sm"
                            >
                                Start New Session
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
