import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Plus, CheckCircle, Users, DollarSign, X, FileText, Search, ArrowUpRight, ArrowDownLeft, Trash2 } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

export default function AdminFees() {
    const [activeTab, setActiveTab] = useState('overview'); // overview, structures, transactions
    const [stats, setStats] = useState({ totalFees: 0, totalCollected: 0, totalPending: 0, overdueCount: 0 });
    const [structures, setStructures] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '', department: '', semester: 1, totalAmount: '', academicYear: '2025-2026'
    });
    const [createdStructureId, setCreatedStructureId] = useState(null);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        try {
            const [statsRes, structRes, txnRes] = await Promise.all([
                fetch('http://localhost:5000/api/fees/stats', { headers }),
                fetch('http://localhost:5000/api/fees/structures', { headers }),
                fetch('http://localhost:5000/api/fees/transactions', { headers })
            ]);

            const statsData = statsRes.ok ? await statsRes.json() : { totalFees: 0, totalCollected: 0, totalPending: 0, overdueCount: 0 };
            const structData = structRes.ok ? await structRes.json() : [];
            const txnData = txnRes.ok ? await txnRes.json() : [];

            setStats(statsData);
            setStructures(Array.isArray(structData) ? structData : []);
            setTransactions(Array.isArray(txnData) ? txnData : []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching admin fees data:", error);
            setStats({ totalFees: 0, totalCollected: 0, totalPending: 0, overdueCount: 0 });
            setStructures([]);
            setTransactions([]);
            setLoading(false);
        }
    };

    const handleCreateStructure = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const payload = { ...formData, breakdown: [{ name: 'Tuition', amount: formData.totalAmount }] };
            const res = await fetch('http://localhost:5000/api/fees/structure', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json();
                setCreatedStructureId(data.uniqueId);
                setShowModal(false);
                fetchAllData(); // Refresh list
                alert("Fee Structure Created Successfully!");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleBulkAssign = async (structureId) => {
        if (!confirm("This will assign this fee structure to ALL students in that Department & Semester. Continue?")) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/fees/assign-bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ structureId })
            });
            const data = await res.json();
            alert(data.message);
            fetchAllData();
        } catch (error) {
            console.error(error);
        }
    };

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center px-4 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
        >
            <Icon className="w-4 h-4 mr-2" />
            {label}
        </button>
    );

    return (
        <DashboardLayout role="admin">
            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">Financial Governance</h1>
                        <p className="text-gray-500 mt-1">Manage fee structures, oversee collections, and track defaulters.</p>
                    </div>
                    <div className="flex space-x-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                        <TabButton id="overview" label="Overview" icon={ArrowUpRight} />
                        <TabButton id="structures" label="Fee Structures" icon={FileText} />
                        <TabButton id="transactions" label="Transactions" icon={DollarSign} />
                    </div>
                </div>

                {/* Overview View */}
                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Expected', value: stats.totalFees, color: 'text-gray-900' },
                                { label: 'Collected', value: stats.totalCollected, color: 'text-emerald-600' },
                                { label: 'Pending', value: stats.totalPending, color: 'text-orange-500' },
                                { label: 'Defaulters', value: stats.overdueCount, isCount: true, color: 'text-red-600' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                                    <h3 className={`text-2xl font-black mt-1 ${stat.color}`}>
                                        {stat.isCount ? stat.value : `₹${stat.value?.toLocaleString()}`}
                                    </h3>
                                </div>
                            ))}
                        </div>

                        {/* Recent Activity Graphic (Placeholder for chart) */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                            <h3 className="text-xl font-bold relative z-10">Collection Trends</h3>
                            <div className="h-48 flex items-end justify-between mt-6 gap-2 relative z-10">
                                {/* Mock Chart Bars */}
                                {[40, 65, 30, 80, 55, 90, 45, 70, 35, 60, 85, 50].map((h, i) => (
                                    <div key={i} className="w-full bg-indigo-500/30 rounded-t-lg relative group hover:bg-indigo-500 transition-colors" style={{ height: `${h}%` }}>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition">
                                            {h}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Structures View */}
                {activeTab === 'structures' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Academic Fee Templates</h2>
                            <button onClick={() => setShowModal(true)} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:scale-105 transition">
                                <Plus className="w-4 h-4 mr-2" /> Create New
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {structures.map(struct => (
                                <div key={struct.uniqueId} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-lg">{struct.academicYear}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">{struct.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{struct.department} • Sem {struct.semester}</p>

                                    <div className="my-6 border-t border-dashed border-gray-100"></div>

                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase">Total Fee</p>
                                            <p className="text-2xl font-black text-gray-900">₹{parseFloat(struct.totalAmount).toLocaleString()}</p>
                                        </div>
                                        <button
                                            onClick={() => handleBulkAssign(struct.uniqueId)}
                                            className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition"
                                        >
                                            Assign to All
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {structures.length === 0 && (
                                <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                    No fee structures created yet.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Transactions View */}
                {activeTab === 'transactions' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
                            {/* Filter placeholder */}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-xs uppercase text-gray-400 font-bold bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4">Transaction ID</th>
                                        <th className="px-6 py-4">Student</th>
                                        <th className="px-6 py-4">Fee Type</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {transactions.map(txn => (
                                        <tr key={txn.uniqueId} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 font-mono text-xs text-gray-500">{txn.transactionId}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{txn.student?.name || 'Unknown'}</div>
                                                <div className="text-xs text-gray-500">{txn.student?.rollNo}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {txn.studentFee?.structure?.name || 'Education Fee'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(txn.paymentDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900">
                                                ₹{parseFloat(txn.amount).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                                                    SUCCESS
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {transactions.length === 0 && (
                                        <tr><td colSpan="6" className="p-8 text-center text-gray-400">No transactions found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-200 relative">
                        <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition">
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-2xl font-black text-gray-900 mb-6">New Fee Structure</h3>

                        <form onSubmit={handleCreateStructure} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Structure Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. CSE 1st Year 2024"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Department</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        placeholder="CSE"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Semester</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                                        value={formData.semester}
                                        onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Total Fee Amount (₹)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                                    value={formData.totalAmount}
                                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all"
                            >
                                Create Fee Template
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
