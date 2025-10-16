import React from 'react';
import * as RW from 'react-window';

const VoterItem = ({ index, style, data }) => {
  const voter = data[index];
  return (
    <div style={style} className="border-b border-gray-100 px-4 py-3 hover:bg-gray-50">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-semibold text-gray-900">{voter.name}</h4>
          <p className="text-sm text-gray-600">Voter ID: {voter.voterId}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">Booth: {voter.boothNumber}</p>
          <p className="text-xs text-gray-500 truncate max-w-[200px]">
            {voter.pollingStationAddress}
          </p>
        </div>
      </div>
    </div>
  );
};

const VoterList = ({ voters }) => {
  // Defensive: ensure voters is an array
  if (!Array.isArray(voters) || voters.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No voters found matching your criteria.
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
        itemSize={80}
        itemData={voters}
      >
        {VoterItem}
      </ListComp>
    );
  }

  // Fallback: render a simple list if virtualization isn't available
  return (
    <div className="divide-y divide-gray-100">
      {voters.map((voter, idx) => (
        <div key={voter.id || idx} className="px-4 py-3 hover:bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <h2>Shriyash</h2>
              <h4 className="font-semibold text-gray-900">{voter?.name || '—'}</h4>
              <p className="text-sm text-gray-600">Voter ID: {voter?.voterId || '—'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Booth: {voter?.boothNumber ?? '—'}</p>
              <p className="text-xs text-gray-500 truncate max-w-[200px]">
                {voter?.pollingStationAddress || '—'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VoterList;