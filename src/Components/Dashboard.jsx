// src/components/Dashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { db, ref, get } from '../Firebase/config';
import SearchFilter from './SearchFilter';
import VoterList from './VoterList';
import * as XLSX from 'xlsx';

// Icons
import { 
  FiFilter, 
  FiDownload, 
  FiX, 
  FiUsers, 
  FiEye,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiMenu,
  FiHome
} from 'react-icons/fi';

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

  useEffect(() => {
    loadVoters();
  }, []);

  const loadVoters = async () => {
    try {
      const votersRef = ref(db, 'voters');
      const snapshot = await get(votersRef);
      
      if (snapshot.exists()) {
        const votersData = [];
        snapshot.forEach((childSnapshot) => {
          votersData.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        setVoters(votersData);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading voters:', error);
      setLoading(false);
    }
  };

  const filteredVoters = useMemo(() => {
    return voters.filter(voter => {
      const matchesSearch = searchTerm === '' || 
        voter.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voter.voterId?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBooth = filters.boothNumber === '' || 
        voter.boothNumber?.toString().includes(filters.boothNumber);
      
      const matchesPollingStation = filters.pollingStationAddress === '' ||
        voter.pollingStationAddress?.toLowerCase().includes(filters.pollingStationAddress.toLowerCase());
      
      return matchesSearch && matchesBooth && matchesPollingStation;
    });
  }, [voters, searchTerm, filters]);

  const boothNumbers = useMemo(() => {
    return [...new Set(voters.map(voter => voter.boothNumber).filter(Boolean))].sort();
  }, [voters]);

  const pollingStations = useMemo(() => {
    return [...new Set(voters.map(voter => voter.pollingStationAddress).filter(Boolean))].sort();
  }, [voters]);

  const handleExport = () => {
    setShowExportModal(true);
  };

  const verifyPasswordAndExport = () => {
    if (exportPassword === 'admin123') {
      exportToExcel();
      setShowExportModal(false);
      setExportPassword('');
      setPasswordError('');
    } else {
      setPasswordError('Invalid password. Please try again.');
    }
  };

  const exportToExcel = () => {
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
  };

  const StatsCard = ({ icon: Icon, label, value, color, subtitle }) => (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-3 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-600 truncate">{label}</p>
          <p className={`text-xl font-bold ${color} mt-1 truncate`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="p-2 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 ml-2 flex-shrink-0">
          <Icon className={`text-lg ${color}`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <div className="text-orange-600 text-lg font-semibold">Loading voter data...</div>
          <div className="text-orange-400 text-sm mt-2">Please wait</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-3">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/30">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Voter Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">Manage and analyze voter data</p>
              </div>
              <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <FiHome className="text-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-1 shadow-lg border border-white/20 mb-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 px-1 text-xs font-medium rounded-xl transition-all duration-200 ${
                activeTab === 'overview' 
                  ? 'bg-orange-500 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('voters')}
              className={`flex-1 py-2 px-1 text-xs font-medium rounded-xl transition-all duration-200 ${
                activeTab === 'voters' 
                  ? 'bg-orange-500 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              Voters
            </button>
            <button
              onClick={() => setActiveTab('filters')}
              className={`flex-1 py-2 px-1 text-xs font-medium rounded-xl transition-all duration-200 ${
                activeTab === 'filters' 
                  ? 'bg-orange-500 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              Filters
            </button>
          </div>
        </div>

        {/* Stats Overview - Horizontal Scroll for Mobile */}
        {activeTab === 'overview' && (
          <div className="mb-4">
            <div className="overflow-x-auto pb-2 -mx-2 px-2">
              <div className="flex gap-3 min-w-max">
                <div className="w-40 flex-shrink-0">
                  <StatsCard 
                    icon={FiUsers} 
                    label="Total Voters" 
                    value={voters.length} 
                    color="text-orange-600"
                    subtitle="All records"
                  />
                </div>
                <div className="w-40 flex-shrink-0">
                  <StatsCard 
                    icon={FiEye} 
                    label="Showing" 
                    value={filteredVoters.length} 
                    color="text-blue-600"
                    subtitle="Filtered results"
                  />
                </div>
                <div className="w-40 flex-shrink-0">
                  <StatsCard 
                    icon={FiFilter} 
                    label="Filtered Out" 
                    value={voters.length - filteredVoters.length} 
                    color="text-green-600"
                    subtitle="Excluded records"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar - Always Visible */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-3 shadow-xl border border-white/30 mb-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search voters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm"
            />
          </div>
        </div>

        {/* Action Buttons - Horizontal Layout */}
        {(activeTab === 'overview' || activeTab === 'voters') && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 flex-1 px-3 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 text-sm"
            >
              <FiFilter className="text-base" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 flex-1 px-3 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 text-sm"
            >
              <FiDownload className="text-base" />
              Export
            </button>
          </div>
        )}

        {/* Filters Section */}
        {(showFilters || activeTab === 'filters') && (
          <div className="mb-4 animate-slideDown">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Filter Voters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="text-gray-500 text-base" />
                </button>
              </div>
              <SearchFilter
                filters={filters}
                onFiltersChange={setFilters}
                boothNumbers={boothNumbers}
                pollingStations={pollingStations}
                compact={true}
              />
            </div>
          </div>
        )}

        {/* Voter List */}
        {(activeTab === 'voters' || activeTab === 'overview') && (
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
            <div className="p-3 border-b border-gray-200 bg-white/80">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  Voter List ({filteredVoters.length})
                </h3>
                <div className="text-xs text-gray-500 bg-orange-50 px-2 py-1 rounded-lg">
                  {filteredVoters.length} of {voters.length}
                </div>
              </div>
            </div>
            <VoterList voters={filteredVoters} />
          </div>
        )}

        {/* Quick Actions Footer for Mobile */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-sm">
          <div className="bg-white/95 backdrop-blur-2xl rounded-2xl p-3 shadow-2xl border border-white/40">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${
                  activeTab === 'overview' ? 'bg-orange-50 text-orange-600' : 'text-gray-600'
                }`}
              >
                <FiUsers className="text-lg mb-1" />
                <span className="text-xs font-medium">Stats</span>
              </button>
              
              <button
                onClick={() => setActiveTab('voters')}
                className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${
                  activeTab === 'voters' ? 'bg-orange-50 text-orange-600' : 'text-gray-600'
                }`}
              >
                <FiEye className="text-lg mb-1" />
                <span className="text-xs font-medium">Voters</span>
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('filters');
                  setShowFilters(true);
                }}
                className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${
                  activeTab === 'filters' ? 'bg-orange-50 text-orange-600' : 'text-gray-600'
                }`}
              >
                <FiFilter className="text-lg mb-1" />
                <span className="text-xs font-medium">Filter</span>
              </button>
              
              <button
                onClick={handleExport}
                className="flex flex-col items-center p-2 rounded-xl text-gray-600 hover:text-green-600 transition-all duration-200"
              >
                <FiDownload className="text-lg mb-1" />
                <span className="text-xs font-medium">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl animate-scaleIn border border-white/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Export Data</h3>
              <button
                onClick={() => {
                  setShowExportModal(false);
                  setExportPassword('');
                  setPasswordError('');
                }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <FiX className="text-gray-500 text-lg" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Enter password to download Excel file with <span className="font-semibold text-orange-600">{filteredVoters.length}</span> records.
            </p>
            
            <input
              type="password"
              value={exportPassword}
              onChange={(e) => setExportPassword(e.target.value)}
              placeholder="Enter admin password..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 mb-3 text-sm"
            />
            
            {passwordError && (
              <p className="text-red-500 text-xs mb-3 flex items-center gap-1">
                <FiX className="text-base" /> {passwordError}
              </p>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowExportModal(false);
                  setExportPassword('');
                  setPasswordError('');
                }}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={verifyPasswordAndExport}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add padding for fixed footer */}
      <div className="h-20"></div>
    </div>
  );
};

export default Dashboard;