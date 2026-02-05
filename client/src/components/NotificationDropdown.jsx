import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Info, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotificationDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch('http://localhost:5000/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.read).length);
            }
        } catch (error) {
            console.error("Failed to fetch notifications");
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds for new notifications
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const markAsRead = async (id, link) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Failed to mark read");
        }

        if (link) {
            setIsOpen(false);
            navigate(link);
        }
    };

    const markAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
        try {
            const token = localStorage.getItem('token');
            await fetch('http://localhost:5000/api/notifications/read-all', {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Failed to mark all read");
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-indigo-600 transition rounded-full hover:bg-indigo-50"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800 text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                                <Bell className="w-8 h-8 mb-2 opacity-20" />
                                <p className="text-xs">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map(note => (
                                <div
                                    key={note.id}
                                    onClick={() => markAsRead(note.id, note.relatedLink)}
                                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start space-x-3 transition border-b border-gray-50 last:border-0 ${!note.read ? 'bg-indigo-50/30' : ''}`}
                                >
                                    <div className="mt-0.5 flex-shrink-0">
                                        {getIcon(note.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm ${!note.read ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                                            {note.title}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{note.message}</p>
                                        <p className="text-[10px] text-gray-400 mt-1">
                                            {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    {!note.read && (
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
