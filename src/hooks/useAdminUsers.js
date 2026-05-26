import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../utils/api';
import { stateDistricts } from '../utils/districtsData';

/**
 * useAdminUsers
 * ─────────────
 * Custom hook for admin user management with filtering, search,
 * pagination, sorting, and cascading location data.
 */
const useAdminUsers = () => {
    // --- Filter State ---
    const [filters, setFilters] = useState({
        role: '',
        state: '',
        district: '',
        policeStation: '',
        accountStatus: '',
        verifiedStatus: '',
        isFlagged: '',
        dateFrom: '',
        dateTo: ''
    });

    // --- Search ---
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const debounceTimer = useRef(null);

    // --- Pagination ---
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // --- Sorting ---
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

    // --- Data ---
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Cascading location data ---
    const [locationData, setLocationData] = useState({
        states: Object.keys(stateDistricts),
        districts: [],
        policeStations: []
    });

    // Debounce search input
    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setPage(1); // Reset to page 1 on new search
        }, 300);
        return () => clearTimeout(debounceTimer.current);
    }, [searchInput]);

    // Fetch users when filters/search/pagination/sort change
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            params.set('page', page);
            params.set('limit', limit);
            params.set('sortBy', sortBy);
            params.set('sortOrder', sortOrder);

            if (filters.role) params.set('role', filters.role);
            if (filters.state) params.set('state', filters.state);
            if (filters.district) params.set('district', filters.district);
            if (filters.policeStation) params.set('policeStation', filters.policeStation);
            if (filters.accountStatus) params.set('accountStatus', filters.accountStatus);
            if (filters.verifiedStatus !== '') params.set('verifiedStatus', filters.verifiedStatus);
            if (filters.isFlagged !== '') params.set('isFlagged', filters.isFlagged);
            if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
            if (filters.dateTo) params.set('dateTo', filters.dateTo);
            if (debouncedSearch) params.set('search', debouncedSearch);

            const res = await api.get(`/admin/users?${params.toString()}`);
            setUsers(res.data.users || res.data || []);
            setTotal(res.data.total || 0);
            setTotalPages(res.data.totalPages || 1);
        } catch (err) {
            console.error('fetchUsers error:', err);
            setError(err.response?.data?.msg || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [page, limit, sortBy, sortOrder, filters, debouncedSearch]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Fetch cascading location data (Police stations dynamically, districts from static file)
    const fetchLocations = useCallback(async () => {
        try {
            // Update districts based on static data
            const availableDistricts = filters.state ? (stateDistricts[filters.state] || []) : [];
            
            // Fetch dynamic police stations from DB if both state and district are selected
            let dynamicPoliceStations = [];
            if (filters.state && filters.district) {
                const params = new URLSearchParams();
                params.set('state', filters.state);
                params.set('district', filters.district);
                const res = await api.get(`/admin/users/locations?${params.toString()}`);
                dynamicPoliceStations = res.data.policeStations || [];
            }

            setLocationData({
                states: Object.keys(stateDistricts),
                districts: availableDistricts,
                policeStations: dynamicPoliceStations
            });
        } catch (err) {
            console.error('fetchLocations error:', err);
        }
    }, [filters.state, filters.district]);

    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);

    // Filter update helpers
    const updateFilter = (key, value) => {
        setFilters(prev => {
            const next = { ...prev, [key]: value };
            // Reset cascading dependencies
            if (key === 'state') {
                next.district = '';
                next.policeStation = '';
            }
            if (key === 'district') {
                next.policeStation = '';
            }
            return next;
        });
        setPage(1);
    };

    const clearFilters = () => {
        setFilters({
            role: '',
            state: '',
            district: '',
            policeStation: '',
            accountStatus: '',
            verifiedStatus: '',
            isFlagged: '',
            dateFrom: '',
            dateTo: ''
        });
        setSearchInput('');
        setDebouncedSearch('');
        setPage(1);
        setSortBy('createdAt');
        setSortOrder('desc');
    };

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
        setPage(1);
    };

    const activeFilterCount = Object.values(filters).filter(v => v !== '').length + (debouncedSearch ? 1 : 0);

    return {
        // Data
        users,
        loading,
        error,
        total,
        // Filters
        filters,
        updateFilter,
        clearFilters,
        activeFilterCount,
        // Search
        searchInput,
        setSearchInput,
        // Pagination
        page,
        setPage,
        limit,
        setLimit,
        totalPages,
        // Sorting
        sortBy,
        sortOrder,
        toggleSort,
        // Location data for cascading filters
        locationData,
        // Refetch
        refetch: fetchUsers
    };
};

export default useAdminUsers;
