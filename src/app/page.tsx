import { getServerSession } from "next-auth/next";
import { getTracksNeedingFeedback } from '@/actions/critique-actions'
import TrackDisplay from "@/components/TrackDisplay"
import ErrorDisplay from '@/components/ErrorDisplay'
import IntroductionDisplay from "@/components/IntroductionDisplay"

export default async function Home() {
  const session = await getServerSession();
  const tracks = await getTracksNeedingFeedback(5)  // Get 5 tracks needing feedback

  return (
    <main className="container mx-auto px-4 py-2">
      <IntroductionDisplay />
      <h2 className="text-2xl font-bold mb-2">Tracks Needing Feedback</h2>
      {tracks.length > 0 ? (
        <div className="space-y-8">
          {tracks.map((track) => (
            <TrackDisplay 
              key={track.id} 
              track={track} 
              isListingPage={true} 
              isCritiquePage={false} 
              isTrackOwner={track.user.email === session?.user?.email}
              currentUserEmail={session?.user?.email || null}
            />
          ))}
        </div>
      ) : (
        <ErrorDisplay 
          title="No tracks available" 
          message="There are currently no tracks requesting feedback. Be the first to submit a track and request feedback!" 
        />
      )}
    </main>
  )
}