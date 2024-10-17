'use client';

import React from 'react';
import CritiqueItem from './CritiqueItem';
import { ExtendedCritique } from '../types/index';

interface CritiqueListProps {
  critiques: ExtendedCritique[];
  isTrackOwner: boolean;
  currentUserEmail: string | null;
}

const CritiqueList: React.FC<CritiqueListProps> = ({
  critiques,
  isTrackOwner,
  currentUserEmail,
}) => {
  const handleRateClick = (critiqueId: string) => {
    // Implement rate logic here
    console.log(`Rate critique: ${critiqueId}`);
  };

  const handleEditClick = (critiqueId: string) => {
    // Implement edit logic here
    console.log(`Edit critique: ${critiqueId}`);
  };

  return (
    <div>
      {critiques.map((critique) => (
        <CritiqueItem
          key={critique.id}
          critique={critique}
          isTrackOwner={isTrackOwner}
          currentUserEmail={currentUserEmail}
          onRateClick={() => handleRateClick(critique.id)}
          onEditClick={() => handleEditClick(critique.id)}
        />
      ))}
    </div>
  );
};

export default CritiqueList;