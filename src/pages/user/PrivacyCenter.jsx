import React, { useState, useEffect } from 'react';
import { ShieldCheck, Download, Trash2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const PrivacyCenter = () => {
    const [consents, setConsents] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteReason, setDeleteReason] = useState('');

    useEffect(() => {
        api.get('/legal/consent/my-consents')
            .then(res => setConsents(res.data))
            .catch(console.error);
    }, []);

    const handleDownloadData = () => {
        window.open('/api/legal/user-data/export', '_blank');
    };

    const handleRequestDeletion = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/legal/user-data/delete-request', { reason: deleteReason });
            toast.success(res.data.msg);
            setIsDeleting(false);
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to submit deletion request');
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto py-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <ShieldCheck className="text-blue-600" size={24} />
                    DPDP User Privacy & Rights Center
                </h1>
                <p className="text-xs text-gray-500 font-bold">
                    Exercise your statutory rights under the Digital Personal Data Protection Act, 2023.
                </p>
            </div>

            {/* Rights Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="font-extrabold text-gray-900 text-base">Right to Access Personal Data</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Download a machine-readable JSON copy of all personal profile data, listings, buying posts, and order history associated with your account.
                    </p>
                    <button 
                        onClick={handleDownloadData}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2"
                    >
                        <Download size={14} /> Download My Data Export
                    </button>
                </div>

                {/* Account Deletion Card */}
                <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="font-extrabold text-gray-900 text-base text-red-600">Right to Erasure & Deletion</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Request permanent account closure and erasure of personal identification details from active databases under DPDP Section 12.
                    </p>
                    <button 
                        onClick={() => setIsDeleting(true)}
                        className="px-5 py-2.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
                    >
                        <Trash2 size={14} /> Request Account Deletion
                    </button>
                </div>
            </div>

            {/* Deletion Modal */}
            {isDeleting && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
                        <h3 className="text-lg font-black text-red-600 flex items-center gap-2">
                            <AlertTriangle size={20} /> Confirm Account Deletion Request
                        </h3>
                        <p className="text-xs text-gray-600 font-medium leading-relaxed">
                            Once submitted, our Grievance Officer will review your request. All profile data, active listings, and identity documents will be queued for permanent deletion within 30 days.
                        </p>
                        <form onSubmit={handleRequestDeletion} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Reason for leaving (Optional)</label>
                                <textarea 
                                    rows={3}
                                    value={deleteReason}
                                    onChange={(e) => setDeleteReason(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-gray-200 text-xs"
                                    placeholder="Tell us why you wish to delete your account..."
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button 
                                    type="button" 
                                    onClick={() => setIsDeleting(false)} 
                                    className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700"
                                >
                                    Confirm Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrivacyCenter;
