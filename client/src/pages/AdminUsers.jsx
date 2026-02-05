import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, UserPlus, Filter, Trash2, Search, X, Shield, GraduationCap, Briefcase } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

export default function AdminUsers() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('student');
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
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                console.error('Failed to fetch users');
            }
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
            setUsers(users.filter(u => u.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            // In a real app, use a dedicated admin-create-user endpoint that requires admin token
            // For this demo, we reuse the robust register endpoint
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('User Created Successfully');
                setShowModal(false);
                fetchUsers(); // Refresh
                setFormData({ name: '', email: '', password: '', role: activeTab, department: 'CSE', semester: 1 });
            } else {
                const err = await res.json();
                alert(err.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Filter logic
    const filteredUsers = users.filter(user =>
        (user.role === activeTab) &&
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Tab configuration
    const tabs = [
        { id: 'student', label: 'Students', icon: GraduationCap, color: 'text-violet-600', bg: 'bg-violet-50' },
        { id: 'faculty', label: 'Faculty', icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { id: 'admin', label: 'Admins', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50' },
    ];

    return (
        <DashboardLayout role="admin">
            <div className="p-8 max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">User Management</h1>
                        <p className="text-gray-500 mt-1">Manage access and roles for the entire campus.</p>
                    </div>
                    <button
                        onClick={() => { setFormData({ ...formData, role: activeTab }); setShowModal(true); }}
                        className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all"
                    >
                        <UserPlus className="w-5 h-5 mr-2" />
                        Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </button>
                </header>

                {/* Controls Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Tabs */}
                    <div className="flex bg-gray-100/50 p-1.5 rounded-xl space-x-2 w-full md:w-auto overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                    }`}
                            >
                                <tab.icon className={`w-4 h-4 mr-2 ${activeTab === tab.id ? tab.color : 'text-gray-400'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}s...`}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 font-bold border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">User Identity</th>
                                    <th className="px-6 py-4">Department / Details</th>
                                    <th className="px-6 py-4">Role Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan="4" className="text-center py-12 text-gray-400">Loading users...</td></tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="py-20 text-center">
                                            <div className="flex flex-col items-center justify-center opacity-50">
                                                <Users className="w-16 h-16 text-gray-300 mb-4" />
                                                <p className="text-lg font-bold text-gray-500">No {activeTab}s found</p>
                                                <p className="text-sm text-gray-400">Try adjusting your search filters</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-indigo-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mr-3 shadow-sm ${user.role === 'admin' ? 'bg-blue-100 text-blue-600' :
                                                        user.role === 'faculty' ? 'bg-emerald-100 text-emerald-600' : 'bg-violet-100 text-violet-600'
                                                        }`}>
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{user.name}</p>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">
                                                    <span className="font-bold text-gray-900">{user.department || 'General'}</span>
                                                    {user.role === 'student' && <span className="text-xs text-gray-400 block">Semester {user.semester}</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${user.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                                                    user.role === 'faculty' ? 'bg-emerald-100 text-emerald-700' : 'bg-violet-100 text-violet-700'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-5 h-5" />
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

            {/* Create User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">Add New User</h3>
                                <p className="text-sm text-gray-500 mt-1">Create an account for a student or faculty member.</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Role</label>
                                    <div className="flex bg-gray-100 p-1 rounded-xl">
                                        {['student', 'faculty', 'admin'].map(r => (
                                            <button
                                                key={r}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, role: r })}
                                                className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-all ${formData.role === r
                                                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                                                    : 'text-gray-500 hover:bg-gray-200/50'
                                                    }`}
                                            >
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                                        required
                                        placeholder="e.g. John Doe"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                                        required
                                        placeholder="e.g. john@college.edu"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                                    <input
                                        type="password"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                                        required
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Department</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                                        value={formData.department}
                                        onChange={e => setFormData({ ...formData, department: e.target.value })}
                                    >
                                        <option value="CSE">CSE</option>
                                        <option value="ECE">ECE</option>
                                        <option value="EEE">EEE</option>
                                        <option value="MECH">MECH</option>
                                        <option value="CIVIL">CIVIL</option>
                                        <option value="IT">IT</option>
                                    </select>
                                </div>

                                {formData.role === 'student' && (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Semester</label>
                                        <input
                                            type="number"
                                            min="1" max="8"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                                            value={formData.semester}
                                            onChange={e => setFormData({ ...formData, semester: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:scale-[1.01] transition-all flex justify-center items-center">
                                <UserPlus className="w-5 h-5 mr-2" />
                                Create Account
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
