import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Mail, Phone, CheckCircle, XCircle, AlertCircle, Save } from 'lucide-react';


export default function ClassTeacher() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [classroom, setClassroom] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [attendanceChanges, setAttendanceChanges] = useState({}); // { studentId: 'PRESENT' | 'ABSENT' }

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        try {
            // Fetch Class Info
            const classRes = await fetch('http://localhost:5000/api/classroom/my-class', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const classData = await classRes.json();
            setClassroom(classData);

            if (classData) {
                // Fetch Students with Fee & Attendance Status
                const stuRes = await fetch('http://localhost:5000/api/classroom/students', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const stuData = await stuRes.json();
                setStudents(stuData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAttendanceChange = (studentId, status) => {
        setAttendanceChanges(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const saveAttendance = async () => {
        // TODO: Implement bulk attendance save API
        alert(`Simulating save for ${Object.keys(attendanceChanges).length} students.`);
        setAttendanceChanges({});
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.rollNo && s.rollNo.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return (
        <div className="p-8 text-center text-gray-500">Loading class roster...</div>
    );

    if (!classroom) return (
        <div className="p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">No Class Assigned</h2>
            <p className="text-gray-500 mt-2">You are not currently assigned as a Class Teacher.</p>
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">

            {/* Header Card */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-end">
                    <div className="flex items-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mr-6 border border-white/20">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2 mb-1">
                                <span className="bg-white/20 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Class Teacher</span>
                            </div>
                            <h1 className="text-3xl font-black">Class {classroom.department} {classroom.semester}-{classroom.section}</h1>
                            <p className="text-indigo-100 font-medium mt-1">Manage attendance, view defaulters, and track performance.</p>
                        </div>
                    </div>
                    <div className="mt-6 md:mt-0 text-right">
                        <p className="text-5xl font-black tracking-tight">{students.length}</p>
                        <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider">Total Students</p>
                    </div>
                </div>
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name or roll no..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-violet-500 outline-none shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {Object.keys(attendanceChanges).length > 0 && (
                    <button
                        onClick={saveAttendance}
                        className="flex items-center px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition animate-in fade-in"
                    >
                        <Save className="w-5 h-5 mr-2" /> Save Changes
                    </button>
                )}
            </div>

            {/* Student Table */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-400 font-bold">
                            <tr>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">Roll No</th>
                                <th className="px-6 py-4">Status & Fee</th>
                                <th className="px-6 py-4 text-center">Todays Attendance</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredStudents.map((student) => {
                                const isDefaulter = student.feeStatus === 'OVERDUE' || student.feeStatus === 'PENDING';
                                const currentStatus = attendanceChanges[student.id] || 'PRESENT'; // Default present logic if integrated

                                return (
                                    <tr key={student.id} className="hover:bg-violet-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center font-bold text-sm mr-3 border-2 border-white shadow-sm">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{student.name}</p>
                                                    <p className="text-xs text-gray-500">{student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                                                {student.rollNo || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {isDefaulter ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                                                    <AlertCircle className="w-3 h-3 mr-1" /> ₹{student.feeDue?.toLocaleString()} Due
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                    <CheckCircle className="w-3 h-3 mr-1" /> Paid
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex bg-gray-100 rounded-lg p-1">
                                                <button
                                                    onClick={() => handleAttendanceChange(student.id, 'PRESENT')}
                                                    className={`px-3 py-1 text-xs font-bold rounded-md transition ${currentStatus === 'PRESENT' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                                >
                                                    P
                                                </button>
                                                <button
                                                    onClick={() => handleAttendanceChange(student.id, 'ABSENT')}
                                                    className={`px-3 py-1 text-xs font-bold rounded-md transition ${currentStatus === 'ABSENT' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                                >
                                                    A
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-violet-100 rounded-full text-violet-600 transition">
                                                    <Mail className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-violet-100 rounded-full text-violet-600 transition">
                                                    <Phone className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {filteredStudents.length === 0 && (
                    <div className="p-10 text-center text-gray-400">
                        No students found matching "{searchTerm}"
                    </div>
                )}
            </div>
        </div>

    );
}
