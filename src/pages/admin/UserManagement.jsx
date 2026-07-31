import React, { useState } from 'react';
import useAdminUsers from '../../hooks/useAdminUsers';
import UserDetailModal from './UserDetailModal';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { 
    Search, Filter, Users, ShieldCheck, Clock, X, ChevronDown, 
    ChevronUp, Eye, Trash2, CheckCircle2, ChevronLeft, ChevronRight, XCircle, AlertCircle, Flag
} from 'lucide-react';

const UserManagement = ({ forcedRole, title, description }) => {
    const {
        users, loading, total, filters, updateFilter, clearFilters,
        activeFilterCount, searchInput, setSearchInput,
        page, setPage, limit, setLimit, totalPages,
        sortBy, sortOrder, toggleSort, locationData, refetch
    } = useAdminUsers({ forcedRole });

    const [selectedUser, setSelectedUser] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    // --- Actions ---
    const handleApprove = async (userId) => {
        try {
            await api.put(`/admin/users/${userId}/approve-verification`);
            toast.success("User verified successfully");
            refetch();
            if (selectedUser && selectedUser._id === userId) {
                setSelectedUser(prev => ({ ...prev, verifiedStatus: true, accountStatus: 'active' }));
            }
        } catch (err) { toast.error("Failed to approve user"); }
    };

    const handleReject = async (userId, reason) => {
        try {
            await api.put(`/admin/users/${userId}/reject-verification`, { reason });
            toast.success("Verification rejected");
            refetch();
            if (selectedUser && selectedUser._id === userId) {
                setSelectedUser(prev => ({ ...prev, verifiedStatus: false, accountStatus: 'pending' }));
            }
        } catch (err) { toast.error("Failed to reject user"); }
    };

    const handleSuspend = async (userId) => {
        try {
            await api.put(`/admin/users/${userId}/status`, { accountStatus: 'suspended' });
            toast.success("User suspended");
            refetch();
            if (selectedUser && selectedUser._id === userId) {
                setSelectedUser(prev => ({ ...prev, accountStatus: 'suspended' }));
            }
        } catch (err) { toast.error("Failed to suspend user"); }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            toast.success("User deleted");
            if (selectedUser && selectedUser._id === userId) setSelectedUser(null);
            refetch();
        } catch (err) { toast.error("Failed to delete user"); }
    };

    const handleUnflag = async (userId) => {
        try {
            await api.put(`/admin/users/${userId}/unflag`);
            toast.success("User unflagged");
            refetch();
            if (selectedUser && selectedUser._id === userId) {
                setSelectedUser(prev => ({ ...prev, isFlagged: false, trustScore: 100, fraudReason: '' }));
            }
        } catch (err) { toast.error("Failed to unflag user"); }
    };

    // --- Render Helpers ---
    const SortIcon = ({ field }) => {
        if (sortBy !== field) return <ChevronDown size={14} className="text-gray-300 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />;
        return sortOrder === 'asc' 
            ? <ChevronUp size={14} className="text-primary inline ml-1" />
            : <ChevronDown size={14} className="text-primary inline ml-1" />;
    };

    const displayTitle = title || "User Management";
    const displayDesc = description || (forcedRole 
        ? `Dedicated management and administration for platform ${forcedRole}s.` 
        : "Advanced filtering and administration of platform users.");

    const titleParts = displayTitle.split(' ');
    const mainTitle = titleParts.slice(0, -1).join(' ') || titleParts[0];
    const highlightedTitle = titleParts.length > 1 ? titleParts[titleParts.length - 1] : '';

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 leading-tight">
                        {mainTitle}{' '}
                        {highlightedTitle && <span className="text-primary">{highlightedTitle}</span>}
                    </h1>
                    <p className="text-gray-500 font-medium">{displayDesc}</p>
                </div>
            </header>

            {/* Toolbar */}
            <div className="bg-white p-4 md:p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by name, phone, or ID..."
                        className="w-full pl-12 pr-10 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-gray-700 font-medium"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    {searchInput && (
                        <button onClick={() => setSearchInput('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <X size={16} />
                        </button>
                    )}
                </div>
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all whitespace-nowrap ${showFilters || activeFilterCount > 0 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                >
                    <Filter size={20} />
                    Filters {activeFilterCount > 0 && <span className="bg-white text-primary px-2 py-0.5 rounded-full text-xs">{activeFilterCount}</span>}
                </button>
            </div>

            <div className="flex flex-col xl:flex-row gap-8 items-start">
                {/* Filter Sidebar */}
                {showFilters && (
                    <div className="w-full xl:w-80 shrink-0 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-6 animate-in slide-in-from-left-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-black text-gray-900 flex items-center gap-2"><Filter size={18} /> Filters</h3>
                            <button onClick={clearFilters} className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">Clear All</button>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">User Type</label>
                            <select value={filters.role} onChange={(e) => updateFilter('role', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl outline-none font-medium text-gray-700 focus:ring-2 focus:ring-primary/20 cursor-pointer">
                                <option value="">All Types</option>
                                <option value="farmer">Farmer</option>
                                <option value="seller">Seller</option>
                                <option value="trader">Trader</option>
                                <option value="hatchery">Hatchery</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Location</label>
                            <select value={filters.state} onChange={(e) => updateFilter('state', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl outline-none font-medium text-gray-700 focus:ring-2 focus:ring-primary/20 cursor-pointer mb-2">
                                <option value="">All States</option>
                                {locationData.states.map(state => <option key={state} value={state}>{state}</option>)}
                            </select>
                            <select value={filters.district} onChange={(e) => updateFilter('district', e.target.value)} disabled={!filters.state} className="w-full p-3 bg-gray-50 rounded-xl outline-none font-medium text-gray-700 focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mb-2">
                                <option value="">All Districts</option>
                                {locationData.districts.map(dist => <option key={dist} value={dist}>{dist}</option>)}
                            </select>
                            <select value={filters.policeStation} onChange={(e) => updateFilter('policeStation', e.target.value)} disabled={!filters.district} className="w-full p-3 bg-gray-50 rounded-xl outline-none font-medium text-gray-700 focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                <option value="">All Police Stations</option>
                                {locationData.policeStations.map(ps => <option key={ps} value={ps}>{ps}</option>)}
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Status</label>
                            <select value={filters.accountStatus} onChange={(e) => updateFilter('accountStatus', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl outline-none font-medium text-gray-700 focus:ring-2 focus:ring-primary/20 cursor-pointer mb-2">
                                <option value="">All Account Status</option>
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="suspended">Suspended</option>
                            </select>
                            <select value={filters.verifiedStatus} onChange={(e) => updateFilter('verifiedStatus', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl outline-none font-medium text-gray-700 focus:ring-2 focus:ring-primary/20 cursor-pointer mb-2">
                                <option value="">All Verification</option>
                                <option value="true">Verified Only</option>
                                <option value="false">Unverified Only</option>
                            </select>
                            <select value={filters.isFlagged} onChange={(e) => updateFilter('isFlagged', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl outline-none font-medium text-gray-700 focus:ring-2 focus:ring-primary/20 cursor-pointer">
                                <option value="">All Risk Levels</option>
                                <option value="true">Flagged Only</option>
                                <option value="false">Safe Only</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Registration Date</label>
                            <input type="date" value={filters.dateFrom} onChange={(e) => updateFilter('dateFrom', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl outline-none font-medium text-gray-700 focus:ring-2 focus:ring-primary/20 cursor-pointer mb-2" />
                            <input type="date" value={filters.dateTo} onChange={(e) => updateFilter('dateTo', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl outline-none font-medium text-gray-700 focus:ring-2 focus:ring-primary/20 cursor-pointer" />
                        </div>
                    </div>
                )}

                {/* Table Area */}
                <div className="flex-1 w-full bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest cursor-pointer group whitespace-nowrap" onClick={() => toggleSort('name')}>
                                        User <SortIcon field="name" />
                                    </th>
                                    <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest cursor-pointer group whitespace-nowrap" onClick={() => toggleSort('role')}>
                                        Role <SortIcon field="role" />
                                    </th>
                                    <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest cursor-pointer group whitespace-nowrap" onClick={() => toggleSort('district')}>
                                        Location <SortIcon field="district" />
                                    </th>
                                    <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest cursor-pointer group whitespace-nowrap" onClick={() => toggleSort('createdAt')}>
                                        Joined <SortIcon field="createdAt" />
                                    </th>
                                    <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                                    <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan="6" className="py-20 text-center text-primary font-black animate-pulse">Loading users...</td></tr>
                                ) : users.length === 0 ? (
                                    <tr><td colSpan="6" className="py-20 text-center text-gray-400 font-bold">No users found matching your filters.</td></tr>
                                ) : (
                                    users.map(u => (
                                        <tr key={u._id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                                        {u.profilePicture ? <img loading="lazy" src={u.profilePicture} alt="" className="w-full h-full object-cover" /> : <Users size={20} className="text-gray-400" />}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-gray-900">{u.name}</div>
                                                        <div className="text-xs text-gray-400 font-bold">{u.phone || u.email || 'No contact'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 bg-gray-100 text-gray-600 font-bold uppercase tracking-widest text-[10px] rounded-full">{u.role}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-sm font-bold text-gray-700">{u.district || '-'}</div>
                                                <div className="text-xs text-gray-400">{u.localDistrict || '-'}</div>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-medium text-gray-600">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1 items-start">
                                                    <span className={`px-2 py-0.5 font-bold uppercase tracking-widest text-[10px] rounded-full flex items-center gap-1 ${u.accountStatus === 'active' ? 'bg-green-50 text-green-600' : u.accountStatus === 'suspended' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                                                        {u.accountStatus === 'active' ? <CheckCircle2 size={10} /> : u.accountStatus === 'suspended' ? <XCircle size={10} /> : <AlertCircle size={10} />}
                                                        {u.accountStatus}
                                                    </span>
                                                    {u.verifiedStatus && (
                                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 font-bold uppercase tracking-widest text-[10px] rounded-full flex items-center gap-1">
                                                            <ShieldCheck size={10} /> Verified
                                                        </span>
                                                    )}
                                                    {u.isFlagged && (
                                                        <span className="px-2 py-0.5 bg-red-100 text-red-600 font-bold uppercase tracking-widest text-[10px] rounded-full flex items-center gap-1">
                                                            <Flag size={10} /> Flagged
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button onClick={() => setSelectedUser(u)} className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm">
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {!loading && total > 0 && (
                        <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
                            <div className="text-sm font-medium text-gray-500">
                                Showing <span className="font-bold text-gray-900">{(page - 1) * limit + 1}</span> to <span className="font-bold text-gray-900">{Math.min(page * limit, total)}</span> of <span className="font-bold text-gray-900">{total}</span> users
                            </div>
                            <div className="flex items-center gap-4">
                                <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="p-2 bg-white rounded-xl border border-gray-200 outline-none font-bold text-sm text-gray-700 cursor-pointer">
                                    <option value={10}>10 per page</option>
                                    <option value={20}>20 per page</option>
                                    <option value={50}>50 per page</option>
                                </select>
                                <div className="flex gap-1">
                                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 bg-white rounded-xl border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-colors"><ChevronLeft size={18} /></button>
                                    <div className="px-4 py-2 bg-white rounded-xl border border-gray-200 font-bold text-sm">{page} / {totalPages}</div>
                                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 bg-white rounded-xl border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-colors"><ChevronRight size={18} /></button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <UserDetailModal 
                user={selectedUser} 
                onClose={() => setSelectedUser(null)} 
                onApprove={handleApprove}
                onReject={handleReject}
                onSuspend={handleSuspend}
                onDelete={handleDelete}
                onUnflag={handleUnflag}
            />
        </div>
    );
};

export default UserManagement;
