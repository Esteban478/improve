import { getServerSession } from "next-auth/next";
import { Suspense } from 'react'
import TrackDisplay from '@/components/TrackDisplay'
import LoadMore from '@/components/LoadMore'
import { getTracks } from '@/actions/track-actions'
import { getTracksNeedingFeedback } from '@/actions/critique-actions'
import { catchErrorTyped } from '@/lib/utils'
import ErrorDisplay from '@/components/ErrorDisplay'

export default async function TracksPage({ searchParams }: { searchParams: { search?: string, genre?: string, page?: string, take?: string } }) {
  const session = await getServerSession();
  const [tracksError, tracks] = await catchErrorTyped(getTracks(searchParams))
  const [feedbackTracksError, feedbackTracks] = await catchErrorTyped(getTracksNeedingFeedback(5))
  
  if (tracksError || feedbackTracksError) {
    console.error("Failed to fetch tracks:", tracksError || feedbackTracksError)
    return <ErrorDisplay message="Unable to load tracks. Please try again later." />
  }

  const currentPage = parseInt(searchParams.page || '1')
  const currentTake = parseInt(searchParams.take || '10')

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tracks</h1>
      
      <h2 className="text-2xl font-semibold mb-4">Feedback Requested</h2>
      <Suspense fallback={<div>Loading feedback requested tracks...</div>}>
        {feedbackTracks && feedbackTracks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {feedbackTracks.map((track) => (
              <TrackDisplay 
                key={track.id} 
                track={track}
                isListingPage={true} 
                isCritiquePage={false}
                showFeedbackRequest={false}
                isTrackOwner={track.user.email === session?.user?.email}
                currentUserEmail={session?.user?.email || null}
              />
            ))}
          </div>
        ) : (
          <ErrorDisplay 
            title="No tracks requesting feedback" 
            message="There are currently no tracks requesting feedback." 
          />
        )}
      </Suspense>

      <h2 className="text-2xl font-semibold mb-4">All Tracks</h2>
      <Suspense fallback={<div>Loading tracks...</div>}>
        {tracks && tracks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track) => (
              <TrackDisplay 
                key={track.id} 
                track={track} 
                isListingPage={true} 
                isCritiquePage={false}
                showFeedbackRequest={true}
                isTrackOwner={track.user.email === session?.user?.email}
                currentUserEmail={session?.user?.email || null}
              />
            ))}
          </div>
        ) : (
          <ErrorDisplay 
            title="No tracks found" 
            message="There are no tracks matching your search criteria." 
          />
        )}
      </Suspense>
      {tracks && tracks.length > 0 && (
        <LoadMore 
          currentPage={currentPage} 
          currentTake={currentTake} 
          totalTracks={tracks.length} 
        />
      )}
    </div>
  )
}