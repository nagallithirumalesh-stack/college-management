import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft, Megaphone, Info, Calendar } from 'lucide-react';

export default function StudentAnnouncements() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/announcements', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setAnnouncements(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'Event': return <Calendar className="w-5 h-5 text-purple-500" />;
            case 'News': return <Megaphone className="w-5 h-5 text-blue-500" />;
            case 'Alert': return <Bell className="w-5 h-5 text-red-500" />;
            default: return <Info className="w-5 h-5 text-emerald-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
                    <button onClick={() => navigate(-1)} className="mr-4 p-2 hover:bg-gray-100 rounded-full transition">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Campus Circulars & Events</h1>
                </div>
            </div>

            <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
                {/* Feed */}
                <div className="space-y-4">
                    {loading ? <div className="text-center py-12 text-gray-400">Loading feeds...</div> :
                        announcements.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed text-gray-400">
                                No announcements found.
                            </div>
                        ) : (
                            announcements.map(item => (
                                <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-lg bg-gray-50`}>
                                                {getIcon(item.type)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{item.title}</h3>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                    <span className="mx-2">•</span>
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs uppercase font-bold tracking-wide text-gray-600">{item.type}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-wrap pl-12 text-sm leading-relaxed">
                                        {item.content}
                                    </p>
                                </div>
                            ))
                        )}
                </div>
            </div>
        </div>
    );
}
