import { getTracksNeedingFeedback } from '@/actions/critique-actions'
import TrackDisplay from "@/components/TrackDisplay"
import ErrorDisplay from '@/components/ErrorDisplay'

export default async function Home() {
  const tracks = await getTracksNeedingFeedback(5)  // Get 5 tracks needing feedback

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tracks Needing Feedback</h1>
      {tracks.length > 0 ? (
        <div className="space-y-8">
          {tracks.map((track) => (
            <TrackDisplay 
              key={track.id} 
              track={track} 
              isListingPage={true} 
              isCritiquePage={false} 
              showFeedbackRequest={false}
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