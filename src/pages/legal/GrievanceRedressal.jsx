import React, { useState } from 'react';
import { Mail, Phone, Clock, ShieldCheck, FileCheck, Send } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const GrievanceRedressal = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        category: 'privacy',
        complaintDetails: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [ticketId, setTicketId] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const res = await api.post('/legal/grievance', formData);
            if (res.data.success) {
                setTicketId(res.data.ticketId);
                toast.success('Grievance ticket submitted successfully!');
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to submit grievance complaint');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold uppercase tracking-wider border border-purple-400/30">
                        <ShieldCheck size={14} /> Statutory Redressal Mechanism
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight">Grievance Redressal Officer</h1>
                    <p className="text-purple-200 text-sm font-medium">DPDP Act 2023 & Information Technology Act 2000 Grievance Desk</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Officer Information Card */}
                <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-6 lg:col-span-1 h-fit">
                    <h2 className="text-xl font-black text-gray-900">Designated Grievance Officer</h2>
                    
                    <div className="space-y-4 text-xs font-medium text-gray-600">
                        <div>
                            <span className="font-extrabold text-gray-900 block text-sm">Grievance Redressal Desk</span>
                            <p className="text-gray-400">MatsyaLink Data Protection Officer</p>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <Mail className="text-purple-600 flex-shrink-0" size={18} />
                            <div>
                                <span className="font-bold text-gray-900 block">Email Address</span>
                                <a href="mailto:grievance@matsyalink.com" className="text-blue-600 underline">grievance@matsyalink.com</a>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <Phone className="text-purple-600 flex-shrink-0" size={18} />
                            <div>
                                <span className="font-bold text-gray-900 block">Helpline Number</span>
                                <span>+91 7432879256 (Mon - Sat, 10 AM - 6 PM IST)</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <Clock className="text-purple-600 flex-shrink-0" size={18} />
                            <div>
                                <span className="font-bold text-gray-900 block">Response Timelines (SLA)</span>
                                <span>Acknowledgment: Within 24 hours<br/>Resolution: Within 72 business hours</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Complaint Submission Form */}
                <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm lg:col-span-2">
                    {ticketId ? (
                        <div className="text-center py-12 space-y-4">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
                                <FileCheck size={32} />
                            </div>
                            <h3 className="font-black text-gray-900 text-2xl">Grievance Ticket Registered</h3>
                            <p className="text-sm text-gray-500 max-w-md mx-auto">
                                Your reference ID is <strong className="text-gray-900 font-extrabold">{ticketId}</strong>. Our Grievance Officer will review your complaint and respond within 72 hours.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <h2 className="text-xl font-black text-gray-900">File a Formal Grievance Complaint</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name *</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                                    <input 
                                        type="email" 
                                        required 
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-600"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Complaint Category *</label>
                                    <select 
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-600 bg-white font-bold"
                                    >
                                        <option value="privacy">Personal Data / Privacy Violation</option>
                                        <option value="consent">Consent Withdrawal Issue</option>
                                        <option value="fraud">Listing Fraud / Fraudulent Seller</option>
                                        <option value="account">Account Deletion Request Issue</option>
                                        <option value="other">Other Regulatory Violation</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Complaint Details *</label>
                                <textarea 
                                    rows={5}
                                    required
                                    value={formData.complaintDetails}
                                    onChange={(e) => setFormData({ ...formData, complaintDetails: e.target.value })}
                                    placeholder="Provide detailed information regarding your complaint..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-600"
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
                            >
                                <Send size={16} />
                                {submitting ? 'Submitting Ticket...' : 'Submit Grievance Complaint'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GrievanceRedressal;
