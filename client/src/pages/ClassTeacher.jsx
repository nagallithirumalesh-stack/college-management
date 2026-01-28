import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, Mail, Phone, Award, Search } from 'lucide-react';

export default function ClassTeacher() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [classroom, setClassroom] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

            // Fetch Students
            const stuRes = await fetch('http://localhost:5000/api/classroom/students', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const stuData = await stuRes.json();
            setStudents(stuData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.rollNumber && s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <div className="p-8 text-center">Loading class data...</div>;
    if (!classroom) return <div className="p-8 text-center">You are not assigned as a Class Teacher.</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <button
                        onClick={() => navigate('/faculty')}
                        className="flex items-center text-purple-200 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </button>

                    <div className="flex flex-col md:flex-row justify-between items-end">
                        <div className="flex items-center mb-4 md:mb-0">
                            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm mr-6">
                                <Users className="w-10 h-10 text-purple-200" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Class {classroom.department} {classroom.semester}-{classroom.section}</h1>
                                <p className="text-purple-200 mt-1">Class Teacher: {user.name}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-bold">{students.length}</p>
                            <p className="text-purple-200 text-sm uppercase tracking-wider">Total Students</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-lg font-bold text-gray-800">Student Roster</h2>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 font-bold border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Student Name</th>
                                    <th className="px-6 py-4">Roll Number</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4 text-center">Performance</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredStudents.map((student) => (
                                    <tr key={student._id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs mr-3">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <span className="font-semibold text-gray-900">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-gray-600">
                                            {student.rollNumber || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="flex items-center space-x-3">
                                                <button title="Email" className="hover:text-purple-600"><Mail className="w-4 h-4" /></button>
                                                <button title="Call" className="hover:text-purple-600"><Phone className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Good
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-sm font-medium text-purple-600 hover:text-purple-800">
                                                View Profile
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredStudents.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                            No students found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
