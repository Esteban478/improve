import { getServerSession } from "next-auth/next";
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import TrackDisplay from '@/components/TrackDisplay';
import CritiqueList from '@/components/CritiqueList';
import ErrorDisplay from '@/components/ErrorDisplay';
import { getTrackBySlug } from '@/actions/track-actions';
import { catchErrorTyped } from '@/lib/utils';

export default async function TrackPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession();
  const [error, track] = await catchErrorTyped(getTrackBySlug(params.slug));

  if (error) {
    console.error("Failed to fetch track:", error);
    return <ErrorDisplay message="Unable to load track details. Please try again later." />;
  }

  if (!track) return notFound();

  const isTrackOwner = session?.user?.email === track.user.email;

  return (
    <div className="container mx-auto px-4 py-2">
      <Suspense fallback={<div>Loading track...</div>}>
        <TrackDisplay
          track={track}
          isListingPage={false}
          isCritiquePage={false}
          isTrackOwner={isTrackOwner}
          currentUserEmail={session?.user?.email || null}
        />
      </Suspense>

      <h2 className="text-2xl font-bold mt-8 mb-4">Critiques</h2>
      <Suspense fallback={<div>Loading critiques...</div>}>
        {track.critiques.length > 0 ? (
          <CritiqueList
            critiques={track.critiques}
            isTrackOwner={isTrackOwner}
            currentUserEmail={session?.user?.email || null}
            trackSlug={params.slug}
          />
        ) : (
            <div className="border bg-card p-4 rounded mb-4">
              <h3 className="text-lg font-semibold">No critiques yet</h3>
              <p>Be the first to critique this track!</p>
            </div>
        )}
      </Suspense>
    </div>
  );
}