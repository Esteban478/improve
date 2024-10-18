'use client';

import React from 'react';
import CritiqueItem from './CritiqueItem';
import { ExtendedCritique } from '../types/index';

interface CritiqueListProps {
  critiques: ExtendedCritique[];
  isTrackOwner: boolean;
  currentUserEmail: string | null;
  trackSlug: string;
}

const CritiqueList: React.FC<CritiqueListProps> = ({
  critiques,
  isTrackOwner,
  currentUserEmail,
  trackSlug
}) => {

  return (
    <div>
      {critiques.map((critique) => (
        <CritiqueItem
          key={critique.id}
          critique={critique}
          isTrackOwner={isTrackOwner}
          currentUserEmail={currentUserEmail}
          trackSlug={trackSlug}
        />
      ))}
    </div>
  );
};

export default CritiqueList;