import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import TrackDisplay from '@/src/components/TrackDisplay'

async function getTrack(id: string) {
  const track = await prisma.track.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, image: true, email: true },
      },
      critiques: {
        include: {
          user: {
            select: { name: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!track) notFound()
  return track
}

export default async function TrackPage({ params }: { params: { id: string } }) {
  const track = await getTrack(params.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <TrackDisplay track={track} />
      <h2 className="text-2xl font-bold mt-8 mb-4">Critiques</h2>
      {track.critiques.length > 0 ? (
        <div className="space-y-4">
          {track.critiques.map((critique) => (
            <div key={critique.id} className="border p-4 rounded">
              <p className="mb-2">{critique.content}</p>
              <p className="text-gray-600 text-sm">By {critique.user.name} on {new Date(critique.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No critiques yet. Be the first to critique this track!</p>
      )}
    </div>
  )
}