import TrackDisplay from "@/components/TrackDisplay";
import { getLatestTracks } from '@/actions/track-actions';
import ErrorDisplay from '@/components/ErrorDisplay';

export default async function Home() {
  const tracks = await getLatestTracks();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Latest Tracks</h1>
      {tracks.length > 0 ? (
        <div className="space-y-8">
          {tracks.map((track) => (
            <TrackDisplay key={track.id} track={track} isListingPage={true} isCritiquePage={false} />
          ))}
        </div>
      ) : (
        <ErrorDisplay 
          title="No tracks available" 
          message="There are currently no tracks to display. Check back later or be the first to submit a track!" 
        />
      )}
    </main>
  );
}