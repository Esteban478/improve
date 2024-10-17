import { getServerSession } from "next-auth/next";
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import TrackDisplay from '@/components/TrackDisplay'
import ErrorDisplay from '@/components/ErrorDisplay'
import { getTrackBySlug } from '@/actions/track-actions';
import { getCritiqueById } from '@/actions/critique-actions';
import { catchErrorTyped } from '@/lib/utils';
import CritiqueDetails from "@/components/CritiqueDetails";

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
  const isCritiqueAuthor = session?.user?.email === critique.user.email;

  return (
    <>
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
      <Suspense fallback={<div>Loading critique...</div>}>
        <CritiqueDetails 
          critique={{ ...critique, track }} 
          isAuthor={isCritiqueAuthor}
          isTrackOwner={isTrackOwner}
          currentUserEmail={session?.user?.email || null}
        />
      </Suspense>
    </>
  );
}