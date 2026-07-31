import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import VideoRecorder from '../../components/common/VideoRecorder';
import { ShieldCheck, Upload, FileText, Camera, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getPoliceStations } from '../../utils/districtsData';

const Verification = () => {
    const { t } = useLanguage();
    const { user, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [aadhaarFile, setAadhaarFile] = useState(null);
    const [aadhaarPreview, setAadhaarPreview] = useState(null);
    const [videoBlob, setVideoBlob] = useState(null);
    
    const [profileFile, setProfileFile] = useState(null);
    const [profilePreview, setProfilePreview] = useState(user?.profilePicture || null);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        district: user?.district || '', // stores State
        localDistrict: user?.localDistrict || '', // stores District
        policeStation: user?.policeStation || ''
    });

    // Optional verification page - users can complete it anytime to earn Verified Badge

    const handleProfileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setProfilePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

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
        
        if (!profilePreview && !user?.profilePicture) {
            return toast.error("Please upload your profile picture");
        }
        if (!aadhaarFile && !user?.aadhaarCard) {
            return toast.error("Please upload your Aadhaar card");
        }
        if (!videoBlob && !user?.verificationVideo) {
            return toast.error("Please record a 10-second verification video");
        }

        const digits = formData.phone.replace(/\D/g, '');
        let normalized = digits;
        if (digits.length === 12 && digits.startsWith('91')) {
            normalized = digits.slice(2);
        } else if (digits.length === 11 && digits.startsWith('0')) {
            normalized = digits.slice(1);
        }
        if (!/^[6-9]\d{9}$/.test(normalized)) {
            return toast.error("Please enter a valid 10-digit Indian mobile number");
        }

        if (!formData.district) {
            return toast.error("Please select your State");
        }
        if (!formData.localDistrict) {
            return toast.error("Please select your District");
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('phone', normalized);
        data.append('district', formData.district);
        data.append('localDistrict', formData.localDistrict);
        data.append('policeStation', formData.policeStation);

        if (profileFile) data.append('profilePicture', profileFile);
        if (aadhaarFile) data.append('aadhaar', aadhaarFile);
        if (videoBlob) data.append('video', videoBlob, 'verification_video.webm');

        try {
            setLoading(true);
            const res = await api.put('/users/verify-profile', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            updateUser(res.data.user);
            setSubmitted(true); // immediately show pending screen
            toast.success("Verification submitted successfully! Please wait for admin approval.");
        } catch (err) {
            toast.error(err.response?.data?.msg || "Submission failed");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    if (user.verifiedStatus) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
                <div className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-2xl w-full text-center space-y-6 border border-gray-100">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600">
                        <CheckCircle2 size={56} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center justify-center gap-2">
                        Verified User <ShieldCheck className="text-primary" size={32} />
                    </h1>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        Your identity has been verified by admin! You have the official Verified User Badge on your profile and listings.
                    </p>
                    <button 
                        onClick={() => navigate('/profile')} 
                        className="btn btn-primary py-4 px-8 text-lg rounded-2xl font-bold shadow-lg shadow-primary/20"
                    >
                        Go to Profile
                    </button>
                </div>
            </div>
        );
    }

    if (submitted || (user.accountStatus === 'pending' && user.aadhaarCard && !user.verificationRejectedReason)) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
                <div className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-2xl w-full text-center space-y-6 border border-gray-100">
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-primary animate-bounce">
                        <Loader2 size={48} className="animate-spin" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900">Verification Submitted</h1>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        We have received your verification documents. Our admin team is reviewing them.
                        Once approved, your account will display the Verified User Badge! You can continue posting listings anytime.
                    </p>
                    <button 
                        onClick={() => navigate('/profile')} 
                        className="btn btn-primary py-4 px-8 text-lg rounded-2xl font-bold shadow-lg shadow-primary/20"
                    >
                        Continue to Profile
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-6 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="bg-primary p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="relative z-10 max-w-xl">
                            <h1 className="text-3xl md:text-4xl font-black flex items-center gap-3">
                                <ShieldCheck size={36} />
                                Get Verified User Badge
                            </h1>
                            <p className="mt-3 text-white/90 text-sm md:text-base font-medium">
                                Verification (Aadhaar & 10s video) is <strong>optional</strong>. Uploading documents awards you the <strong>Verified Badge (✔)</strong> on your profile and listings to build trust!
                            </p>
                        </div>
                        <button 
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="relative z-10 bg-white/20 hover:bg-white text-white hover:text-primary px-5 py-2.5 rounded-2xl font-bold transition-all text-xs md:text-sm shrink-0 border border-white/30"
                        >
                            Skip for Now
                        </button>
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

                        {/* Profile Photo */}
                        <section className="space-y-6 flex flex-col items-center">
                            <h2 className="text-2xl font-black text-gray-900 self-start flex items-center gap-3">
                                <Camera className="text-primary" />
                                1. Profile Picture
                            </h2>
                            <div className="relative group w-36 h-36">
                                <div className="w-full h-full rounded-full bg-gray-100 border-4 border-white shadow-xl overflow-hidden ring-4 ring-primary/20 flex items-center justify-center">
                                    {profilePreview ? (
                                        <img loading="lazy" src={profilePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Camera size={48} />
                                        </div>
                                    )}
                                </div>
                                <input 
                                    type="file" 
                                    onChange={handleProfileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    accept="image/*"
                                />
                                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white pointer-events-none">
                                    <Camera size={24} />
                                </div>
                            </div>
                            <div className="text-center">
                                <span className="text-sm font-bold text-gray-700">Upload Profile Photo</span>
                                <p className="text-xs text-gray-400 font-medium mt-1">Clear close-up face shot required</p>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Basic Info */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                <FileText className="text-primary" />
                                2. Basic Information
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
                                <div>
                                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Mobile Number (Indian)</label>
                                    <div className="flex bg-gray-50 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary">
                                        <span className="bg-gray-100 px-4 py-4 outline-none text-gray-700 font-bold flex items-center">🇮🇳 +91</span>
                                        <input 
                                            type="tel" required
                                            maxLength={10}
                                            placeholder="98XXXXXXXX"
                                            className="w-full px-4 py-4 bg-transparent border-none outline-none font-bold text-gray-900"
                                            value={formData.phone}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                if (val.length <= 10) setFormData({...formData, phone: val});
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">State</label>
                                    <select 
                                        required
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary outline-none font-bold text-gray-900 cursor-pointer h-[56px]"
                                        value={formData.district}
                                        onChange={(e) => setFormData({...formData, district: e.target.value, localDistrict: ''})}
                                    >
                                        <option value="">Select State</option>
                                        {Object.keys(INDIAN_STATES_DISTRICTS).map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">District</label>
                                    <select 
                                        required
                                        disabled={!formData.district}
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary outline-none font-bold text-gray-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed h-[56px]"
                                        value={formData.localDistrict}
                                        onChange={(e) => setFormData({...formData, localDistrict: e.target.value})}
                                    >
                                        <option value="">Select District</option>
                                        {formData.district && INDIAN_STATES_DISTRICTS[formData.district].map(dist => (
                                            <option key={dist} value={dist}>{dist}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">{t.policeStation || 'Police Station'}</label>
                                    <select 
                                        required
                                        disabled={!formData.localDistrict}
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary outline-none font-bold text-gray-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed h-[56px]"
                                        value={formData.policeStation}
                                        onChange={(e) => setFormData({...formData, policeStation: e.target.value})}
                                    >
                                        <option value="">{t.selectPoliceStation || t.selectBtn || 'Select Police Station'}</option>
                                        {formData.localDistrict && getPoliceStations(formData.localDistrict).map(ps => (
                                            <option key={ps} value={ps}>{t.policeStations?.[ps] || ps}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Aadhaar Upload */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                <Upload className="text-primary" />
                                3. Aadhaar Card Upload
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
                                            <img loading="lazy" src={aadhaarPreview} alt="Aadhaar Preview" className="max-h-64 mx-auto rounded-xl shadow-lg border-4 border-white" />
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
                                    4. Live Video Verification (10s)
                                </h2>
                                <span className="px-4 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full">Optional (For Verified Badge)</span>
                            </div>
                            <p className="text-gray-500 font-medium">Record a short 10-second video of yourself looking directly into the camera to verify you are a live person.</p>
                            
                            <VideoRecorder onRecordingComplete={(blob) => setVideoBlob(blob)} />
                        </section>

                        <div className="space-y-4">
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
                                        Submit for Verification Badge
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/profile')}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 text-base font-bold rounded-2xl transition-all text-center"
                            >
                                Skip &amp; Continue to Profile / Dashboard
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Verification;
