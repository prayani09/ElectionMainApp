import React, { useState, useCallback, memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// react-window sometimes exposes exports differently depending on bundler/Esm/CJS.
// Use a namespace import and resolve the component at runtime to avoid the "does not provide an export named 'FixedSizeList'" error.
import * as ReactWindow from 'react-window';

// Resolve FixedSizeList across module shapes: named export, default export, or fallback
const FixedSizeList = ReactWindow.FixedSizeList || (ReactWindow.default && ReactWindow.default.FixedSizeList) || ReactWindow.default || null;
import { FiCopy, FiMapPin, FiPhone, FiUser, FiLoader } from 'react-icons/fi';
import TranslatedText from './TranslatedText';

const VoterRow = memo(({ data, index, style }) => {
  const voter = data.voters[index];
  const [copied, setCopied] = useState(false);

  const handleCopyVoterId = useCallback(async (e) => {
    e && e.stopPropagation();
    try {
      await navigator.clipboard.writeText(voter.voterId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [voter.voterId]);

  const handleCall = useCallback((e) => {
    e && e.stopPropagation();
    if (voter.phone) {
      window.open(`tel:${voter.phone}`);
    }
  }, [voter.phone]);

  const handleViewDetails = useCallback((e) => {
    e && e.stopPropagation();
    if (data && typeof data.onView === 'function') {
      data.onView(voter);
    } else {
      console.log('View details:', voter.id);
    }
  }, [data, voter]);

  if (!voter) {
    return (
      <div style={style} className="px-4 border-b border-gray-100">
        <div className="animate-pulse bg-gray-200/60 rounded-xl h-20"></div>
      </div>
    );
  }

  return (
    <div style={style} className="px-4 border-b border-gray-100 cursor-pointer" onClick={handleViewDetails}>
      <div className="py-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiUser className="text-white text-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate text-base">{voter.name}</h3>
                <p className="text-sm text-gray-600 truncate">ID: {voter.voterId}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
              {voter.boothNumber && (
                <div className="flex items-center gap-1">
                  <FiMapPin className="text-gray-400 flex-shrink-0" />
                  <span className="truncate">Booth {voter.boothNumber}</span>
                </div>
              )}
              {voter.age && (
                <div>
                  <span>Age: {voter.age}</span>
                </div>
              )}
            </div>

            {voter.pollingStationAddress && (
              <p className="text-xs text-gray-500 truncate mb-3">
                {voter.pollingStationAddress}
              </p>
            )}
          </div>

          {/* Row Actions */}
            <div className="flex flex-col gap-2 ml-3 flex-shrink-0">
            <button
              onClick={handleCopyVoterId}
              className="min-h-[36px] min-w-[36px] p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all duration-200 active:scale-95 flex items-center justify-center"
              aria-label="Copy Voter ID"
            >
              <FiCopy className="text-sm" />
            </button>
            
            {voter.phone && (
              <button
                onClick={handleCall}
                className="min-h-[36px] min-w-[36px] p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all duration-200 active:scale-95 flex items-center justify-center"
                aria-label="Call voter"
              >
                <FiPhone className="text-sm" />
              </button>
            )}
            
            <button
              onClick={handleViewDetails}
              className="min-h-[36px] min-w-[36px] p-2 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-all duration-200 active:scale-95 flex items-center justify-center"
              aria-label="View details"
            >
              <FiUser className="text-sm" />
            </button>
          </div>
        </div>

        {/* Copy Success Toast */}
        {copied && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-lg text-sm animate-fade-in">
            <TranslatedText>Copied!</TranslatedText>
          </div>
        )}
      </div>
    </div>
  );
});

VoterRow.displayName = 'VoterRow';
// Voter details modal component
const VoterModal = ({ voter, onClose }) => {
  if (!voter) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">{voter.name}</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Voter ID:</strong> {voter.voterId}</p>
          <p><strong>Booth:</strong> {voter.boothNumber}</p>
          <p><strong>Polling Station:</strong> {voter.pollingStationAddress}</p>
          <p><strong>Age:</strong> {voter.age}</p>
          <p><strong>Gender:</strong> {voter.gender}</p>
        </div>
      </div>
    </div>
  );
};

const VoterList = ({ voters, loading, onLoadMore, hasMore }) => {
  const itemHeight = 140; // Approximate height of each row
  const navigate = useNavigate();

  const listData = useMemo(() => ({
    voters,
    loading,
    onLoadMore,
    hasMore,
    onView: (v) => navigate(`/voter/${v.id}`)
  }), [voters, loading, onLoadMore, hasMore, navigate]);

  if (loading && voters.length === 0) {
    return (
      <div className="p-6">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="mb-4 animate-pulse">
            <div className="bg-gray-200/60 rounded-xl h-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (voters.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 mb-4">
          <FiUser className="text-4xl mx-auto" />
        </div>
        <p className="text-gray-600 font-medium mb-2">
          <TranslatedText>No voters found</TranslatedText>
        </p>
        <p className="text-gray-500 text-sm">
          <TranslatedText>Try adjusting your search or filters</TranslatedText>
        </p>
      </div>
    );
  }

  // If FixedSizeList couldn't be resolved (some bundlers), fall back to a simple list rendering to avoid runtime crash.
  if (!FixedSizeList) {
    return (
      <div className="p-2">
        {voters.map((voter, idx) => (
          <div key={voter.id || idx} className="mb-2">
            <VoterRow data={{ voters, onView: (v) => navigate(`/voter/${v.id}`) }} index={idx} style={{}} />
          </div>
        ))}
        {loading && voters.length > 0 && (
          <div className="flex justify-center items-center py-4 border-t border-gray-100">
            <FiLoader className="animate-spin text-orange-500 text-xl mr-3" />
            <span className="text-gray-600">
              <TranslatedText>Loading more voters...</TranslatedText>
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <FixedSizeList
        height={600}
        itemCount={voters.length}
        itemSize={itemHeight}
        itemData={listData}
        className="scrollbar-hide"
      >
        {VoterRow}
      </FixedSizeList>

      {/* Loading indicator for additional items */}
      {loading && voters.length > 0 && (
        <div className="flex justify-center items-center py-4 border-t border-gray-100">
          <FiLoader className="animate-spin text-orange-500 text-xl mr-3" />
          <span className="text-gray-600">
            <TranslatedText>Loading more voters...</TranslatedText>
          </span>
        </div>
      )}
      {/* No modal — navigation to full details page handles viewing */}
    </div>
  );
};
export default VoterList;