import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock, Filter, Eye } from 'lucide-react';
import Logo from '../components/Logo';
import LetterPreviewModal from '../components/LetterPreviewModal';

export default function FacultyApprovals() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Pending'); // Pending, Approved, Rejected, All
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`http://localhost:5000/api/od/list?status=${filter}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    setRequests(await res.json());
                }
            } catch (error) {
                console.error("Error fetching requests:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [filter]);

    const handleApprovalAction = async (id, status) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:5000/api/od/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    status,
                    remarks: status === 'Approved' ? 'Approved via Portal' : 'Rejected via Portal'
                })
            });

            if (res.ok) {
                // Refresh list
                const updatedRequests = requests.filter(req => req._id !== id);
                // If we are in 'All' view, we might update the status locally instead of removing
                if (filter === 'All') {
                    setRequests(requests.map(req => req._id === id ? { ...req, status } : req));
                } else {
                    setRequests(updatedRequests);
                }
                setSelectedRequest(null);
                alert(`Request ${status} successfully.`);
            } else {
                alert('Failed to update status.');
            }
        } catch (error) {
            console.error("Action Error:", error);
            alert("Error processing request.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Modal */}
            {selectedRequest && (
                <LetterPreviewModal
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    onAction={handleApprovalAction}
                // Hide action buttons in modal if not pending, optionally. 
                // But maybe faculty wants to change decision? Let's leave them or disable if strict.
                // For now, allow re-decision or just keep it simple.
                />
            )}

            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center cursor-pointer hover:opacity-80 transition" onClick={() => navigate('/faculty')}>
                    <ArrowLeft className="w-5 h-5 mr-3 text-gray-500" />
                    <Logo className="h-8 w-8 mr-2" />
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                        Approvals & Requests
                    </h1>
                </div>
                <div className="flex space-x-2">
                    {['Pending', 'Approved', 'Rejected', 'All'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${filter === f
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto w-full p-6">

                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading requests...</div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
                            <Filter className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No {filter} Requests</h3>
                        <p className="text-gray-500">There are no requests matching this filter.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                        <th className="px-6 py-4">Student</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Dates</th>
                                        <th className="px-6 py-4">Reason</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {requests.map(req => (
                                        <tr key={req._id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold mr-3">
                                                        {req.student?.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">{req.student?.name}</p>
                                                        <p className="text-xs text-gray-500">{req.student?.userId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${req.type === 'OD' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {req.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(req.dates[0]).toLocaleDateString()}
                                                {req.dates.length > 1 && ` +${req.dates.length - 1} days`}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={req.reason}>
                                                {req.reason}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                        req.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setSelectedRequest(req)}
                                                    className="text-gray-400 hover:text-emerald-600 transition p-2"
                                                    title="View Letter"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
