import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../../utils/api';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    Upload, Image, Video, Trash2, Copy, Check, Film,
    RefreshCw, Settings2, X, CloudUpload, Eye
} from 'lucide-react';

const TABS = ['Upload', 'Library', 'Hero Settings'];

const MediaManager = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isBackendUpload, setIsBackendUpload] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [filter, setFilter] = useState('all');
    const [copied, setCopied] = useState(null);
    const [preview, setPreview] = useState(null);
    const [heroSettings, setHeroSettings] = useState({ video1Url: '', video1Id: '', video2Url: '', video2Id: '', heroImageUrl: '', heroImageId: '' });
    const [heroSaving, setHeroSaving] = useState(false);
    const fileInputRef = useRef();

    const fetchMedia = useCallback(async () => {
        setLoading(true);
        try {
            const q = filter !== 'all' ? `?type=${filter}` : '';
            const { data } = await api.get(`/admin/media${q}`);
            setMedia(data.media || []);
        } catch { toast.error('Failed to load media'); }
        finally { setLoading(false); }
    }, [filter]);

    const fetchHeroSettings = async () => {
        try {
            const { data } = await api.get('/hero-settings');
            if (data) setHeroSettings(s => ({ ...s, ...data }));
        } catch {}
    };

    useEffect(() => { fetchMedia(); }, [fetchMedia]);
    useEffect(() => { if (activeTab === 2) fetchHeroSettings(); }, [activeTab]);

    const handleUpload = async (files) => {
        if (!files || !files.length) return;
        setUploading(true);
        setIsBackendUpload(false);
        setProgress(0);
        let successCount = 0;
        
        for (const file of Array.from(files)) {
            try {
                // 1. Get secure signature from backend
                const { data: sigData } = await api.post('/admin/media/generate-signature');
                const { signature, timestamp, folder, apiKey, cloudName } = sigData;
                
                // 2. Prepare Form Data for direct Cloudinary upload
                const isVideo = file.type.startsWith('video/');
                const resourceType = isVideo ? 'video' : 'image';
                
                const fd = new FormData();
                fd.append('file', file);
                fd.append('api_key', apiKey);
                fd.append('timestamp', timestamp);
                fd.append('signature', signature);
                fd.append('folder', folder);
                
                // 3. Upload directly to Cloudinary with REAL progress tracking
                const cloudUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
                const uploadRes = await axios.post(cloudUrl, fd, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percent);
                    }
                });
                
                // 4. Register the successfully uploaded media metadata on our backend
                await api.post('/admin/media/register', {
                    url: uploadRes.data.secure_url,
                    publicId: uploadRes.data.public_id,
                    resourceType: resourceType,
                    format: uploadRes.data.format || '',
                    bytes: uploadRes.data.bytes || 0,
                    width: uploadRes.data.width || 0,
                    height: uploadRes.data.height || 0,
                    duration: uploadRes.data.duration || 0,
                    caption: file.name
                });
                
                successCount++;
            } catch (e) {
                console.log("Direct upload bypassed/failed, seamlessly switching to chunked backend fallback...");
                setIsBackendUpload(true);
                // Graceful fallback to backend proxy if direct fails for any reason
                try {
                    const fd = new FormData();
                    fd.append('file', file);
                    fd.append('caption', file.name);
                    await api.post('/admin/media/upload', fd, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                        onUploadProgress: (progressEvent) => {
                            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setProgress(percent);
                        }
                    });
                    successCount++;
                } catch (fallbackError) {
                    toast.error(`Failed: ${file.name} — ${fallbackError.response?.data?.msg || fallbackError.message}`);
                }
            }
        }
        setProgress(100);
        if (successCount) toast.success(`${successCount} file(s) uploaded!`);
        setTimeout(() => { setProgress(0); setUploading(false); fetchMedia(); setActiveTab(1); }, 700);
    };

    const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); };

    const handleDelete = async (item) => {
        if (!window.confirm('Delete this asset from Cloudinary? This cannot be undone.')) return;
        try {
            await api.delete(`/admin/media/${item._id}`);
            toast.success('Deleted');
            setMedia(m => m.filter(x => x._id !== item._id));
        } catch { toast.error('Delete failed'); }
    };

    const copyUrl = (url, id) => {
        navigator.clipboard.writeText(url);
        setCopied(id);
        toast.success('URL copied!');
        setTimeout(() => setCopied(null), 2000);
    };

    const setHeroField = async (field, item) => {
        const updated = { ...heroSettings };
        if (field === 'video1') {
            updated.video1Url = item.url;
            updated.video1Id = item.publicId;
        } else if (field === 'video2') {
            updated.video2Url = item.url;
            updated.video2Id = item.publicId;
        } else {
            updated.heroImageUrl = item.url;
            updated.heroImageId = item.publicId;
        }
        setHeroSettings(updated);
        try {
            await api.put('/admin/media/hero-settings', updated);
            toast.success(`Successfully set and saved as ${field === 'heroImage' ? 'Hero Image' : field === 'video1' ? 'Hero Video 1' : 'Hero Video 2'}!`);
        } catch {
            toast.error('Failed to save selection');
        }
    };

    const clearHeroField = async (field) => {
        const updated = { ...heroSettings };
        if (field === 'video1') {
            updated.video1Url = '';
            updated.video1Id = '';
        } else if (field === 'video2') {
            updated.video2Url = '';
            updated.video2Id = '';
        } else {
            updated.heroImageUrl = '';
            updated.heroImageId = '';
        }
        setHeroSettings(updated);
        try {
            await api.put('/admin/media/hero-settings', updated);
            toast.success(`Cleared and saved ${field === 'heroImage' ? 'Hero Image' : field === 'video1' ? 'Hero Video 1' : 'Hero Video 2'}!`);
        } catch {
            toast.error('Failed to clear slot');
        }
    };

    const saveHeroSettings = async () => {
        setHeroSaving(true);
        try {
            await api.put('/admin/media/hero-settings', heroSettings);
            toast.success('Hero settings saved!');
        } catch { toast.error('Save failed'); }
        finally { setHeroSaving(false); }
    };

    const filteredMedia = filter === 'all' ? media : media.filter(m => m.resourceType === filter);

    const formatBytes = (b) => b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${(b / 1e3).toFixed(0)} KB`;

    return (
        <div className="space-y-8">
            <header className="space-y-2">
                <h1 className="text-4xl font-black text-gray-900 leading-tight">
                    Media <span className="text-primary">Library</span>
                </h1>
                <p className="text-gray-500 font-medium">Upload and manage images & videos via Cloudinary.</p>
            </header>

            {/* Tabs */}
            <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl w-fit">
                {TABS.map((tab, i) => (
                    <button key={tab} onClick={() => setActiveTab(i)}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === i ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* ── Upload Tab ── */}
            {activeTab === 0 && (
                <div className="space-y-6">
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        className={`relative border-3 border-dashed rounded-[2.5rem] p-16 text-center cursor-pointer transition-all duration-300 ${dragOver ? 'border-primary bg-blue-50 scale-[1.01]' : 'border-gray-200 bg-gray-50 hover:border-primary hover:bg-blue-50/40'}`}>
                        <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={e => handleUpload(e.target.files)} />
                        <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center transition-colors ${dragOver ? 'bg-primary text-white' : 'bg-white text-primary shadow-lg'}`}>
                            <CloudUpload size={36} />
                        </div>
                        <h3 className="text-xl font-black text-gray-800 mb-2">
                            {dragOver ? 'Drop files here' : 'Drag & drop or click to upload'}
                        </h3>
                        <p className="text-gray-400 font-medium">Images (JPG, PNG, WebP) · Videos (MP4, MOV, WebM) · Max 200MB</p>

                        {uploading && (
                            <div className="mt-8 space-y-3">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                                </div>
                                <p className="text-primary font-bold text-sm animate-pulse">
                                    {isBackendUpload
                                        ? (progress === 100 
                                            ? "File received by server. Finalizing secure chunked upload to Cloudinary (processing large video files may take 1-2 minutes, please do not close this page)..." 
                                            : `Transferring to backend server… ${progress}%`)
                                        : `Uploading to Cloudinary… ${progress}%`}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Library Tab ── */}
            {activeTab === 1 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex gap-2">
                            {['all', 'image', 'video'].map(f => (
                                <button key={f} onClick={() => setFilter(f)}
                                    className={`px-5 py-2 rounded-xl font-bold text-sm capitalize transition-all ${filter === f ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                                    {f === 'all' ? '🗂 All' : f === 'image' ? '🖼 Images' : '🎬 Videos'}
                                </button>
                            ))}
                        </div>
                        <button onClick={fetchMedia} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 font-bold text-sm transition-all">
                            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
                        </button>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : filteredMedia.length === 0 ? (
                        <div className="py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                            <p className="text-gray-300 font-black text-2xl mb-2">No media yet</p>
                            <button onClick={() => setActiveTab(0)} className="text-primary font-bold underline underline-offset-4 text-sm">Upload your first file</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {filteredMedia.map(item => (
                                <div key={item._id} className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    {/* Thumbnail */}
                                    <div className="aspect-square bg-gray-50 overflow-hidden relative">
                                        {item.resourceType === 'video' ? (
                                            <>
                                                <video src={item.url} className="w-full h-full object-cover" muted />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-10 h-10 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
                                                        <Film size={18} className="text-white" />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
                                        )}

                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button onClick={() => setPreview(item)} title="Preview"
                                                className="p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/40 transition-colors">
                                                <Eye size={16} />
                                            </button>
                                            <button onClick={() => copyUrl(item.url, item._id)} title="Copy URL"
                                                className="p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/40 transition-colors">
                                                {copied === item._id ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                            </button>
                                            <button onClick={() => handleDelete(item)} title="Delete"
                                                className="p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Meta */}
                                    <div className="p-3">
                                        <p className="text-xs font-bold text-gray-700 truncate">{item.caption || 'Untitled'}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${item.resourceType === 'video' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {item.format || item.resourceType}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-bold">{formatBytes(item.bytes)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Hero Settings Tab ── */}
            {activeTab === 2 && (
                <div className="space-y-8">
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-sm text-blue-800 font-medium">
                        💡 Select a video from your library to assign it to the Hero section on the homepage. Changes take effect immediately after saving.
                    </div>

                    {/* Current preview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { key: 'video1', label: 'Hero Video 1', url: heroSettings.video1Url, type: 'video' },
                            { key: 'video2', label: 'Hero Video 2', url: heroSettings.video2Url, type: 'video' },
                            { key: 'heroImage', label: 'Hero Image', url: heroSettings.heroImageUrl, type: 'image' },
                        ].map(slot => (
                            <div key={slot.key} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm space-y-4">
                                <h4 className="font-black text-gray-700">{slot.label}</h4>
                                <div className="aspect-video bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                                    {slot.url ? (
                                        slot.type === 'video'
                                            ? <video src={slot.url} className="w-full h-full object-cover" muted autoPlay loop playsInline />
                                            : <img src={slot.url} alt={slot.label} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 flex-col gap-2">
                                            {slot.type === 'video' ? <Film size={32} /> : <Image size={32} />}
                                            <p className="text-xs font-bold">Not set</p>
                                        </div>
                                    )}
                                </div>
                                {slot.url && (
                                    <div className="flex items-center justify-between gap-2 mt-2">
                                        <p className="text-xs text-gray-400 font-bold truncate flex-1">{slot.url}</p>
                                        <button 
                                            onClick={() => clearHeroField(slot.key)}
                                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center"
                                            title="Clear slot"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Select from library */}
                    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
                        <h3 className="font-black text-gray-800 text-lg">Select from Library</h3>
                        {media.length === 0 ? (
                            <p className="text-gray-400 font-bold text-sm">No media uploaded yet. Go to the <button onClick={() => setActiveTab(0)} className="text-primary underline">Upload tab</button> first.</p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto pr-1">
                                {media.map(item => (
                                    <div key={item._id} className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 cursor-pointer hover:border-primary transition-all">
                                        <div className="aspect-video bg-gray-100 overflow-hidden relative">
                                            {item.resourceType === 'video'
                                                ? <video src={item.url} className="w-full h-full object-cover" muted />
                                                : <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${item.resourceType === 'video' ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'}`}>
                                                    {item.resourceType}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            <p className="text-xs font-bold text-gray-600 truncate mb-2">{item.caption || 'Untitled'}</p>
                                            <div className="flex gap-1 flex-wrap">
                                                {item.resourceType === 'video' && (
                                                    <>
                                                        <button onClick={() => setHeroField('video1', item)} className="text-[10px] px-2 py-1 bg-primary text-white rounded-lg font-bold hover:bg-primary/80 transition-colors">Set V1</button>
                                                        <button onClick={() => setHeroField('video2', item)} className="text-[10px] px-2 py-1 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-500 transition-colors">Set V2</button>
                                                    </>
                                                )}
                                                {item.resourceType === 'image' && (
                                                    <button onClick={() => setHeroField('heroImage', item)} className="text-[10px] px-2 py-1 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500 transition-colors">Set Hero Img</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button onClick={saveHeroSettings} disabled={heroSaving}
                        className="flex items-center gap-2 px-10 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all disabled:opacity-60">
                        <Settings2 size={18} />
                        {heroSaving ? 'Saving…' : 'Save Hero Settings'}
                    </button>
                </div>
            )}

            {/* Preview Modal */}
            {preview && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6 backdrop-blur-sm" onClick={() => setPreview(null)}>
                    <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setPreview(null)} className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg z-10 hover:bg-gray-50">
                            <X size={18} />
                        </button>
                        {preview.resourceType === 'video'
                            ? <video src={preview.url} controls autoPlay className="w-full rounded-2xl shadow-2xl" />
                            : <img src={preview.url} alt={preview.caption} className="w-full rounded-2xl shadow-2xl" />}
                        <div className="mt-4 flex items-center justify-between">
                            <div>
                                <p className="text-white font-bold">{preview.caption || 'Untitled'}</p>
                                <p className="text-gray-400 text-sm">{formatBytes(preview.bytes)} · {preview.format?.toUpperCase()}</p>
                            </div>
                            <button onClick={() => copyUrl(preview.url, preview._id)} className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl font-bold text-sm hover:bg-white/20 transition-colors">
                                <Copy size={14} /> Copy URL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MediaManager;
