import { Suspense } from 'react';
import TrackDisplay from '@/components/TrackDisplay';
import LoadMore from '@/components/LoadMore';
import { getTracks } from '@/actions/track-actions';
import { catchErrorTyped } from '@/lib/utils';
import ErrorDisplay from '@/components/ErrorDisplay';

export default async function TracksPage({ searchParams }: { searchParams: { search?: string, genre?: string, page?: string, take?: string } }) {
  const [error, tracks] = await catchErrorTyped(getTracks(searchParams));
  
  if (error) {
    console.error("Failed to fetch tracks:", error);
    return <ErrorDisplay message="Unable to load tracks. Please try again later." />;
  }

  const currentPage = parseInt(searchParams.page || '1');
  const currentTake = parseInt(searchParams.take || '10');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tracks</h1>
      <Suspense fallback={<div>Loading tracks...</div>}>
        {tracks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track) => (
              <TrackDisplay key={track.id} track={track} isListingPage={true} isCritiquePage={false} />
            ))}
          </div>
        ) : (
          <ErrorDisplay 
            title="No tracks found" 
            message="There are no tracks matching your search criteria." 
          />
        )}
      </Suspense>
      {tracks.length > 0 && (
        <LoadMore 
          currentPage={currentPage} 
          currentTake={currentTake} 
          totalTracks={tracks.length} 
        />
      )}
    </div>
  );
}