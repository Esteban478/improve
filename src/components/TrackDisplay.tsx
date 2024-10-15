"use client"

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import SoundCloudEmbed from './SoundCloudEmbed';
import UserAvatar from './UserAvatar';
import { Button } from '@/components/ui/button';
import SlideOverPanel from './SlideOverPanel';
import { TrackWithCritiques, ExtendedCritique } from '@/src/@types'

interface TrackDisplayProps {
  track: TrackWithCritiques;
  isListingPage: boolean;
}

const TrackDisplay: React.FC<TrackDisplayProps> = ({ track, isListingPage }) => {
  const { data: session } = useSession();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCritique, setSelectedCritique] = useState<ExtendedCritique | null>(null);
  const [userCritique, setUserCritique] = useState<ExtendedCritique | null>(null);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (session && session.user && track.critiques) {
      const userCrit = track.critiques.find(c => c.user.email === session.user?.email);
      setUserCritique(userCrit || null);
      
      if (userCrit) {
        const submissionTime = new Date(userCrit.createdAt);
        const currentTime = new Date();
        const timeDifference = currentTime.getTime() - submissionTime.getTime();
        const minutesDifference = timeDifference / (1000 * 60);
        
        setCanEdit(minutesDifference <= 15);
      }
    }
  }, [session, track.critiques]);

  const isOwnTrack = session?.user?.email === track.user.email;
  const hasGivenCritique = !!userCritique;

  const handleCritiqueClick = (critique: ExtendedCritique) => {
    setSelectedCritique(critique);
    setIsDetailsOpen(true);
  };

  const renderCritiqueSummary = (critique: ExtendedCritique) => (
    <div key={critique.id} className="mt-2 p-2 bg-gray-100 rounded">
      <p className="font-semibold">Overall Impression:</p>
      <p className="text-sm">{critique.overallImpression?.substring(0, 200)}...</p>
      <Button onClick={() => handleCritiqueClick(critique)} className="mt-2">
        Read Full Critique
      </Button>
    </div>
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <div className="flex items-center mb-4">
        <UserAvatar src={track.user.image} alt={track.user.name || 'User'} size={40} />
        <h2 className="text-xl font-semibold ml-2">{track.title}</h2>
      </div>
      <p className="text-gray-600 mb-2">By {track.user.name || "Unknown Artist"}</p>
      {track.genre && <p className="text-sm text-gray-500 mb-4">Genre: {track.genre}</p>}
      <SoundCloudEmbed url={track.url} />
      {track.description && <p className="text-gray-700 my-4">{track.description}</p>}
      {track.critiques && track.critiques.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Latest Critique</h3>
          {renderCritiqueSummary(track.critiques[0])}
        </div>
      )}
      <div className="mt-4 space-x-2">
        {isListingPage && (
          <Link href={`/tracks/${track.id}`} className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            View Track
          </Link>
        )}
        {!isOwnTrack && !hasGivenCritique && (
          <Link href={`/critique/${track.id}`} className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Give Critique
          </Link>
        )}
        {!isOwnTrack && hasGivenCritique && canEdit && (
          <Link href={`/critique/${track.id}/edit`} className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Edit Critique
          </Link>
        )}
      </div>
      <SlideOverPanel isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)}>
        {selectedCritique && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Full Critique</h2>
            <h3 className="text-xl font-semibold mt-4">Objective Criteria</h3>
            <p>Mixing Quality: {selectedCritique.mixingQuality || 'Not rated'}</p>
            <p>Tonal Balance: {selectedCritique.tonalBalance || 'Not rated'}</p>
            <p>Mastering Loudness: {selectedCritique.masteringLoudness || 'Not rated'}</p>
            <p>Sound Design: {selectedCritique.soundDesign || 'Not rated'}</p>
            <p>Arrangement: {selectedCritique.arrangement || 'Not rated'}</p>
            {selectedCritique.technicalSummary && (
              <div>
                <h4 className="font-semibold mt-2">Technical Summary:</h4>
                <p>{selectedCritique.technicalSummary}</p>
              </div>
            )}
            <h3 className="text-xl font-semibold mt-4">Subjective Criteria</h3>
            <p>Emotional Response: {selectedCritique.emotionalResponse}</p>
            <p>Imagery: {selectedCritique.imagery}</p>
            <p>Standout Elements: {selectedCritique.standoutElements}</p>
            <p>Genre Fit: {selectedCritique.genreFit}</p>
            <h3 className="text-xl font-semibold mt-4">Overall Impression</h3>
            <p>{selectedCritique.overallImpression}</p>
          </div>
        )}
      </SlideOverPanel>
    </div>
  );
};

export default TrackDisplay;