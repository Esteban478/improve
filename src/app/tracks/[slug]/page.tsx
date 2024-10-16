import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import TrackDisplay from '@/components/TrackDisplay';
import ErrorDisplay from '@/components/ErrorDisplay';
import { getTrackBySlug } from '@/actions/track-actions';
import { catchErrorTyped } from '@/lib/utils';

export default async function TrackPage({ params }: { params: { slug: string } }) {
  const [error, track] = await catchErrorTyped(getTrackBySlug(params.slug));

  if (error) {
    console.error("Failed to fetch track:", error);
    return <ErrorDisplay message="Unable to load track details. Please try again later." />;
  }

  if (!track) return notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading track...</div>}>
        <TrackDisplay track={track} isListingPage={false} isCritiquePage={false} showFeedbackRequest={false}/>
      </Suspense>
      <h2 className="text-2xl font-bold mt-8 mb-4">Critiques</h2>
      <Suspense fallback={<div>Loading critiques...</div>}>
        {track.critiques.length > 0 ? (
          <div className="space-y-4">
            {track.critiques.map((critique) => (
              <div key={critique.id} className="border p-4 rounded">
                <p className="mb-2">{critique.overallImpression}</p>
                <p className="text-gray-600 text-sm">By {critique.user.name} on {new Date(critique.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <ErrorDisplay 
            title="No critiques yet" 
            message="Be the first to critique this track!" 
          />
        )}
      </Suspense>
    </div>
  );
}