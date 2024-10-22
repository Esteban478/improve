'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { requestFeedback } from "@/actions/track-actions"
import { catchErrorTyped } from "@/lib/utils"
import ErrorDisplay from "@/components/ErrorDisplay"
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'

interface DashboardTrackItemProps {
  id: string
  title: string
  genre: string | null
  slug: string
  requested: boolean
  userEmail: string
  createdAt: Date
  requestedAt: Date | null
}

const DashboardTrackItem: React.FC<DashboardTrackItemProps> = ({
  id, title, genre, slug, requested, userEmail, createdAt, requestedAt
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isRequested, setIsRequested] = useState(requested);

  const handleRequestFeedback = async () => {
    const [requestError] = await catchErrorTyped(requestFeedback(id, userEmail));
    
    if (requestError) {
      console.error('Error requesting feedback:', requestError);
      setError(requestError.message || 'An error occurred while requesting feedback');
    } else {
      setIsRequested(true);
      setError(null);
    }
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg mb-4">
      <div className="flex-grow">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600 mb-1">{genre || 'No genre specified'}</p>
        <p className="text-xs text-gray-500">Submitted {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</p>
        {isRequested && requestedAt && (
          <p className="text-xs text-green-500">Feedback requested {formatDistanceToNow(new Date(requestedAt), { addSuffix: true })}</p>
        )}
      </div>
      <div className="flex flex-col items-end space-y-2">
        <Link href={`/tracks/${slug}`} className="text-sm text-blue-500 hover:underline">
          View Track
        </Link>
        {!isRequested ? (
          <Button onClick={handleRequestFeedback} variant="outline" size="sm">
            Request Feedback
          </Button>
        ) : (
          <span className="text-sm text-green-500">Feedback Requested</span>
        )}
      </div>
      {error && <ErrorDisplay message={error} />}
    </div>
  )
}

export default DashboardTrackItem