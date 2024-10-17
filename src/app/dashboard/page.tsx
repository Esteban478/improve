import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { Suspense } from 'react'
import UserAvatar from "@/components/UserAvatar"
import ErrorDisplay from "@/components/ErrorDisplay"
import { getUserProfile, getUserTracks, getUserGivenCritiques, getUserReceivedCritiques } from "@/actions/user-actions"
import { catchErrorTyped } from "@/lib/utils"
import DashboardTrackItem from "@/components/DashboardTrackItem"
import DashboardCritiqueItem from "@/components/DashboardCritiqueItem"

async function UserProfile({ email }: { email: string }) {
  const [error, user] = await catchErrorTyped(getUserProfile(email))
  if (error || !user) return <ErrorDisplay message="Unable to load user profile." />

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <div className="flex items-center mb-4">
        <UserAvatar src={user.image} alt={user.name || 'User'} size={64} />
        <div className="ml-4">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-yellow-600">{user.coins} coins</p>
        </div>
      </div>
    </div>
  )
}

async function UserTracks({ email }: { email: string }) {
  const [error, tracks] = await catchErrorTyped(getUserTracks(email))

  if (error) {
    return <ErrorDisplay message="Failed to load tracks. Please try again later." />
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Your Tracks</h2>
      {tracks && tracks.length > 0 ? (
        <div>
          {tracks.map((track) => (
            <DashboardTrackItem
              key={track.id}
              id={track.id}
              title={track.title}
              genre={track.genre}
              slug={track.slug}
              requested={track.requested}
              userEmail={email}
              createdAt={track.createdAt}
              requestedAt={track.requestedAt}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">You haven&apos;t submitted any tracks yet.</p>
      )}
    </div>
  )
}

async function UserCritiques({ email }: { email: string }) {
  const [givenError, givenCritiques] = await catchErrorTyped(getUserGivenCritiques(email))
  const [receivedError, receivedCritiques] = await catchErrorTyped(getUserReceivedCritiques(email))

  if (givenError || receivedError) {
    return <ErrorDisplay message="Failed to load critiques. Please try again later." />
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Your Critiques</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Given Critiques</h3>
          {givenCritiques && givenCritiques.length > 0 ? (
            givenCritiques.map((critique) => (
              <DashboardCritiqueItem
                key={critique.id}
                id={critique.id}
                title={critique.title || 'Untitled Critique'}
                trackTitle={critique.track.title}
                trackSlug={critique.track.slug}
                createdAt={critique.createdAt}
                rating={critique.rating}
              />
            ))
          ) : (
            <p className="text-gray-600">You haven&apos;t given any critiques yet.</p>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Received Critiques</h3>
          {receivedCritiques && receivedCritiques.length > 0 ? (
            receivedCritiques.map((critique) => (
              <DashboardCritiqueItem
                key={critique.id}
                id={critique.id}
                title={critique.title || 'Untitled Critique'}
                trackTitle={critique.track.title}
                trackSlug={critique.track.slug}
                createdAt={critique.createdAt}
                rating={critique.rating}
              />
            ))
          ) : (
            <p className="text-gray-600">You haven&apos;t received any critiques yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default async function Dashboard() {
  const session = await getServerSession()
  if (!session || !session.user?.email) {
    redirect("/auth/sign-in?callbackUrl=/dashboard")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading profile...</div>}>
        <UserProfile email={session.user.email} />
      </Suspense>

      <Suspense fallback={<div>Loading tracks...</div>}>
        <UserTracks email={session.user.email} />
      </Suspense>

      <Suspense fallback={<div>Loading critiques...</div>}>
        <UserCritiques email={session.user.email} />
      </Suspense>
    </div>
  )
}