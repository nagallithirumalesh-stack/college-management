import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User as UserIcon, Calendar, ArrowRight, Search, Loader } from 'lucide-react';


const StudentSubjects = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSubjects();
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
        } finally {
            setLoading(false);
        }
    };

    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const gradients = [
        'from-blue-500 to-indigo-600',
        'from-violet-500 to-purple-600',
        'from-emerald-500 to-teal-600',
        'from-orange-500 to-red-600',
        'from-pink-500 to-rose-600',
        'from-cyan-500 to-blue-600',
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">My Subjects</h1>
                    <p className="text-gray-500 mt-2">
                        Sem {user.semester} • {user.department}
                    </p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search subjects..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid */}
            {filteredSubjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSubjects.map((subject, index) => {
                        const gradient = gradients[index % gradients.length];

                        return (
                            <div
                                key={subject.id}
                                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col h-full"
                            >
                                <div className={`h-24 bg-gradient-to-r ${gradient} relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-white/10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/20">
                                        {subject.code}
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                        {subject.name}
                                    </h3>

                                    <div className="space-y-3 mt-4 flex-1">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <UserIcon className="w-4 h-4 mr-2 text-indigo-400" />
                                            <span className="font-medium">{subject.faculty?.name || 'TBA'}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 mr-2 text-indigo-400" />
                                            <span>4 Credits</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/student/subject/${subject.id}`)}
                                        className="mt-6 w-full py-3 rounded-xl bg-gray-50 text-gray-700 font-bold text-sm hover:bg-gray-100 transition flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600"
                                    >
                                        View Details
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900">No subjects found</h3>
                    <p className="text-gray-500">You don't have any subjects assigned for this semester yet.</p>
                </div>
            )}
        </div>
    );
};

export default StudentSubjects;
