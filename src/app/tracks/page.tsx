import { Suspense } from 'react';
import TrackDisplay from '@/components/TrackDisplay';
import LoadMore from '@/components/LoadMore';
import { getTracks } from '@/actions/track-actions';

export default async function TracksPage({ searchParams }: { searchParams: { search?: string, genre?: string, page?: string, take?: string } }) {
  const tracks = await getTracks(searchParams);
  const currentPage = parseInt(searchParams.page || '1');
  const currentTake = parseInt(searchParams.take || '10');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tracks</h1>
      <Suspense fallback={<div>Loading tracks...</div>}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <TrackDisplay key={track.id} track={track} isListingPage={true} isCritiquePage={false} />
          ))}
        </div>
      </Suspense>
      <LoadMore 
        currentPage={currentPage} 
        currentTake={currentTake} 
        totalTracks={tracks.length} 
      />
    </div>
  );
}