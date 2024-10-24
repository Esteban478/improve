import { catchErrorTyped } from "@/lib/utils"
import DashboardTrackItem from "./DashboardTrackItem"
import ErrorDisplay from "./ErrorDisplay"
import { getUserTracks } from "../actions/user-actions"

export default async function UserTracks({ email }: { email: string }) {
  const [error, tracks] = await catchErrorTyped(getUserTracks(email))

  if (error) {
    return <ErrorDisplay message="Failed to load tracks. Please try again later." />
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-2">Tracks</h2>
      {tracks && tracks.length > 0 ? (
        <div>
          {tracks.map((track) => (
            <DashboardTrackItem
              key={track.id}
              id={track.id}
              title={track.title}
              slug={track.slug}
              requested={track.requested}
              userEmail={email}
              createdAt={track.createdAt}
              requestedAt={track.requestedAt}
            />
          ))}
        </div>
      ) : (
        <p className="text-primary">You haven&apos;t submitted any tracks yet.</p>
      )}
    </div>
  )
}