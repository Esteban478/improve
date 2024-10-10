import { getServerSession } from "next-auth/next"
import prisma from '@/lib/prisma'
import Link from 'next/link'
import UserAvatar from "@/src/components/UserAvatar"

async function getUserData(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      tracks: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      critiques: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { track: true },
      },
    },
  })
}

export default async function Dashboard() {
  const session = await getServerSession()
  if (!session || !session.user?.email) {
    return <div>Access Denied</div>
  }

  const user = await getUserData(session.user.email)
  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex items-center mb-4">
        <UserAvatar src={session.user?.image} alt={session.user?.name || 'User'} size={32} />
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

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Your Tracks</h2>
          {user.tracks.length > 0 ? (
            <ul className="space-y-4">
              {user.tracks.map((track) => (
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
          <Link href="/submit-track" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Submit a Track
          </Link>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Your Critiques</h2>
          {user.critiques.length > 0 ? (
            <ul className="space-y-4">
              {user.critiques.map((critique) => (
                <li key={critique.id} className="bg-white shadow-md rounded-lg p-4">
                  <h3 className="font-semibold">{critique.track.title}</h3>
                  <p className="text-gray-600">{critique.content.substring(0, 100)}...</p>
                  <Link href={`/tracks/${critique.track.id}`} className="text-blue-500 hover:underline">
                    View Track
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">You haven&apos;t written any critiques yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}