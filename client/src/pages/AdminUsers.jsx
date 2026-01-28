import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Activity, Settings, UserPlus, Filter, Trash2, Search, X } from 'lucide-react';
import Logo from '../components/Logo';

export default function AdminUsers() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('faculty');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        department: 'CSE',
        semester: 1
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/auth/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        const token = localStorage.getItem('token');
        try {
            await fetch(`http://localhost:5000/api/auth/users/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(u => u._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Use existing token for admin validation if needed, though register is public usually, but here we likely want admin privileges implied or ensuring it works.
        // Actually /api/auth/register is public, but let's assume we use it.
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('User Created Successfully');
                setShowModal(false);
                fetchUsers(); // Refresh
                setFormData({ name: '', email: '', password: '', role: 'student', department: 'CSE', semester: 1 });
            } else {
                const err = await res.json();
                alert(err.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.role === activeTab &&
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col fixed h-full z-10">
                <div className="p-6 flex items-center">
                    <Logo className="h-8 w-8 mr-2" />
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                        Admin Portal
                    </h1>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <button onClick={() => navigate('/admin')} className="w-full flex items-center px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <Activity className="w-5 h-5 mr-3" />
                        Dashboard
                    </button>
                    <button onClick={() => navigate('/admin/subjects')} className="w-full flex items-center px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <BookOpen className="w-5 h-5 mr-3" />
                        Subjects
                    </button>
                    <button onClick={() => navigate('/admin/users')} className="w-full flex items-center px-4 py-3 bg-slate-800 text-white rounded-lg transition-colors">
                        <Users className="w-5 h-5 mr-3 text-blue-400" />
                        Users
                    </button>
                    <button onClick={() => navigate('/admin/events')} className="w-full flex items-center px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <Activity className="w-5 h-5 mr-3" />
                        Events
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 ml-64">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                        <p className="text-gray-500">Manage student and faculty accounts.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                        <UserPlus className="w-5 h-5 mr-2" />
                        Add User
                    </button>
                </div>

                {/* Tabs & Search */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex space-x-1 bg-white p-1 rounded-lg border border-gray-200">
                        <button
                            onClick={() => setActiveTab('faculty')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'faculty' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            Faculty
                        </button>
                        <button
                            onClick={() => setActiveTab('student')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'student' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            Students
                        </button>
                        <button
                            onClick={() => setActiveTab('admin')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'admin' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            Admins
                        </button>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mr-3">
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className="font-semibold text-gray-900">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {user.department || '-'} {user.semester ? `(Sem ${user.semester})` : ''}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete User"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                                        No {activeTab}s found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Add New User</h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input
                                        type="password"
                                        className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500"
                                        required
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                        <select
                                            className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500"
                                            value={formData.role}
                                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        >
                                            <option value="student">Student</option>
                                            <option value="faculty">Faculty</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                        <select
                                            className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500"
                                            value={formData.department}
                                            onChange={e => setFormData({ ...formData, department: e.target.value })}
                                        >
                                            <option value="CSE">CSE</option>
                                            <option value="ECE">ECE</option>
                                            <option value="EEE">EEE</option>
                                            <option value="MECH">MECH</option>
                                        </select>
                                    </div>
                                </div>
                                {formData.role === 'student' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                                        <input
                                            type="number"
                                            min="1" max="8"
                                            className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500"
                                            value={formData.semester}
                                            onChange={e => setFormData({ ...formData, semester: e.target.value })}
                                        />
                                    </div>
                                )}
                                <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition">
                                    Create Account
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
