import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Plus, Trash2, Search, X } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

export default function AdminSubjects() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        department: '',
        semester: 1,
        facultyId: ''
    });

    useEffect(() => {
        fetchSubjects();
        fetchFaculties();
    }, []);

    const fetchSubjects = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/subjects', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setSubjects(data);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    const fetchFaculties = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/subjects/faculties', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setFaculties(data);
        } catch (error) {
            console.error("Error fetching faculties:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/subjects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setShowModal(false);
                fetchSubjects();
                setFormData({ name: '', code: '', department: '', semester: 1, facultyId: '' });
                alert("Subject created successfully!");
            } else {
                alert('Failed to create subject');
            }
        } catch (error) {
            console.error("Create Subject Error:", error);
        }
    };

    const filteredSubjects = subjects.filter(sub =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="admin">
            <div className="p-8 max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">Subject Management</h1>
                        <p className="text-gray-500 mt-1">Create curriculum and assign faculty mentors.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all font-bold shadow-blue-200"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Subject
                    </button>
                </header>

                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Search Bar */}
                    <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
                        <Search className="w-5 h-5 text-gray-400 mr-3" />
                        <input
                            type="text"
                            placeholder="Search subjects by name or code..."
                            className="flex-1 outline-none text-gray-700 bg-transparent text-sm placeholder:text-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 font-bold border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Code</th>
                                    <th className="px-6 py-4">Subject Name</th>
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4">Faculty Mentor</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredSubjects.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-16 text-center text-gray-400">
                                            <div className="flex flex-col items-center">
                                                <BookOpen className="w-12 h-12 mb-3 opacity-20" />
                                                <p className="font-semibold">No subjects found</p>
                                                <p className="text-xs mt-1">Try a different search term or add a new subject.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSubjects.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-indigo-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
                                                    {sub.code}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs mr-3">
                                                        {sub.name.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-gray-900 text-sm">{sub.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">
                                                    <span className="font-semibold">{sub.department}</span>
                                                    <span className="text-xs text-gray-400 block">Sem {sub.semester}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {sub.faculty ? (
                                                    <div className="flex items-center">
                                                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold mr-2">
                                                            {sub.faculty.name.charAt(0)}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-700">{sub.faculty.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="px-2 py-1 inline-flex text-xs font-bold rounded-md bg-orange-50 text-orange-600 border border-orange-100">
                                                        Unassigned
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-200 relative">
                        <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-200">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">Add New Subject</h3>
                            <p className="text-gray-500 text-sm mt-1">Define course details and assign a mentor.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Data Structures"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject Code</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. CS101"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-mono"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Semester</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        max="8"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                                        value={formData.semester}
                                        onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Department</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    >
                                        <option value="">Select Department</option>
                                        <option value="CSE">CSE</option>
                                        <option value="ECE">ECE</option>
                                        <option value="EEE">EEE</option>
                                        <option value="IT">IT</option>
                                        <option value="MECH">MECH</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assign Faculty (Optional)</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                                        value={formData.facultyId}
                                        onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                                    >
                                        <option value="">Select Faculty Mentor</option>
                                        {faculties.map(f => (
                                            <option key={f.id} value={f.id}>{f.name} ({f.department})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex justify-center items-center"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Create Subject Curriculum
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
