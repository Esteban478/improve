import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import TrackDisplay from "@/components/TrackDisplay";
import CritiqueForm from "@/components/CritiqueForm";
import ErrorDisplay from "@/components/ErrorDisplay";
import { getTrackBySlug } from "@/actions/track-actions";
import { getUserCritiqueForTrack } from "@/actions/critique-actions";
import { canEditCritique } from "@/lib/critique-utils";

export default async function CritiquePage({ params }: { params: { slug: string } }) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/auth/sign-in?callbackUrl=/critique/" + params.slug);
  }

  const track = await getTrackBySlug(params.slug);
  if (!track) {
    return <ErrorDisplay message="Track not found or unable to load track details. Please try again later." />;
  }

  const userCritique = await getUserCritiqueForTrack(session.user.email, track.id);
  const canEdit = canEditCritique(session.user.email, userCritique);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Critique for: {track.title}</h1>
      <TrackDisplay 
        track={track} 
        isListingPage={false} 
        isCritiquePage={true} 
        showFeedbackRequest={false} 
        isTrackOwner={track.user.email === session.user.email}
        currentUserEmail={session.user.email}
      />
      
      {!userCritique && <CritiqueForm trackId={track.id} />}
      {userCritique && canEdit && <CritiqueForm trackId={track.id} existingCritique={userCritique} />}
      {userCritique && !canEdit && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Your Critique</h2>
          <p><strong>Overall Impression:</strong> {userCritique.overallImpression}</p>
          <p><strong>Emotional Response:</strong> {userCritique.emotionalResponse}</p>
          <p><strong>Imagery:</strong> {userCritique.imagery}</p>
          <p><strong>Standout Elements:</strong> {userCritique.standoutElements}</p>
          <p><strong>Genre Fit:</strong> {userCritique.genreFit}</p>
          {userCritique.technicalSummary && <p><strong>Technical Summary:</strong> {userCritique.technicalSummary}</p>}
        </div>
      )}
    </div>
  );
}