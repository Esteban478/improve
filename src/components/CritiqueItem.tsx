'use client';
import React from 'react';
import { StarIcon } from 'lucide-react';
import UserAvatar from './UserAvatar';
import { Button } from './ui/button';
import { ExtendedCritique } from '@/types/index';
import Link from 'next/link';

interface CritiqueItemProps {
  critique: ExtendedCritique;
  isTrackOwner: boolean;
  currentUserEmail: string | null;
  onRateClick?: () => void;
  onEditClick?: () => void;
}

const CritiqueItem: React.FC<CritiqueItemProps> = ({ 
  critique, 
  isTrackOwner, 
  currentUserEmail, 
  onRateClick, 
  onEditClick 
}) => {
  const truncate = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength - 3) + '...';
  };

  return (
    <div className="border p-4 rounded mb-4">
      <div className="flex items-center mb-2">
        <UserAvatar src={critique.user.image} alt={critique.user.name || ''} size={32} />
        <div className="ml-2">
          <p className="font-semibold">{critique.user.name}</p>
          <p className="text-sm text-gray-500">{new Date(critique.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <p className="mb-2">{truncate(critique.overallImpression, 200)}</p>
      <div className="flex items-center space-x-2 mt-2">
        {critique.rating !== null ? (
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={i < critique.rating! ? "text-yellow-400" : "text-gray-300"}
                size={16}
              />
            ))}
          </div>
        ) : isTrackOwner ? (
          <Button onClick={onRateClick} variant="outline" size="sm">
            Rate this critique
          </Button>
        ) : null}
        {critique.user.email === currentUserEmail && (
          <Button onClick={onEditClick} variant="outline" size="sm">
            Edit
          </Button>
        )}
        <Link href={`/critique/${critique.trackId}/${critique.id}`} passHref>
          <Button variant="outline" size="sm">View Full Critique</Button>
        </Link>
      </div>
    </div>
  );
};

export default CritiqueItem;