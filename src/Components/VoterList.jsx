import React from 'react';
import * as RW from 'react-window';
import TranslatedText from './TranslatedText';

// Lazy load VoterCard
const VoterCard = React.lazy(() => import('./VoterCard'));

const VoterItem = ({ index, style, data }) => {
  const voter = data[index];
  
  return (
    <div style={style} className="px-3 py-2">
      <React.Suspense fallback={
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/30 animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      }>
        <VoterCard voter={voter} />
      </React.Suspense>
    </div>
  );
};

const VoterList = ({ voters }) => {
  // Defensive: ensure voters is an array
  if (!Array.isArray(voters) || voters.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-white/80 backdrop-blur-xl rounded-2xl m-4">
        <div className="text-4xl mb-3">📋</div>
        <p className="text-lg font-medium mb-2">
          <TranslatedText>No voters found</TranslatedText>
        </p>
        <p className="text-sm text-gray-600">
          <TranslatedText>Try adjusting your search or filters</TranslatedText>
        </p>
      </div>
    );
  }

  // Try to resolve FixedSizeList from different module shapes
  const ListComp = RW.FixedSizeList || (RW.default && RW.default.FixedSizeList) || null;

  // If react-window is available and exposes FixedSizeList, use it for virtualization
  if (ListComp) {
    return (
      <ListComp
        height={600}
        itemCount={voters.length}
        itemSize={160} // Increased size for card layout
        itemData={voters}
        className="px-1"
      >
        {VoterItem}
      </ListComp>
    );
  }

  // Fallback: render a simple list if virtualization isn't available
  return (
    <div className="space-y-3 p-3">
      {voters.map((voter, idx) => (
        <React.Suspense 
          key={voter.id || idx} 
          fallback={
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/30 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          }
        >
          <VoterCard voter={voter} />
        </React.Suspense>
      ))}
    </div>
  );
};

export default VoterList;