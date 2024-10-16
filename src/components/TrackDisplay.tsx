"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import SoundCloudEmbed from './SoundCloudEmbed'
import UserAvatar from './UserAvatar'
import { Button } from '@/components/ui/button'
import { requestFeedback } from '@/actions/critique-actions'
import { TrackWithCritiques } from '@/types/index'

interface TrackDisplayProps {
  track: TrackWithCritiques
  isListingPage: boolean
  isCritiquePage: boolean
  showFeedbackRequest: boolean
}

export default function TrackDisplay({ track, isListingPage, isCritiquePage, showFeedbackRequest }: TrackDisplayProps) {
  const { data: session } = useSession()
  const [isRequesting, setIsRequesting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRequestFeedback = async () => {
    if (!session?.user?.email) return
    setIsRequesting(true)
    setError(null)
    try {
      await requestFeedback(track.id, session.user.email)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsRequesting(false)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <div className="flex items-center mb-4">
        <UserAvatar src={track.user.image} alt={track.user.name || 'User'} size={40} />
        <h2 className="text-xl font-semibold ml-2">{track.title}</h2>
      </div>
      <p className="text-gray-600 mb-2">By {track.user.name || "Unknown Artist"}</p>
      {track.genre && <p className="text-sm text-gray-500 mb-4">Genre: {track.genre}</p>}
      <SoundCloudEmbed url={track.url} />
      {track.description && <p className="text-gray-700 my-4">{track.description}</p>}
      <div className="mt-4 space-x-2">
        {isListingPage && (
          <Link href={`/tracks/${track.slug}`} className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            View Track
          </Link>
        )}
        {!isCritiquePage && session?.user?.email !== track.user.email && (
          <Link href={`/critique/${track.slug}`} className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Give Critique
          </Link>
        )}
        {showFeedbackRequest && session?.user?.email === track.user.email && !track.requested && (
          <Button 
            onClick={handleRequestFeedback} 
            disabled={isRequesting}
            className="bg-purple-500 hover:bg-purple-600"
          >
            {isRequesting ? 'Requesting...' : 'Request Feedback'}
          </Button>
        )}
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}