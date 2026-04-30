import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import VideoRecorder from '../../components/common/VideoRecorder';
import { ShieldCheck, Upload, FileText, Camera, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const Verification = () => {
    const { user, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [aadhaarFile, setAadhaarFile] = useState(null);
    const [aadhaarPreview, setAadhaarPreview] = useState(null);
    const [videoBlob, setVideoBlob] = useState(null);
    
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });

    useEffect(() => {
        if (user?.accountStatus === 'active') {
            navigate('/profile');
        }
    }, [user, navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAadhaarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setAadhaarPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!aadhaarFile && !user?.aadhaarCard) {
            return toast.error("Please upload your Aadhaar card");
        }
        if (!videoBlob && !user?.verificationVideo) {
            return toast.error("Please record a 5-second verification video");
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        if (aadhaarFile) data.append('aadhaar', aadhaarFile);
        if (videoBlob) data.append('video', videoBlob, 'verification_video.webm');

        try {
            setLoading(true);
            const res = await api.put('/users/verify-profile', data, {
                headers: { 
                    'Content-Type': 'multipart/form-data'
                }
            });
            updateUser(res.data.user);
            toast.success("Verification submitted successfully! Please wait for admin approval.");
        } catch (err) {
            toast.error(err.response?.data?.msg || "Submission failed");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    if (user.accountStatus === 'pending' && user.aadhaarCard && !user.verificationRejectedReason) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
                <div className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-2xl w-full text-center space-y-6 border border-gray-100">
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-primary animate-bounce">
                        <Loader2 size={48} className="animate-spin" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900">Verification Pending</h1>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        We have received your documents. Our team is currently reviewing your profile. 
                        You will get full access once the verification is complete.
                    </p>
                    <div className="p-4 bg-blue-50 rounded-2xl text-blue-700 text-sm font-medium">
                        This usually takes less than 24 hours.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-6 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="bg-primary p-12 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h1 className="text-4xl font-black flex items-center gap-4">
                                <ShieldCheck size={40} />
                                Complete Your Profile
                            </h1>
                            <p className="mt-4 text-white/80 text-lg font-medium">
                                To ensure a safe community, we require all users to verify their identity.
                            </p>
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <ShieldCheck size={200} />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-12 space-y-12">
                        {user.verificationRejectedReason && (
                            <div className="p-6 bg-red-50 border border-red-100 rounded-3xl flex items-start gap-4">
                                <AlertCircle className="text-red-500 shrink-0" size={24} />
                                <div>
                                    <h3 className="font-bold text-red-900">Verification Rejected</h3>
                                    <p className="text-red-700 text-sm">{user.verificationRejectedReason}</p>
                                    <p className="mt-2 text-red-600 text-xs font-medium">Please update your documents and re-submit.</p>
                                </div>
                            </div>
                        )}

                        {/* Basic Info */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                <FileText className="text-primary" />
                                1. Basic Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                                    <input 
                                        type="text" required
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary outline-none font-bold text-gray-900"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                                    <input 
                                        type="email" required
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary outline-none font-bold text-gray-900"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                                    <input 
                                        type="tel" required
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary outline-none font-bold text-gray-900"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    />
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Aadhaar Upload */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                <Upload className="text-primary" />
                                2. Aadhaar Card Upload
                            </h2>
                            <div className="relative group">
                                <input 
                                    type="file" 
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    accept="image/*"
                                />
                                <div className={`border-4 border-dashed rounded-[2.5rem] p-12 text-center transition-all ${aadhaarPreview ? 'border-primary bg-blue-50/30' : 'border-gray-200 bg-gray-50 group-hover:bg-white group-hover:border-primary'}`}>
                                    {aadhaarPreview ? (
                                        <div className="space-y-4">
                                            <img src={aadhaarPreview} alt="Aadhaar Preview" className="max-h-64 mx-auto rounded-xl shadow-lg border-4 border-white" />
                                            <p className="text-primary font-bold">Aadhaar card selected!</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto text-gray-300 shadow-sm border border-gray-100">
                                                <Upload size={32} />
                                            </div>
                                            <div>
                                                <p className="text-xl font-black text-gray-900">Click to upload document</p>
                                                <p className="text-gray-400 font-medium">Clear photo of your Aadhaar Card (Front Side)</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Video Recording */}
                        <section className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                    <Camera className="text-primary" />
                                    3. Live Video Verification (5s)
                                </h2>
                                <span className="px-4 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Required</span>
                            </div>
                            <p className="text-gray-500 font-medium">Record a short 5-second video of yourself looking directly into the camera to verify you are a live person.</p>
                            
                            <VideoRecorder onRecordingComplete={(blob) => setVideoBlob(blob)} />
                        </section>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full btn btn-primary py-6 text-xl rounded-3xl shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    Submitting Verification...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={24} />
                                    Submit for Admin Approval
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Verification;
