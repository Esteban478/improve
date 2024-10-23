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
    <div className="flex justify-between bg-card p-4 border rounded mb-4">
      <div className="flex flex-col justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</p>
      </div>
      <div className="flex flex-col self-start items-end space-y-2">
        <Link href={`/tracks/${slug}`} className="text-sm text-accent-foreground hover:underline">
          View Track
        </Link>
        {!isRequested ? (
          <Button onClick={handleRequestFeedback} variant="outline" size="sm">
            Request Feedback
          </Button>
        ) : isRequested && requestedAt && (
          <p className="text-xs text-green-500">Feedback requested {formatDistanceToNow(new Date(requestedAt), { addSuffix: true })}</p>
        )}
      </div>
      {error && <ErrorDisplay message={error} />}
    </div>
  )
}

export default DashboardTrackItem