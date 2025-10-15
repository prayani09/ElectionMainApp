// src/components/VoterList.jsx
import React from 'react';
import VoterCard from './VoterCard';

const VoterList = ({ voters }) => {
  if (voters.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No voters found matching your criteria</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {voters.map((voter) => (
        <VoterCard key={voter.id} voter={voter} />
      ))}
    </div>
  );
};

export default VoterList;