import React from 'react';
import { StarIcon, PenIcon, EyeIcon } from 'lucide-react';
import UserAvatar from './UserAvatar';
import { Button } from './ui/button';
import { ExtendedCritique } from '@/types/index';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { canEditCritique } from '@/lib/critique-utils';

interface CritiqueItemProps {
  critique: ExtendedCritique;
  isTrackOwner: boolean;
  currentUserEmail: string | null;
  trackSlug: string;
}

const CritiqueItem: React.FC<CritiqueItemProps> = ({ 
  critique, 
  isTrackOwner, 
  currentUserEmail,
  trackSlug
}) => {
  const truncate = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength - 3) + '...';
  };

  const canEdit = canEditCritique(currentUserEmail, critique);
  const canRate = isTrackOwner && critique.rating === null;

  return (
    <div className="border p-4 rounded mb-4">
      <div className="flex items-center mb-2">
        <UserAvatar src={critique.user.image} alt={critique.user.name || ''} size={32} />
        <div className="ml-2">
          <p className="font-semibold">
            {critique.user.name} 
            <span className="text-sm text-gray-500 ml-2">({critique.user.role || 'User'})</span>
          </p>
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(critique.createdAt), { addSuffix: true })}
          </p>
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
        ) : canRate ? (
          <Link href={`/critique/${trackSlug}/${critique.id}/rate`} passHref>
            <Button variant="outline" size="sm">
              <StarIcon className="mr-2" size={16} />
              Rate
            </Button>
          </Link>
        ) : null}
        
        {canEdit && (
          <Link href={`/critique/${trackSlug}/${critique.id}/edit`} passHref>
            <Button variant="outline" size="sm">
              <PenIcon className="mr-2" size={16} />
              Edit
            </Button>
          </Link>
        )}
        
        <Link href={`/critique/${trackSlug}/${critique.id}`} passHref>
          <Button variant="outline" size="sm">
            <EyeIcon className="mr-2" size={16} />
            View Full Critique
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CritiqueItem;