import { notFound } from 'next/navigation'
import TrackDisplay from '@/src/components/TrackDisplay'
import { TrackWithCritiques, ExtendedCritique } from '@/src/@types'

async function getTrack(id: string): Promise<TrackWithCritiques> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tracks/${id}`, { next: { revalidate: 60 } })
  if (!response.ok) {
    notFound()
  }
  return response.json()
}

export default async function TrackPage({ params }: { params: { id: string } }) {
  const track = await getTrack(params.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <TrackDisplay track={track} />
      <h2 className="text-2xl font-bold mt-8 mb-4">Critiques</h2>
      {track.critiques.length > 0 ? (
        <div className="space-y-4">
          {track.critiques.map((critique: ExtendedCritique) => (
            <div key={critique.id} className="border p-4 rounded">
              <p className="mb-2">{critique.overallImpression}</p>
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