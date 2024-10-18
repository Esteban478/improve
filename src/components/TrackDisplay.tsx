'use client';

import React from 'react';
import Link from 'next/link';
import SoundCloudEmbed from './SoundCloudEmbed';
import UserAvatar from './UserAvatar';
import { Button } from './ui/button';
import { TrackWithCritiques } from '@/types/index';
import { canGiveCritique, canEditCritique, getUserCritique } from '@/lib/critique-utils';

interface TrackDisplayProps {
  track: TrackWithCritiques;
  isListingPage: boolean;
  isCritiquePage: boolean;
  showFeedbackRequest: boolean;
  isTrackOwner: boolean;
  currentUserEmail: string | null;
}

const TrackDisplay: React.FC<TrackDisplayProps> = ({
  track,
  isListingPage,
  isCritiquePage,
  showFeedbackRequest,
  isTrackOwner,
  currentUserEmail,
}) => {
  const handleRequestFeedback = async () => {
    // Implement request feedback logic here
    console.log('Requesting feedback');
  };

  const renderCritiqueButton = () => {
    if (isTrackOwner) return null;

    const userCritique = getUserCritique(currentUserEmail, track.critiques);

    if (canGiveCritique(currentUserEmail, track.user.id, track.critiques) && !isListingPage && !isCritiquePage) {
      return (
        <Link href={`/critique/${track.slug}`} passHref>
          <Button variant="outline">Give Critique</Button>
        </Link>
      );
    } else if (userCritique) {
      if (canEditCritique(currentUserEmail, userCritique)  && !isListingPage && !isCritiquePage) {
        return (
          <Link href={`/critique/${track.slug}/${userCritique.id}/edit`} passHref>
            <Button variant="outline">Edit Critique</Button>
          </Link>
        );
      }
    }

    return null;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h2 className="text-2xl font-semibold mb-4">{track.title}</h2>
      <div className="flex items-center mb-4">
        <UserAvatar src={track.user.image} alt={track.user.name || ''} size={40} />
        <div className="ml-3">
          <p className="font-medium">{track.user.name || "Unknown Artist"}</p>
          {track.genre && <p className="text-sm text-gray-500">{track.genre}</p>}
        </div>
      </div>
      <SoundCloudEmbed url={track.url} />
      {track.description && <p className="text-gray-700 my-4">{track.description}</p>}
      <div className="mt-4 space-x-2">
        {isListingPage && (
          <Link href={`/tracks/${track.slug}`} passHref>
            <Button variant="default">View Track</Button>
          </Link>
        )}
        {isCritiquePage && (
          <Link href={`/tracks/${track.slug}`} passHref>
            <Button variant="default">Back to Track</Button>
          </Link>
        )}
        {!isCritiquePage && renderCritiqueButton()}
        {showFeedbackRequest && isTrackOwner && !track.requested && (
          <Button variant="outline" onClick={handleRequestFeedback}>
            Request Feedback
          </Button>
        )}
      </div>
    </div>
  );
};

export default TrackDisplay;