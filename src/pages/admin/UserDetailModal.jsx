import React, { useState } from 'react';
import { 
    X, ShieldCheck, User as UserIcon, AlertCircle, Clock, 
    MapPin, Mail, Phone, Calendar, Trash2, CheckCircle, XCircle, Flag
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const UserDetailModal = ({ user, onClose, onApprove, onReject, onSuspend, onDelete, onUnflag }) => {
    const { t, formatDigit } = useLanguage();
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectInput, setShowRejectInput] = useState(false);

    if (!user) return null;

    const handleReject = () => {
        if (!rejectReason) return;
        onReject(user._id, rejectReason);
        setShowRejectInput(false);
        setRejectReason("");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[3rem] shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 animate-in fade-in zoom-in-95">
                <div className="p-8 sm:p-12 space-y-10">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center overflow-hidden ring-4 ring-gray-50 shadow-lg shrink-0">
                                {user.profilePicture ? (
                                    <img src={user.profilePicture} className="w-full h-full object-cover" alt={`${user.name}'s profile`} />
                                ) : (
                                    <UserIcon size={40} className="text-gray-300" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-gray-900">{user.name}</h3>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 font-bold uppercase tracking-widest text-xs rounded-full">
                                        {user.role}
                                    </span>
                                    {user.verifiedStatus && (
                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 font-bold uppercase tracking-widest text-xs rounded-full flex items-center gap-1">
                                            <ShieldCheck size={14} /> Verified
                                        </span>
                                    )}
                                    <span className={`px-3 py-1 font-bold uppercase tracking-widest text-xs rounded-full ${
                                        user.accountStatus === 'active' ? 'bg-green-50 text-green-600' :
                                        user.accountStatus === 'suspended' ? 'bg-red-50 text-red-600' :
                                        'bg-orange-50 text-orange-600'
                                    }`}>
                                        {user.accountStatus}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all shrink-0">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Info Column */}
                        <div className="space-y-8">
                            
                            <div className="space-y-4">
                                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">Contact & Location</h4>
                                <div className="bg-gray-50 p-6 rounded-[2rem] space-y-4">
                                    <div className="flex items-center gap-3 text-gray-600 font-medium">
                                        <Phone className="text-primary shrink-0" size={18} />
                                        <span>+91 {formatDigit(user.phone || 'N/A')}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 font-medium">
                                        <Mail className="text-primary shrink-0" size={18} />
                                        <span className="break-all">{user.email || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-600 font-medium">
                                        <MapPin className="text-primary shrink-0 mt-1" size={18} />
                                        <div>
                                            <p>State: <span className="font-bold text-gray-800">{user.district || 'N/A'}</span></p>
                                            <p>District: <span className="font-bold text-gray-800">{user.localDistrict || 'N/A'}</span></p>
                                            <p>Police Station: <span className="font-bold text-gray-800">{user.policeStation || 'N/A'}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 font-medium">
                                        <Calendar className="text-primary shrink-0" size={18} />
                                        <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Fraud Detection / Trust Score */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">Trust & Safety</h4>
                                <div className={`p-6 rounded-[2rem] space-y-4 ${user.isFlagged ? 'bg-red-50 border border-red-100' : 'bg-gray-50'}`}>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-500">Trust Score</span>
                                        <span className={`text-xl font-black ${user.trustScore < 50 ? 'text-red-600' : user.trustScore < 80 ? 'text-orange-600' : 'text-green-600'}`}>
                                            {user.trustScore ?? 100}/100
                                        </span>
                                    </div>
                                    {user.isFlagged && (
                                        <div className="flex items-start gap-3 mt-4 text-red-600 font-medium">
                                            <Flag className="shrink-0 mt-1" size={18} />
                                            <div>
                                                <p className="font-bold text-red-700">Flagged Account</p>
                                                <p className="text-sm mt-1">{user.fraudReason || 'Suspicious activity detected'}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Verification History Timeline */}
                            {user.verificationHistory && user.verificationHistory.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">Verification History</h4>
                                    <div className="bg-gray-50 p-6 rounded-[2rem] space-y-6 relative before:absolute before:inset-0 before:ml-10 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                        {user.verificationHistory.slice().reverse().map((hist, idx) => (
                                            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                {/* Icon */}
                                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow ${
                                                    hist.status === 'verified' ? 'bg-green-500' :
                                                    hist.status === 'rejected' ? 'bg-orange-500' :
                                                    hist.status === 'suspended' ? 'bg-red-500' : 'bg-gray-400'
                                                }`}>
                                                    {hist.status === 'verified' ? <CheckCircle className="text-white" size={16} /> :
                                                     hist.status === 'rejected' ? <AlertCircle className="text-white" size={16} /> :
                                                     hist.status === 'suspended' ? <XCircle className="text-white" size={16} /> :
                                                     <Clock className="text-white" size={16} />}
                                                </div>
                                                {/* Card */}
                                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                                                    <div className="flex items-center justify-between space-x-2 mb-1">
                                                        <div className="font-bold text-slate-900 capitalize">{hist.status}</div>
                                                        <time className="text-xs font-medium text-slate-500">{new Date(hist.changedAt).toLocaleDateString()}</time>
                                                    </div>
                                                    <div className="text-slate-600 text-sm">{hist.reason || 'No reason provided'}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Documents Column */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">Aadhaar Card</h4>
                                {user.aadhaarCard ? (
                                    <div className="rounded-[2rem] overflow-hidden shadow-lg border-4 border-gray-50 relative group cursor-pointer h-[250px]">
                                        <img src={user.aadhaarCard} alt="Aadhaar" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <a href={user.aadhaarCard} target="_blank" rel="noreferrer" className="text-white font-black underline">View Full Size</a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-[2rem] border-4 border-dashed border-gray-200 h-[250px] flex items-center justify-center bg-gray-50">
                                        <p className="text-gray-400 font-bold text-sm">Aadhaar not submitted</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">Verification Video</h4>
                                {user.verificationVideo ? (
                                    <div className="rounded-[2rem] overflow-hidden shadow-lg border-4 border-gray-50 bg-black h-[250px]">
                                        <video src={user.verificationVideo} controls className="w-full h-full object-contain" />
                                    </div>
                                ) : (
                                    <div className="rounded-[2rem] border-4 border-dashed border-gray-200 h-[250px] flex items-center justify-center bg-gray-50">
                                        <p className="text-gray-400 font-bold text-sm">Video not submitted</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t border-gray-100">
                        {showRejectInput ? (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 bg-orange-50 p-6 rounded-3xl border border-orange-100">
                                <label className="block text-sm font-bold text-orange-900 mb-2">Reason for Rejection</label>
                                <textarea 
                                    placeholder="Please explain why the verification is being rejected..."
                                    className="w-full p-4 rounded-2xl bg-white border border-orange-200 outline-none focus:ring-2 focus:ring-orange-400 text-sm font-medium"
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    rows={3}
                                />
                                <div className="flex gap-2 justify-end">
                                    <button onClick={() => setShowRejectInput(false)} className="btn bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300">Cancel</button>
                                    <button onClick={handleReject} disabled={!rejectReason} className="btn bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                        Confirm Reject
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-wrap items-center gap-4 justify-between">
                                <div className="flex gap-3">
                                    {(!user.verifiedStatus || user.accountStatus !== 'active') && (
                                        <button onClick={() => onApprove(user._id)} className="btn bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2">
                                            <ShieldCheck size={18} /> Approve Verification
                                        </button>
                                    )}
                                    {user.accountStatus !== 'active' && user.accountStatus !== 'suspended' && (
                                        <button onClick={() => setShowRejectInput(true)} className="btn bg-orange-50 text-orange-600 px-6 py-3 rounded-2xl font-black hover:bg-orange-600 hover:text-white transition-all flex items-center gap-2">
                                            <AlertCircle size={18} /> Reject Docs
                                        </button>
                                    )}
                                    {user.accountStatus === 'active' && (
                                        <button onClick={() => onSuspend(user._id)} className="btn bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-black hover:bg-red-600 hover:text-white transition-all flex items-center gap-2">
                                            <XCircle size={18} /> Suspend Account
                                        </button>
                                    )}
                                    {user.isFlagged && (
                                        <button onClick={() => onUnflag(user._id)} className="btn bg-gray-100 text-gray-700 px-6 py-3 rounded-2xl font-black hover:bg-gray-200 transition-all flex items-center gap-2">
                                            <Flag size={18} /> Unflag User
                                        </button>
                                    )}
                                </div>
                                <button onClick={() => onDelete(user._id)} className="btn text-gray-400 hover:text-red-600 px-4 py-3 rounded-2xl font-bold transition-all flex items-center gap-2">
                                    <Trash2 size={18} /> Delete User
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;
