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
    Edit, Trash2, Package, ShoppingCart,
    CheckCircle, Clock, XCircle, Settings, Heart, LogOut, Wrench, ShieldCheck
} from 'lucide-react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import OptimizedImage from '../../components/common/OptimizedImage';

const Profile = () => {
    const { user, updateUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { t, language, formatDigit } = useLanguage();
    const [myListings, setMyListings] = useState([]);
    const [myEquipment, setMyEquipment] = useState([]);
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
        if (location.pathname === '/profile/posts' && location.state?.openCreate) {
            setIsPostModalOpen(true);
            navigate('/profile/posts', { replace: true, state: {} });
        }
    }, [location, navigate]);

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
            const allListings = listingsRes.data || [];
            setMyListings(allListings.filter(l => l.category !== 'Equipment'));
            setMyEquipment(allListings.filter(l => l.category === 'Equipment'));
            setMyPosts(postsRes.data || []);
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
    };

    // Sub-Views
    const DashboardOverview = () => (
        <div className="space-y-8">
            <header className="space-y-2 text-center md:text-left">
                <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
                    {t.welcome}, <span className="text-primary">{user.name}</span>!
                </h1>
                <p className="text-base text-text-secondary font-medium max-w-2xl">{t.dashboardDesc}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                    { label: t.myListings, val: myListings.length, icon: <Package size={24} />, path: '/profile/listings', color: 'bg-primary' },
                    { label: t.buyingRequirements, val: myPosts.length, icon: <PlusCircle size={24} />, path: '/profile/posts', color: 'bg-secondary' },
                ].map((stat, i) => (
                    <Link key={i} to={stat.path} className={`card p-6 text-white ${stat.color} relative overflow-hidden group transition-all hover:shadow-md`}>
                        <div className="absolute top-4 right-4 opacity-15 scale-125 transform group-hover:scale-150 transition-transform duration-300">
                            {stat.icon}
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{stat.label}</p>
                        <p className="text-4xl font-extrabold mt-3">{formatDigit(stat.val)}</p>
                    </Link>
                ))}
            </div>

            {/* Logout button — mobile only */}
            <div className="lg:hidden">
                <button
                    onClick={async () => { await logout(); navigate('/login'); }}
                    className="btn btn-danger-ghost w-full py-3 gap-2"
                >
                    <LogOut size={18} />
                    {t.logout || 'Logout'}
                </button>
            </div>
        </div>
    );

    const OrdersView = ({ title, orders, showActions = false }) => (
        <div className="space-y-6">
            <div className="card p-6 border border-border">
                <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
                <p className="text-text-secondary text-sm font-medium mt-1">{t.manageOrdersDesc}</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {orders.map(order => (
                    <div key={order._id} className="card p-5 border border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 bg-surface-1 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                                <Package size={24} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-text-primary">{order.listing?.productName || 'Product'}</h3>
                                <p className="text-text-tertiary text-xs font-medium">{t.orderId}: {order._id.substring(0, 8).toUpperCase()}</p>
                                <div className="mt-1.5 flex items-center gap-2">
                                    <span className={`badge ${
                                        order.status === 'pending' ? 'badge-warning' :
                                        order.status === 'completed' ? 'badge-success' :
                                        'badge-error'
                                    }`}>
                                        {order.status === 'pending' ? t.pendingApprovals : order.status === 'completed' ? t.completed : t.cancelled}
                                    </span>
                                    <span className="text-sm font-bold text-primary">{language === 'bn' ? 'টাকা' : '₹'}{formatDigit(order.totalAmount)}</span>
                                </div>
                            </div>
                        </div>
                        
                        {showActions && order.status === 'pending' && (
                            <div className="flex gap-2 w-full md:w-auto">
                                <button onClick={() => handleUpdateOrderStatus(order._id, 'completed')} className="btn btn-secondary btn-sm gap-1">
                                    <CheckCircle size={14} /> {t.completed}
                                </button>
                                <button onClick={() => handleUpdateOrderStatus(order._id, 'cancelled')} className="btn btn-danger-ghost btn-sm">
                                    <XCircle size={14} />
                                </button>
                            </div>
                        )}
                        {!showActions && (
                            <div className="flex items-center gap-1.5 text-text-tertiary text-xs font-medium">
                                <Clock size={14} /> {new Date(order.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : language === 'hi' ? 'hi-IN' : 'en-IN')}
                            </div>
                        )}
                    </div>
                ))}
                {orders.length === 0 && (
                    <div className="empty-state py-16">
                        <div className="empty-state-icon">
                            <Package size={28} />
                        </div>
                        <p className="text-text-secondary font-semibold">{t.noOrdersFound}</p>
                    </div>
                )}
            </div>
        </div>
    );

    const SavedView = () => (
        <div className="space-y-6">
            <div className="card p-6 border border-border">
                <h1 className="text-2xl font-bold text-text-primary">{t.savedTitle || "Saved Listings"}</h1>
                <p className="text-text-secondary text-sm font-medium mt-1">{t.savedDesc || "Listings you have saved for quick access"}</p>
            </div>
            <div className="empty-state py-16">
                <div className="empty-state-icon">
                    <Heart size={28} />
                </div>
                <p className="text-text-secondary font-bold text-lg">{t.noSavedListings || "No saved listings yet"}</p>
                <p className="text-text-tertiary text-sm mt-1 max-w-sm">{t.saveListingsHint || "Tap the heart icon on any marketplace listing to save it here."}</p>
            </div>
        </div>
    );

    if (!user) return <div className="text-center py-20 font-bold text-text-tertiary animate-pulse">{t.pleaseLogin}</div>;

    return (
        <div className="w-full">
            <Routes>
                <Route path="/" element={<DashboardOverview />} />
                <Route path="/listings" element={
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-text-primary">{t.myListings}</h1>
                            <button 
                                onClick={() => setIsListingModalOpen(true)}
                                className="btn btn-primary btn-sm gap-1.5"
                            >
                                <PlusCircle size={16} /> {t.newListing || "Add New"}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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
                                <div className="col-span-full empty-state py-20">
                                    <div className="empty-state-icon">
                                        <Package size={28} />
                                    </div>
                                    <p className="text-text-secondary font-bold text-base">{t.noSalesPost}</p>
                                </div>
                            )}
                        </div>
                    </div>
                } />
                <Route path="/equipment" element={
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-text-primary">{t.equipment || 'Farm Equipment'}</h1>
                            <button 
                                onClick={() => { setSelectedListing(null); setIsListingModalOpen(true); }}
                                className="btn btn-primary btn-sm gap-1.5"
                            >
                                <PlusCircle size={16} /> Add Equipment
                            </button>
                        </div>
                        <div className="space-y-4">
                            {myEquipment.length === 0 ? (
                                <div className="empty-state py-20">
                                    <div className="empty-state-icon">
                                        <Wrench size={28} />
                                    </div>
                                    <p className="text-text-secondary font-bold text-base">No equipment listed yet</p>
                                    <p className="text-text-tertiary text-sm mt-1">{t.startListing || 'Start listing farm equipment now'}</p>
                                </div>
                            ) : (
                                myEquipment.map(item => (
                                    <div key={item._id} className="card p-6 space-y-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-text-primary">{item.productName}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`badge ${
                                                        item.status === 'pending' ? 'badge-warning' :
                                                        item.status === 'approved' ? 'badge-success' : 'badge-error'
                                                    }`}>
                                                        {item.status === 'pending' ? t.pending : item.status === 'approved' ? t.approved : t.rejected}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => { setSelectedListing(item); setIsEditModalOpen(true); }}
                                                    className="btn btn-ghost btn-sm border border-border gap-1"
                                                >
                                                    <Edit size={14} /> {t.edit}
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteListing(item._id)}
                                                    className="btn btn-danger-ghost btn-sm gap-1"
                                                >
                                                    <Trash2 size={14} /> {t.delete}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface-1 p-4 rounded-lg text-sm">
                                            <div>
                                                <p className="text-2xs font-semibold text-text-tertiary uppercase">{t.priceCurrency}</p>
                                                <p className="font-bold text-primary">{language === 'bn' ? 'টাকা' : '₹'}{formatDigit(item.price)}</p>
                                            </div>
                                            <div>
                                                <p className="text-2xs font-semibold text-text-tertiary uppercase">{t.localDistrict || 'District'}</p>
                                                <p className="font-semibold text-text-primary">{t.districts?.[item.localDistrict] || item.localDistrict}</p>
                                            </div>
                                            <div>
                                                <p className="text-2xs font-semibold text-text-tertiary uppercase">{t.policeStation}</p>
                                                <p className="font-semibold text-text-primary">{t.policeStations?.[item.policeStation] || item.policeStation}</p>
                                            </div>
                                            <div>
                                                <p className="text-2xs font-semibold text-text-tertiary uppercase">{t.mobileNumberLabel}</p>
                                                <p className="font-semibold text-text-primary">{formatDigit(item.phoneNumber)}</p>
                                            </div>
                                        </div>

                                        {item.description && (
                                            <p className="text-sm text-text-secondary leading-relaxed pt-2 border-t border-border">{item.description}</p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                } />
                <Route path="/posts" element={
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 card p-6">
                            <div>
                                <h1 className="text-2xl font-bold text-text-primary">{t.buyingRequirements}</h1>
                                <p className="text-text-secondary text-sm font-medium mt-1">{t.manageRequirements}</p>
                            </div>
                            <button 
                                onClick={() => setIsPostModalOpen(true)}
                                className="btn btn-secondary btn-sm gap-1.5"
                            >
                                <PlusCircle size={16} />
                                {t.newRequirement}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                <div className="col-span-full empty-state py-20">
                                    <div className="empty-state-icon">
                                        <ShoppingCart size={28} />
                                    </div>
                                    <p className="text-text-secondary font-bold text-base">{t.noPurchasePost}</p>
                                </div>
                            )}
                        </div>
                    </div>
                } />
                <Route path="/orders-received" element={<OrdersView title={t.receivedOrders} orders={incomingOrders} showActions={true} />} />
                <Route path="/my-orders" element={<OrdersView title={t.sentOrders} orders={myOrders} />} />
                <Route path="/saved" element={<SavedView />} />
                <Route path="/settings" element={
                    <div className="max-w-4xl mx-auto space-y-6">
                        <section className="card p-6 md:p-8 space-y-8">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-text-primary">{t.profileSettings}</h2>
                                <button 
                                    onClick={() => setIsEditProfileModalOpen(true)}
                                    className="btn btn-ghost border border-border btn-sm gap-1.5"
                                >
                                    <Settings size={16} />
                                    {t.editProfile}
                                </button>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="relative">
                                    <div className="w-28 h-28 rounded-full border-4 border-surface-1 shadow-sm overflow-hidden bg-surface-2 flex items-center justify-center">
                                        {user.profilePicture ? (
                                            <OptimizedImage src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={48} className="text-text-tertiary" />
                                        )}
                                        {isUploading && (
                                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                                <Loader2 className="text-white animate-spin" size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-md cursor-pointer hover:bg-primary-dark transition-all border-2 border-white">
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} disabled={isUploading} />
                                        <Camera size={16} />
                                    </label>
                                </div>
                                
                                <div className="text-center sm:text-left space-y-2">
                                    <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">{user.name}</h2>
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                        <span className="badge badge-primary uppercase">
                                            {user.role === 'farmer' ? t.farmer : user.role === 'seller' ? t.seller : user.role === 'hatchery' ? t.hatchery : t.trader}
                                        </span>
                                        {user.accountStatus === 'active' ? (
                                            <span className="badge badge-success uppercase flex items-center gap-1">
                                                <BadgeCheck size={14} />
                                                Approved Account
                                            </span>
                                        ) : (
                                            <Link to="/verification" className="badge badge-warning uppercase flex items-center gap-1 hover:opacity-80">
                                                <Clock size={14} />
                                                Pending Admin Approval
                                            </Link>
                                        )}
                                        {user.verifiedStatus && (
                                            <span className="badge badge-success uppercase flex items-center gap-1">
                                                <ShieldCheck size={14} />
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                                {[
                                    { icon: <Phone size={20} />, label: t.mobileNumberLabel, val: formatDigit(user.phone) },
                                    { icon: <MapPin size={20} />, label: t.locationLabel, val: `${t.policeStations?.[user.policeStation] || user.policeStation ? (t.policeStations?.[user.policeStation] || user.policeStation) + ', ' : ''}${t.districts?.[user.localDistrict] || user.localDistrict ? (t.districts?.[user.localDistrict] || user.localDistrict) + ', ' : ''}${t.districts?.[user.district] || user.district}` },
                                ].map((item, i) => (
                                    <div key={i} className="p-4 bg-surface-1 rounded-lg border border-border flex items-center gap-4">
                                        <div className="p-2.5 bg-white rounded-md text-primary shadow-xs">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-2xs font-semibold uppercase text-text-tertiary">{item.label}</p>
                                            <p className="text-base font-bold text-text-primary">{item.val}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Logout button — mobile only */}
                        <div className="lg:hidden">
                            <button
                                onClick={async () => { await logout(); navigate('/login'); }}
                                className="btn btn-danger-ghost w-full py-3 gap-2"
                            >
                                <LogOut size={18} />
                                {t.logout || 'Logout'}
                            </button>
                        </div>
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
