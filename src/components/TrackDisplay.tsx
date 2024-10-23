'use client';

import Link from 'next/link';
import SoundCloudEmbed from './SoundCloudEmbed';
import UserAvatar from './UserAvatar';
import { Button } from './ui/button';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { TrackWithCritiques } from '@/types/index';
import { canGiveCritique, getUserCritique } from '@/lib/critique-utils';

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
    
    if (canGiveCritique(currentUserEmail, track.user.id, track.critiques) && !isListingPage && !isCritiquePage) {
      return (
        <Link href={`/critique/${track.slug}`} passHref>
          <Button variant="outline">Give Critique</Button>
        </Link>
      );
    }

    return null;
  };

  return (
    <div className="border p-4 bg-card rounded mb-4">
      <h2 className="text-2xl font-semibold text-card-foreground mb-2">{track.title}</h2>
      <div className="flex items-center">
        <UserAvatar src={track.user.image} alt={track.user.name || ''} size={54} />
        <div className="ml-3">
          <p className="text-lg font-bold">{track.user.name || "Unknown Artist"}</p>
          {track.genre && <p className="text-xs text-muted-foreground">{track.genre}</p>}
          <p className="text-xs text-muted-background">{formatDistanceToNow(new Date(track.createdAt), { addSuffix: true })}</p>
        </div>
      </div>
      {track.description && <p className="mt-4 mb-2">{track.description}</p>}
      <SoundCloudEmbed url={track.url}/>
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