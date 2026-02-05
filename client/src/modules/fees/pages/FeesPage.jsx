import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, CreditCard, CheckCircle, AlertCircle, Calendar, Plus, X } from 'lucide-react';

export default function FeesPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [showPayModal, setShowPayModal] = useState(false);
    const [payAmount, setPayAmount] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/fees/my', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.hasFeeRecord) {
                setData(result);
            }
        } catch (error) {
            console.error("Error fetching fees:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessing(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/fees/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ amount: parseFloat(payAmount) })
            });
            const result = await res.json();

            if (res.ok) {
                alert("Payment Successful!");
                setShowPayModal(false);
                setPayAmount('');
                fetchFees(); // Refresh data
            } else {
                alert(result.message || "Payment Failed");
            }
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Payment failed due to server error.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading finance data...</div>;

    // If no data
    if (!data) return (
        <div className="min-h-screen bg-slate-50 font-sans p-10 flex flex-col items-center justify-center">
            <CreditCard className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-700">No Fee Record Found</h2>
            <p className="text-gray-500 mt-2">Please contact the admin to assign a fee structure.</p>
            <button onClick={() => navigate(-1)} className="mt-6 text-indigo-600 font-bold hover:underline">Go Back</button>
        </div>
    );

    // Parse breakdown if it exists, else dummy breakdown based on total
    const breakdown = data.breakdown || [
        { head: "Tuition Fee", amount: data.totalAmount * 0.7 },
        { head: "Development Fee", amount: data.totalAmount * 0.3 }
    ];

    const generateInvoice = (transaction = null) => {
        if (!data) return;

        const invoiceId = transaction ? transaction.uniqueId : `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;
        const date = transaction ? new Date(transaction.paymentDate).toLocaleDateString() : new Date().toLocaleDateString();
        const amount = transaction ? transaction.amount : data.totalAmount;
        const status = transaction ? transaction.status : (data.pendingAmount === 0 ? 'PAID' : 'PENDING');

        // Items
        let itemsHTML = '';
        if (transaction) {
            itemsHTML = `
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">Fee Payment (${transaction.paymentMode})</td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${transaction.amount.toLocaleString()}</td>
                </tr>
             `;
        } else {
            itemsHTML = breakdown.map(item => `
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.head || item.name}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${item.amount.toLocaleString()}</td>
                </tr>
            `).join('');
        }

        const invoiceHTML = `
            <html>
            <head>
                <title>Invoice #${invoiceId}</title>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
                    .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
                    .logo { font-size: 24px; font-weight: bold; color: #4F46E5; }
                    .invoice-details { text-align: right; }
                    .bill-to { margin-bottom: 30px; }
                    table { w-full; border-collapse: collapse; margin-bottom: 30px; width: 100%; }
                    th { text-align: left; padding: 12px; background: #f9fafb; border-bottom: 2px solid #e5e7eb; }
                    .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
                    .footer { margin-top: 50px; text-align: center; color: #9ca3af; font-size: 12px; }
                    .stamp { 
                        display: inline-block; padding: 5px 15px; border: 2px solid ${status === 'SUCCESS' || status === 'PAID' ? '#10B981' : '#F59E0B'}; 
                        color: ${status === 'SUCCESS' || status === 'PAID' ? '#10B981' : '#F59E0B'}; 
                        border-radius: 5px; transform: rotate(-5deg); font-weight: bold;
                        font-size: 20px; margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">EduTrack Institute</div>
                    <div class="invoice-details">
                        <h1>INVOICE</h1>
                        <p>#${invoiceId}</p>
                        <p>Date: ${date}</p>
                    </div>
                </div>

                <div class="bill-to">
                    <h3>Bill To:</h3>
                    <p><strong>${user.name}</strong></p>
                    <p>${user.email}</p>
                    <p>Roll No: ${user.rollNumber || 'N/A'}</p>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th style="text-align: right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHTML}
                    </tbody>
                </table>

                <div class="total">
                    Total: ₹${amount.toLocaleString()}
                </div>

                <div style="text-align: center;">
                    <div class="stamp">${status}</div>
                </div>

                <div class="footer">
                    <p>This is a computer-generated invoice and does not require a signature.</p>
                    <p>EduTrack Institute of Technology • Bangalore, India</p>
                </div>
                <script>window.print();</script>
            </body>
            </html>
        `;

        const win = window.open('', '_blank');
        win.document.write(invoiceHTML);
        win.document.close();
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 transition">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        <span className="font-bold">Back</span>
                    </button>
                    <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                        Fees & Finance
                    </h1>
                    <div className="w-10"></div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">

                {/* 1. Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-gray-400 text-sm font-medium mb-1">Total Outstanding</p>
                            <h2 className="text-3xl font-black text-white">₹{data.pendingAmount.toLocaleString()}</h2>
                            {data.pendingAmount > 0 && (
                                <button
                                    onClick={() => setShowPayModal(true)}
                                    className="mt-6 w-full py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg"
                                >
                                    Pay Now
                                </button>
                            )}
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10">
                            <CreditCard className="w-32 h-32 -mr-6 -mb-6" />
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-center">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-emerald-700 text-sm font-bold uppercase tracking-wider">Paid So Far</p>
                                <p className="text-2xl font-black text-gray-900">₹{data.paidAmount.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="h-2 bg-emerald-500 rounded-full" style={{ width: `${data.totalAmount > 0 ? (data.paidAmount / data.totalAmount) * 100 : 100}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-right">{data.totalAmount > 0 ? Math.round((data.paidAmount / data.totalAmount) * 100) : 100}% Completed</p>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-center">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-red-700 text-sm font-bold uppercase tracking-wider">Next Due Date</p>
                                <p className="text-2xl font-black text-gray-900">{data.dueDate || 'N/A'}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">To avoid late fees of ₹500/day, please clear the dues before the deadline.</p>
                    </div>
                </div>

                {/* 2. Fee Structure Table */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-gray-800">Fee Structure: {data.structureName}</h3>
                        <button
                            onClick={() => generateInvoice()}
                            className="text-sm text-indigo-600 font-bold hover:underline flex items-center"
                        >
                            <Download className="w-4 h-4 mr-1" /> Download Invoice
                        </button>
                    </div>
                    <div className="p-0">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Fee Head</th>
                                    <th className="px-6 py-4 text-right">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {breakdown.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-900">{item.head || item.name}</td>
                                        <td className="px-6 py-4 text-right text-gray-600">₹{item.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-50 font-bold">
                                    <td className="px-6 py-4 text-gray-900">Total</td>
                                    <td className="px-6 py-4 text-right text-gray-900">₹{data.totalAmount.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3. Recent Transactions */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-4">Recent Transactions</h3>
                    {data.transactions.length === 0 ? (
                        <p className="text-gray-500 text-sm">No transactions yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {data.transactions.map((txn, index) => (
                                <div key={txn.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-indigo-100 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${txn.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{txn.paymentMode} Payment</p>
                                            <p className="text-xs text-gray-500">ID: {txn.uniqueId.slice(0, 8)}... • {new Date(txn.paymentDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">- ₹{txn.amount.toLocaleString()}</p>
                                        <div className="flex flex-col items-end">
                                            <span className={`text-[10px] font-bold uppercase mb-1 ${txn.status === 'SUCCESS' ? 'text-emerald-600' : 'text-orange-600'}`}>
                                                {txn.status}
                                            </span>
                                            {txn.status === 'SUCCESS' && (
                                                <button
                                                    onClick={() => generateInvoice(txn)}
                                                    className="text-xs text-indigo-600 hover:underline flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Download className="w-3 h-3 mr-1" /> Receipt
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </main>

            {/* Payment Modal */}
            {showPayModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200 relative">
                        <button onClick={() => setShowPayModal(false)} className="absolute top-6 right-6 p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">Make Payment</h3>
                            <p className="text-gray-500 text-sm mt-1">Pay your outstanding fees securely.</p>
                        </div>

                        <form onSubmit={handlePayment} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Payment Amount (₹)</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max={data.pendingAmount}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-2xl font-black text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                                    value={payAmount}
                                    onChange={(e) => setPayAmount(e.target.value)}
                                    placeholder="0.00"
                                />
                                <p className="text-xs text-gray-400 mt-1 text-right">Max Payable: ₹{data.pendingAmount.toLocaleString()}</p>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Processing...' : `Pay ₹${payAmount || '0'}`}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
