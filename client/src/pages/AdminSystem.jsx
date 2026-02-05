import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Settings, Shield, Bell, Activity, Save, ArrowLeft, Database, Server, Smartphone } from 'lucide-react';

export default function AdminSystem() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);

    // Mock Settings State
    const [settings, setSettings] = useState({
        siteName: 'College ERP',
        maintenanceMode: false,
        allowRegistration: true,
        sessionTimeout: 30,
        emailNotifications: true,
        pushNotifications: false,
        twoFactorAuth: true
    });

    const handleSave = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert('Settings saved successfully!');
        }, 1000);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">General Settings</h3>
                            <div className="grid gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Application Name</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                        value={settings.siteName}
                                        onChange={e => setSettings({ ...settings, siteName: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Maintenance Mode</h4>
                                        <p className="text-sm text-gray-500">Prevent users from accessing the system during updates.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={settings.maintenanceMode} onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Allow Student Registration</h4>
                                        <p className="text-sm text-gray-500">Enable or disable new student sign-ups.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={settings.allowRegistration} onChange={e => setSettings({ ...settings, allowRegistration: e.target.checked })} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Security Configuration</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div>
                                    <h4 className="font-semibold text-gray-800">Enforce Two-Factor Authentication</h4>
                                    <p className="text-sm text-gray-500">Require 2FA for all admin accounts.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={settings.twoFactorAuth} onChange={e => setSettings({ ...settings, twoFactorAuth: e.target.checked })} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Session Timeout (Minutes)</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                    value={settings.sessionTimeout}
                                    onChange={e => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Notification Preferences</h3>
                        <div className="grid gap-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-4">
                                        <Bell className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Email Notifications</h4>
                                        <p className="text-sm text-gray-500">Receive system alerts via email.</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={settings.emailNotifications} onChange={e => setSettings({ ...settings, emailNotifications: e.target.checked })} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center">
                                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg mr-4">
                                        <Smartphone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Push Notifications</h4>
                                        <p className="text-sm text-gray-500">Enable mobile push alerts.</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={settings.pushNotifications} onChange={e => setSettings({ ...settings, pushNotifications: e.target.checked })} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                );
            case 'health':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">System Health</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
                                <div className="flex items-center mb-4">
                                    <Database className="w-6 h-6 text-emerald-600 mr-2" />
                                    <h4 className="font-bold text-emerald-800">Database Status</h4>
                                </div>
                                <p className="text-emerald-700 font-medium">Operational</p>
                                <p className="text-sm text-emerald-600 mt-1">Last backup: 2 hours ago</p>
                            </div>
                            <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                                <div className="flex items-center mb-4">
                                    <Server className="w-6 h-6 text-blue-600 mr-2" />
                                    <h4 className="font-bold text-blue-800">API Gateway</h4>
                                </div>
                                <p className="text-blue-700 font-medium">Online</p>
                                <p className="text-sm text-blue-600 mt-1">Uptime: 99.9%</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans relative">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 shadow-sm supports-[backdrop-filter]:bg-white/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <button onClick={() => navigate('/admin')} className="mr-4 p-2 hover:bg-gray-100 rounded-xl transition group">
                            <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-indigo-600 transition" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">System Settings</h1>
                            <p className="text-xs text-gray-500 font-medium">Configure application parameters</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 active:scale-95 duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                    </button>
                </div>
            </div>

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Sidebar Tabs */}
                    <div className="md:col-span-3 space-y-2">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'general' ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <Settings className="w-5 h-5 mr-3" /> General
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'security' ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <Shield className="w-5 h-5 mr-3" /> Security
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'notifications' ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <Bell className="w-5 h-5 mr-3" /> Notifications
                        </button>
                        <button
                            onClick={() => setActiveTab('health')}
                            className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'health' ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-200' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <Activity className="w-5 h-5 mr-3" /> System Health
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="md:col-span-9">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
