import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { ListingCard, CreateListingModal, EditListingModal } from '../../features/product/components';
import BuyingPostCard from '../../components/trader/BuyingPostCard';
import CreatePostModal from '../../components/trader/CreatePostModal';
import EditPostModal from '../../components/trader/EditPostModal';
import EditProfileModal from '../../components/user/EditProfileModal';
import { 
    User, MapPin, Phone, BadgeCheck, PlusCircle, Camera, Loader2, 
    Edit, Trash2, ArrowDownRight, ArrowUpRight, Package, ShoppingCart,
    CheckCircle, Clock, XCircle, Settings
} from 'lucide-react';
import { Routes, Route, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import OptimizedImage from '../../components/common/OptimizedImage';

const Profile = () => {
    const { user, updateUser } = useContext(AuthContext);
    const { t, language, formatDigit } = useLanguage();
    const [myListings, setMyListings] = useState([]);
    const [myPosts, setMyPosts] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [incomingOrders, setIncomingOrders] = useState([]);
    
    // UI State
    const [isListingModalOpen, setIsListingModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            fetchMyContent();
        }
    }, [user]);

    const fetchMyContent = async () => {
        try {
            const [listingsRes, postsRes, ordersRes, incomingRes] = await Promise.all([
                api.get('/listings/my-listings'),
                api.get('/posts/my-posts'),
                api.get('/orders/my-orders'),
                api.get('/orders/incoming')
            ]);
            setMyListings(listingsRes.data);
            setMyPosts(postsRes.data);
            setMyOrders(ordersRes.data.orders || []);
            setIncomingOrders(incomingRes.data.orders || []);
        } catch (err) {
            console.error('Failed to fetch content', err);
        }
    };

    const handleImageUpload = async (file) => {
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        try {
            setIsUploading(true);
            const res = await api.post('/users/profile-picture', formData);
            updateUser({ ...user, profilePicture: res.data.profilePicture });
            toast.success(t.imageUploadSuccess);
        } catch (err) {
            toast.error(t.imageUploadFail);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteListing = async (id) => {
        if (!window.confirm(t.deleteConfirm)) return;
        try {
            await api.delete(`/listings/${id}`);
            toast.success(t.deleteSuccess);
            fetchMyContent();
        } catch (err) { toast.error(t.deleteFail); }
    };

    const handleDeletePost = async (id) => {
        if (!window.confirm(t.deleteConfirm)) return;
        try {
            await api.delete(`/posts/${id}`);
            toast.success(t.deleteSuccess);
            fetchMyContent();
        } catch (err) { toast.error(t.deleteFail); }
    };

    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status });
            toast.success(t.updateSuccess);
            fetchMyContent();
        } catch (err) { toast.error(t.updateFail); }
    }

    // Sub-Views
    const DashboardOverview = () => (
        <div className="space-y-12">
            <header className="space-y-4 text-center md:text-left flex flex-col items-center md:items-start">
                <h1 className="text-4xl font-black text-gray-900 leading-tight">{t.welcome}, <span className="text-primary">{user.name}</span>!</h1>
                <p className="text-lg text-gray-500 font-medium max-w-2xl text-center md:text-left">{t.dashboardDesc}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: t.myListings, val: myListings.length, icon: <Package />, col: 'bg-blue-600 shadow-blue-500/20' },
                    { label: t.buyingRequirements, val: myPosts.length, icon: <PlusCircle />, col: 'bg-green-600 shadow-green-500/20' },
                    { label: t.sentOrders, val: myOrders.length, icon: <ArrowUpRight />, col: 'bg-purple-600 shadow-purple-500/20' },
                    { label: t.receivedOrders, val: incomingOrders.length, icon: <ArrowDownRight />, col: 'bg-orange-600 shadow-orange-500/20' },
                ].map((stat, i) => (
                    <div key={i} className={`rounded-[2rem] p-8 text-white ${stat.col} shadow-2xl relative overflow-hidden group transition-all hover:scale-[1.02]`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 transform group-hover:scale-[2] transition-transform duration-500">
                            {stat.icon}
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest opacity-80">{stat.label}</p>
                        <p className="text-5xl font-black mt-4">{formatDigit(stat.val)}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const OrdersView = ({ title, orders, showActions = false }) => (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-100 text-center md:text-left flex flex-col items-center md:items-start">
                <h1 className="text-3xl font-black text-gray-900">{title}</h1>
                <p className="text-gray-500 font-medium text-center md:text-left">{t.manageOrdersDesc}</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
                {orders.map(order => (
                    <div key={order._id} className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:shadow-xl transition-all">
                        <div className="flex gap-6 items-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-primary">
                                <Package size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900">{order.listing?.productName || 'Product'}</h3>
                                <p className="text-gray-400 font-bold text-sm">{t.orderId}: {order._id.substring(0, 8).toUpperCase()}</p>
                                <div className="mt-2 flex items-center gap-3">
                                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                        order.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                                        order.status === 'completed' ? 'bg-green-50 text-green-600' :
                                        'bg-blue-50 text-blue-600'
                                    }`}>
                                        {order.status === 'pending' ? t.pendingApprovals : order.status === 'completed' ? t.completed : t.cancelled}
                                    </span>
                                    <span className="text-sm font-bold text-primary">{language === 'bn' ? 'টাকা' : '₹'}{formatDigit(order.totalAmount)}</span>
                                </div>
                            </div>
                        </div>
                        
                        {showActions && order.status === 'pending' && (
                            <div className="flex gap-2">
                                <button onClick={() => handleUpdateOrderStatus(order._id, 'completed')} className="p-4 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all flex items-center gap-2 font-bold text-sm">
                                    <CheckCircle size={18} /> {t.completed}
                                </button>
                                <button onClick={() => handleUpdateOrderStatus(order._id, 'cancelled')} className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all">
                                    <XCircle size={18} />
                                </button>
                            </div>
                        )}
                        {!showActions && (
                            <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                                <Clock size={16} /> {new Date(order.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : language === 'hi' ? 'hi-IN' : 'en-IN')}
                            </div>
                        )}
                    </div>
                ))}
                {orders.length === 0 && (
                    <div className="py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
                        <p className="text-gray-400 font-bold">{t.noOrdersFound}</p>
                    </div>
                )}
            </div>
        </div>
    );

    const VerificationRequired = ({ title, desc }) => (
        <div className="py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 text-center flex flex-col items-center space-y-6">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                <BadgeCheck size={48} />
            </div>
            <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-black text-gray-900 mb-2">{title || "Verification Required"}</h2>
                <p className="text-gray-500 font-bold mb-8">{desc || "You need to complete your profile verification to access this feature."}</p>
                <Link to="/verification" className="btn btn-primary px-10 py-4 rounded-2xl font-black shadow-lg shadow-primary/25">Verify Now</Link>
            </div>
        </div>
    );

    if (!user) return <div className="text-center py-20 font-bold text-gray-500 animate-pulse">{t.pleaseLogin}</div>;

    const isUnverified = user.role !== 'admin' && user.accountStatus !== 'active';

    return (
        <div className="w-full">
            <Routes>
                <Route path="/" element={<DashboardOverview />} />
                <Route path="/listings" element={
                    isUnverified ? (
                        <VerificationRequired title="Verification Needed to Sell" desc="To list your products and sell on our platform, you must first complete the identity verification." />
                    ) : (
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-100 text-center md:text-left">
                                <div className="flex flex-col items-center md:items-start">
                                    <h1 className="text-3xl font-black text-gray-900">{t.myListings}</h1>
                                    <p className="text-gray-500 font-medium text-center md:text-left">{t.viewManageListings}</p>
                                </div>
                                {(user.role === 'farmer' || user.role === 'seller' || user.role === 'hatchery') && (
                                    <button 
                                        onClick={() => setIsListingModalOpen(true)}
                                        className="bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-2xl flex items-center gap-2 font-black transition-all shadow-xl shadow-primary/25 active:scale-95"
                                    >
                                        <PlusCircle size={20} />
                                        {t.newListing}
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {myListings.map(item => (
                                    <div key={item._id}>
                                        <ListingCard 
                                            item={item} 
                                            isOwner={true} 
                                            userRole={user.role} 
                                            onEdit={(l) => { setSelectedListing(l); setIsEditModalOpen(true); }} 
                                            onDelete={handleDeleteListing} 
                                        />
                                    </div>
                                ))}
                                {myListings.length === 0 && (
                                    <div className="col-span-full py-32 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 text-center space-y-4">
                                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-300">
                                            <Package size={40} />
                                        </div>
                                        <p className="text-gray-500 font-bold text-xl">{t.noSalesPost}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                } />
                <Route path="/posts" element={
                    isUnverified ? (
                        <VerificationRequired title="Verification Needed to Post Requirements" desc="To post buying requirements and connect with sellers, you must first complete the identity verification." />
                    ) : (
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-100 text-center md:text-left">
                                <div className="flex flex-col items-center md:items-start">
                                    <h1 className="text-3xl font-black text-gray-900">{t.buyingRequirements}</h1>
                                    <p className="text-gray-500 font-medium text-center md:text-left">{t.manageRequirements}</p>
                                </div>
                                {(user.role === 'trader' || user.role === 'admin') && (
                                    <button 
                                        onClick={() => setIsPostModalOpen(true)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl flex items-center gap-2 font-black transition-all shadow-xl shadow-green-600/25 active:scale-95"
                                    >
                                        <PlusCircle size={20} />
                                        {t.newRequirement}
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {myPosts.map(post => (
                                    <div key={post._id}>
                                        <BuyingPostCard 
                                            post={post} 
                                            isOwner={true} 
                                            onEdit={(p) => { setSelectedPost(p); setIsEditPostModalOpen(true); }} 
                                            onDelete={handleDeletePost} 
                                        />
                                    </div>
                                ))}
                                {myPosts.length === 0 && (
                                    <div className="col-span-full py-32 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 text-center space-y-4">
                                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-300">
                                            <ShoppingCart size={40} />
                                        </div>
                                        <p className="text-gray-500 font-bold text-xl">{t.noPurchasePost}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                } />
                <Route path="/orders-received" element={
                    isUnverified ? (
                        <VerificationRequired title="Verification Needed to Manage Orders" desc="To accept or fulfill orders received from buyers, you must be a verified seller." />
                    ) : (
                        <OrdersView title={t.receivedOrders} orders={incomingOrders} showActions={true} />
                    )
                } />
                <Route path="/my-orders" element={<OrdersView title={t.sentOrders} orders={myOrders} />} />
                <Route path="/settings" element={
                    <div className="max-w-4xl mx-auto space-y-8">
                        <section className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 text-center md:text-left">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                                <h2 className="text-3xl font-black text-gray-900">{t.profileSettings}</h2>
                                <button 
                                    onClick={() => setIsEditProfileModalOpen(true)}
                                    className="p-4 bg-gray-50 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all flex items-center gap-2 font-black shadow-sm"
                                >
                                    <Settings size={20} />
                                    {t.editProfile}
                                </button>
                            </div>
                            
                            <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
                                <div className="relative group">
                                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-8 border-white shadow-2xl overflow-hidden bg-gray-100 flex items-center justify-center ring-1 ring-gray-100">
                                        {user.profilePicture ? (
                                            <OptimizedImage src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={80} className="text-gray-300" />
                                        )}
                                        {isUploading && (
                                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                                                <Loader2 className="text-white animate-spin" size={40} />
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute bottom-2 right-2 p-5 bg-primary text-white rounded-full shadow-2xl cursor-pointer hover:bg-blue-700 transition-all border-4 border-white group-hover:scale-110 active:scale-90">
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} disabled={isUploading} />
                                        <Camera size={24} />
                                    </label>
                                </div>
                                
                                <div className="text-center md:text-left space-y-4">
                                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">{user.name}</h2>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                        <span className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest ring-1 ring-inset ${
                                            user.role === 'farmer' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                                            user.role === 'seller' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                            user.role === 'hatchery' ? 'bg-cyan-50 text-cyan-700 ring-cyan-600/20' :
                                            'bg-purple-50 text-purple-700 ring-purple-600/20'
                                        }`}>
                                            {user.role === 'farmer' ? t.farmer : user.role === 'seller' ? t.seller : user.role === 'hatchery' ? t.hatchery : t.trader}
                                        </span>
                                        {user.verifiedStatus && (
                                            <span className="px-5 py-2 rounded-full bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                                <BadgeCheck size={16} />
                                                {t.verifiedAccount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                                {[
                                    { icon: <Phone size={24} />, label: t.mobileNumberLabel, val: formatDigit(user.phone) },
                                    { icon: <MapPin size={24} />, label: t.locationLabel, val: t.districts?.[user.district] || user.district },
                                ].map((item, i) => (
                                    <div key={i} className="p-6 md:p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 flex items-center gap-6 hover:bg-white hover:shadow-xl transition-all duration-300">
                                        <div className="p-4 bg-white rounded-2xl text-primary shadow-sm ring-1 ring-gray-100">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{item.label}</p>
                                            <p className="text-xl font-bold text-gray-900">{item.val}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                } />
            </Routes>

            {/* Modals */}
            <CreateListingModal 
                isOpen={isListingModalOpen} 
                onClose={() => setIsListingModalOpen(false)} 
                onSuccess={fetchMyContent} 
            />
            <EditListingModal 
                isOpen={isEditModalOpen} 
                listing={selectedListing} 
                onClose={() => setIsEditModalOpen(false)} 
                onSuccess={fetchMyContent} 
            />
            <CreatePostModal 
                isOpen={isPostModalOpen} 
                onClose={() => setIsPostModalOpen(false)} 
                onSuccess={fetchMyContent} 
            />
            <EditPostModal 
                isOpen={isEditPostModalOpen} 
                post={selectedPost} 
                onClose={() => setIsEditPostModalOpen(false)} 
                onSuccess={fetchMyContent} 
            />
            <EditProfileModal 
                isOpen={isEditProfileModalOpen} 
                onClose={() => setIsEditProfileModalOpen(false)} 
                onSuccess={fetchMyContent} 
            />
        </div>
    );
};

export default Profile;
