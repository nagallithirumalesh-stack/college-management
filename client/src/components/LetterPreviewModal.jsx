import { X, CheckCircle, XCircle } from 'lucide-react';

export default function LetterPreviewModal({ request, onClose, onAction, actionLoading }) {
    if (!request) return null;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800">Letter Preview</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-8 overflow-y-auto font-serif text-gray-800 leading-relaxed text-sm space-y-6 flex-1 bg-white">
                    <div className="text-right">
                        <p>{formatDate(request.createdAt)}</p>
                    </div>

                    <div>
                        <p className="font-bold">To,</p>
                        <p>The Faculty / Head of Department,</p>
                        <p>Smart Campus University.</p>
                    </div>

                    <div>
                        <p><span className="font-bold">From:</span> {request.student?.name} ({request.student?.userId || 'Student'})</p>
                    </div>

                    <div>
                        <p className="font-bold underline">
                            Subject: Request for {request.type === 'OD' ? 'On-Duty' : 'Leave'} Permission - Reg.
                        </p>
                    </div>

                    <div>
                        <p>Respected Sir/Madam,</p>
                        <p className="mt-4 indent-8">
                            I am writing to formally request {request.type === 'OD' ? 'On-Duty permission' : 'leave'}
                            from <span className="font-semibold">{formatDate(request.dates[0])}</span>
                            {request.dates.length > 1 ? <span> to <span className="font-semibold">{formatDate(request.dates[request.dates.length - 1])}</span></span> : ''}.
                        </p>
                        <p className="mt-2 indent-8">
                            {request.reason}
                        </p>
                        <p className="mt-4">
                            I kindly request you to approve my application. I will ensure to catch up on any missed coursework.
                        </p>
                    </div>

                    <div className="mt-12">
                        <p>Thanking You,</p>
                        <p className="mt-8 font-bold">{request.student?.name}</p>
                        <p className="text-gray-500 text-xs">Student ID: {request.student?.userId}</p>
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition text-sm"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => onAction(request._id, 'Rejected')}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-red-100 text-red-700 font-bold rounded-lg hover:bg-red-200 transition flex items-center text-sm disabled:opacity-50"
                    >
                        <XCircle className="w-4 h-4 mr-1" /> Reject
                    </button>
                    <button
                        onClick={() => onAction(request._id, 'Approved')}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition flex items-center text-sm disabled:opacity-50 shadow-sm"
                    >
                        <CheckCircle className="w-4 h-4 mr-1" /> {actionLoading ? 'Processing...' : 'Approve Request'}
                    </button>
                </div>
            </div>
        </div>
    );
}
