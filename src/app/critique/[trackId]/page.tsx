import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import TrackDisplay from "@/components/TrackDisplay"
import CritiqueForm from "@/components/CritiqueForm"
import ErrorDisplay from "@/components/ErrorDisplay"
import { getTrackForCritique } from "@/actions/track-actions"

export default async function CritiquePage({ params }: { params: { trackId: string } }) {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/sign-in?callbackUrl=/critique/" + params.trackId)
  }

  const track = await getTrackForCritique(params.trackId);

  if (!track) {
    return <ErrorDisplay message="Track not found or unable to load track details. Please try again later." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Critique for: {track.title}</h1>
      <TrackDisplay track={track} isListingPage={false} isCritiquePage={true} />
      <CritiqueForm trackId={track.id} />
    </div>
  )
}