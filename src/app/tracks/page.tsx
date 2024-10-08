import prisma from '@/lib/prisma'
import { Track } from '../../@types'

export default async function TracksPage() {
  const tracks: Track[] = await prisma.track.findMany()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tracks</h1>
      <ul>
        {tracks.map((track: Track) => (
          <li key={track.id} className="mb-2">
            {track.title} - <a href={track.url} className="text-blue-500 hover:underline">Listen</a>
          </li>
        ))}
      </ul>
    </div>
  )
}