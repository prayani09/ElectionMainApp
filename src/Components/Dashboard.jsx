import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import debounce from 'lodash.debounce';
import { db, ref, get } from '../Firebase/config';
import * as XLSX from 'xlsx';

// Icons
import { 
  FiFilter, 
  FiDownload, 
  FiX, 
  FiUsers, 
  FiEye,
  FiSearch,
  FiHome,
  FiLoader,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

// Lazy load components
const SearchFilter = lazy(() => import('./SearchFilter'));
const VoterList = lazy(() => import('./VoterList'));

const Dashboard = () => {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    boothNumber: '',
    pollingStationAddress: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportPassword, setExportPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100); // Reduced for performance
  const [totalCount, setTotalCount] = useState(0);

  // Load voters with pagination
  const loadVoters = useCallback(async (page = 1, search = '', filter = {}) => {
    try {
      setLoading(true);
      const votersRef = ref(db, 'voters');
      const snapshot = await get(votersRef);
      
      if (snapshot.exists()) {
        const allVoters = [];
        snapshot.forEach((childSnapshot) => {
          const raw = childSnapshot.val();
          allVoters.push({
            id: childSnapshot.key,
            name: raw.name || raw.Name || '',
            voterId: raw.voterId || raw.VoterId || '',
            boothNumber: raw.boothNumber,
            pollingStationAddress: raw.pollingStationAddress,
            age: raw.age,
            gender: raw.gender
          });
        });

        // Apply search filter
        let filteredVoters = allVoters;
        if (search.trim()) {
          const terms = search.toLowerCase().split(/\s+/).filter(Boolean);
          filteredVoters = allVoters.filter(voter => {
            const searchText = `${voter.name} ${voter.voterId}`.toLowerCase();
            return terms.every(term => searchText.includes(term));
          });
        }

        // Apply other filters
        if (filter.boothNumber) {
          filteredVoters = filteredVoters.filter(voter => 
            voter.boothNumber && voter.boothNumber.toString().includes(filter.boothNumber)
          );
        }

        if (filter.pollingStationAddress) {
          filteredVoters = filteredVoters.filter(voter =>
            voter.pollingStationAddress && 
            voter.pollingStationAddress.toLowerCase().includes(filter.pollingStationAddress.toLowerCase())
          );
        }

        setTotalCount(filteredVoters.length);
        
        // Pagination
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedVoters = filteredVoters.slice(startIndex, endIndex);
        
        setVoters(paginatedVoters);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error loading voters:', error);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  // Debounced search
  useEffect(() => {
    const handler = debounce(() => {
      loadVoters(1, searchTerm, filters);
    }, 500);
    
    handler();
    return () => handler.cancel();
  }, [searchTerm, filters, loadVoters]);

  // Stats calculation
  const stats = {
    total: totalCount,
    filtered: voters.length,
    filteredOut: totalCount - voters.length
  };

  // Export handlers
  const handleExport = useCallback(() => {
    setShowExportModal(true);
  }, []);

  const verifyPasswordAndExport = useCallback(async () => {
    if (exportPassword === 'admin123') {
      await exportToExcel();
      setShowExportModal(false);
      setExportPassword('');
      setPasswordError('');
    } else {
      setPasswordError('Invalid password. Please try again.');
    }
  }, [exportPassword]);

  const exportToExcel = async () => {
    // For export, we need to load all filtered data
    setLoading(true);
    try {
      const votersRef = ref(db, 'voters');
      const snapshot = await get(votersRef);
      
      if (snapshot.exists()) {
        const allVoters = [];
        snapshot.forEach((childSnapshot) => {
          const raw = childSnapshot.val();
          allVoters.push({
            id: childSnapshot.key,
            name: raw.name || raw.Name || '',
            voterId: raw.voterId || raw.VoterId || '',
            boothNumber: raw.boothNumber,
            pollingStationAddress: raw.pollingStationAddress,
            age: raw.age,
            gender: raw.gender
          });
        });

        // Apply current filters for export
        let filteredVoters = allVoters;
        if (searchTerm.trim()) {
          const terms = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
          filteredVoters = allVoters.filter(voter => {
            const searchText = `${voter.name} ${voter.voterId}`.toLowerCase();
            return terms.every(term => searchText.includes(term));
          });
        }

        const worksheet = XLSX.utils.json_to_sheet(filteredVoters.map(voter => ({
          'Voter ID': voter.voterId,
          'Name': voter.name,
          'Booth Number': voter.boothNumber,
          'Polling Station': voter.pollingStationAddress,
          'Age': voter.age,
          'Gender': voter.gender
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Voters Data');
        XLSX.writeFile(workbook, `voters-data-${new Date().toISOString().split('T')[0]}.xlsx`);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      loadVoters(newPage, searchTerm, filters);
    }
  };

  const StatsCard = ({ icon: Icon, label, value, color, subtitle }) => (
    <div className="group bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-600 truncate mb-1">{label}</p>
          <p className={`text-2xl font-bold ${color} mb-1 truncate`}>{value.toLocaleString()}</p>
          {subtitle && <p className="text-xs text-gray-500 opacity-80">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color === 'text-orange-600' ? 'from-orange-50 to-orange-100' : color === 'text-blue-600' ? 'from-blue-50 to-blue-100' : 'from-green-50 to-green-100'} ml-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`text-xl ${color}`} />
        </div>
      </div>
    </div>
  );

  if (loading && voters.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-orange-200 rounded-full animate-spin"></div>
            <div className="w-20 h-20 border-4 border-transparent border-t-orange-600 rounded-full absolute top-0 left-0 animate-spin"></div>
            <FiLoader className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-600 text-xl animate-pulse" />
          </div>
          <div className="text-orange-600 text-lg font-semibold mt-4">
            Loading voter data...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 p-3">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/40">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Voter Dashboard
                </h1>
                <p className="text-sm text-gray-600 mt-2 opacity-80">
                  Managing {totalCount.toLocaleString()} voter records
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg">
                <FiHome className="text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        {activeTab === 'overview' && (
          <div className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatsCard 
                icon={FiUsers} 
                label="Total Voters" 
                value={stats.total} 
                color="text-orange-600"
                subtitle="All registered voters"
              />
              <StatsCard 
                icon={FiEye} 
                label="Currently Showing" 
                value={stats.filtered} 
                color="text-blue-600"
                subtitle={`Page ${currentPage} of ${totalPages}`}
              />
              <StatsCard 
                icon={FiFilter} 
                label="Filtered Out" 
                value={stats.filteredOut} 
                color="text-green-600"
                subtitle="Excluded from view"
              />
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/40 mb-6">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search by name or voter ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200/80 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 bg-white/80 backdrop-blur-sm text-base placeholder-gray-400"
            />
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <select 
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="text-sm border rounded-lg px-3 py-1"
            >
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
              <option value={200}>200 per page</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white border disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white border disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>

        {/* Voter List */}
        {(activeTab === 'voters' || activeTab === 'overview') && (
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 overflow-hidden">
            <Suspense fallback={
              <div className="flex justify-center items-center py-12">
                <FiLoader className="animate-spin text-orange-500 text-2xl mr-3" />
                <span className="text-gray-600">Loading voters...</span>
              </div>
            }>
              <VoterList voters={voters} />
            </Suspense>
          </div>
        )}

        {/* Rest of your component remains similar... */}
      </div>
    </div>
  );
};

export default Dashboard;