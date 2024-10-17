import { getServerSession } from "next-auth/next";
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import TrackDisplay from '@/components/TrackDisplay'
import ErrorDisplay from '@/components/ErrorDisplay'
import { getTrackBySlug } from '@/actions/track-actions';
import { getCritiqueById } from '@/actions/critique-actions';
import { catchErrorTyped } from '@/lib/utils';

export default async function SingleCritiquePage({ params }: { params: { slug: string, id: string } }) {
  const session = await getServerSession();
  const [trackError, track] = await catchErrorTyped(getTrackBySlug(params.slug));
  const [critiqueError, critique] = await catchErrorTyped(getCritiqueById(params.id));

  if (trackError || critiqueError) {
    console.error("Failed to fetch data:", trackError || critiqueError);
    return <ErrorDisplay message="Unable to load critique details. Please try again later." />;
  }

  if (!track || !critique) return notFound();

  const isTrackOwner = session?.user?.email === track.user.email;

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading track...</div>}>
        <TrackDisplay
          track={track}
          isListingPage={false}
          isCritiquePage={false}
          showFeedbackRequest={false}
          isTrackOwner={isTrackOwner}
          currentUserEmail={session?.user?.email || null}
        />
      </Suspense>

      <h2 className="text-2xl font-bold mt-8 mb-4">Critique Details</h2>
      <Suspense fallback={<div>Loading critique...</div>}>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <p className="font-semibold">By: {critique.user.name}</p>
            <p className="text-sm text-gray-500">Created on: {new Date(critique.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Overall Impression</h3>
            <p>{critique.overallImpression}</p>
          </div>
          {/* Add more sections for other critique fields */}
        </div>
      </Suspense>
    </div>
  );
}