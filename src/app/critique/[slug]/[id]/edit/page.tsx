import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import TrackDisplay from "@/components/TrackDisplay";
import CritiqueForm from "@/components/CritiqueForm";
import ErrorDisplay from "@/components/ErrorDisplay";
import { getTrackBySlug } from "@/actions/track-actions";
import { getUserCritiqueForTrack } from "@/actions/critique-actions";
import { canEditCritique } from "@/lib/critique-utils";

export default async function EditCritiquePage({ params }: { params: { slug: string } }) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/auth/sign-in?callbackUrl=/critique/" + params.slug + "/edit");
  }

  const track = await getTrackBySlug(params.slug);
  if (!track) {
    return <ErrorDisplay message="Track not found or unable to load track details. Please try again later." />;
  }

  const userCritique = await getUserCritiqueForTrack(session.user.email, track.id);
  if (!userCritique || !canEditCritique(session.user.email, userCritique)) {
    redirect(`/critique/${params.slug}`);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Critique for: {track.title}</h1>
      <TrackDisplay 
        track={track} 
        isListingPage={false} 
        isCritiquePage={true} 
        showFeedbackRequest={false} 
        isTrackOwner={track.user.email === session.user.email}
        currentUserEmail={session.user.email}
      />
      <CritiqueForm trackId={track.id} trackSlug={track.slug} existingCritique={userCritique} />
    </div>
  );
}