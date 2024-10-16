import Link from 'next/link'
import { CritiqueWithTrack } from '@/types/index'

interface CritiquesSectionProps {
  givenCritiques: CritiqueWithTrack[]
  receivedCritiques: CritiqueWithTrack[]
}

function CritiqueList({ critiques, type }: { critiques: CritiqueWithTrack[], type: 'Given' | 'Received' }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{type}
      </h3>
      {critiques.length > 0 ? (
        <ul className="space-y-4">
          {critiques.map((critique) => (
            <li key={critique.id} className="bg-white shadow-md rounded-lg p-4">
              <h4 className="font-semibold">{critique.track.title}</h4>
              <p className="text-gray-600">
                {critique.overallImpression
                  ? critique.overallImpression.substring(0, 100) + '...'
                  : 'No overall impression provided.'}
              </p>
              <Link href={`/tracks/${critique.track.id}`} className="text-blue-500 hover:underline">
                View Track
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No {type.toLowerCase()} critiques yet.</p>
      )}
    </div>
  )
}

export default function CritiquesSection({ givenCritiques, receivedCritiques }: CritiquesSectionProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Critiques</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <CritiqueList critiques={givenCritiques} type="Given" />
        <CritiqueList critiques={receivedCritiques} type="Received" />
      </div>
    </div>
  )
}