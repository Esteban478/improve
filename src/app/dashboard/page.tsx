import { getServerSession } from "next-auth/next"
import Link from 'next/link'
import { redirect } from "next/navigation"
import { Suspense } from 'react'
import UserAvatar from "@/components/UserAvatar"
import ErrorDisplay from "@/components/ErrorDisplay"
import { getUserProfile, getUserTracks, getUserGivenCritiques, getUserReceivedCritiques } from "@/actions/user-actions"
import { catchErrorTyped } from "@/lib/utils"
import CritiquesSection from "@/components/CritiquesSection"

async function UserProfile({ email }: { email: string }) {
  const [error, user] = await catchErrorTyped(getUserProfile(email))
  if (error || !user) return <ErrorDisplay message="Unable to load user profile." />

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <div className="flex items-center mb-4">
        <UserAvatar src={user.image} alt={user.name || 'User'} size={32} />
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-yellow-600">{user.coins} coins</p>
        </div>
      </div>
      <Link href="/profile" className="text-blue-500 hover:underline">
        Edit Profile
      </Link>
    </div>
  )
}

async function UserTracks({ email }: { email: string }) {
  const tracks = await getUserTracks(email)

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Your Tracks</h2>
      {tracks.length > 0 ? (
        <ul className="space-y-4">
          {tracks.map((track) => (
            <li key={track.id} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="font-semibold">{track.title}</h3>
              <p className="text-gray-600">{track.genre || 'No genre specified'}</p>
              <Link href={`/tracks/${track.id}`} className="text-blue-500 hover:underline">
                View Track
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">You haven&apos;t submitted any tracks yet.</p>
      )}
    </div>
  )
}

async function UserCritiques({ email }: { email: string }) {
  const [givenError, givenCritiques] = await catchErrorTyped(getUserGivenCritiques(email))
  const [receivedError, receivedCritiques] = await catchErrorTyped(getUserReceivedCritiques(email))
  const safeGivenCritiques = givenCritiques || []
  const safeReceivedCritiques = receivedCritiques || []

  if (givenError || receivedError) {
    return <ErrorDisplay message="Unable to load user critiques." />
  }

  return <CritiquesSection givenCritiques={safeGivenCritiques} receivedCritiques={safeReceivedCritiques} />
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