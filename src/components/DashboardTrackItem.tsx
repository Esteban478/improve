"use client"
import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { requestFeedback } from "@/actions/track-actions"
import { catchErrorTyped } from "@/lib/utils"
import ErrorDisplay from "@/components/ErrorDisplay"
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

interface DashboardTrackItemProps {
  id: string
  title: string
  slug: string
  requested: boolean
  userEmail: string
  createdAt: Date
  requestedAt: Date | null
}

const DashboardTrackItem = ({
  id, title, slug, requested, userEmail, createdAt, requestedAt
}: DashboardTrackItemProps) => {
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
    <Card className="mb-4 rounded">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="text-xs">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </CardDescription>
          </div>
          {isRequested && requestedAt && (
            <span className="text-xs text-primary px-2 py-1 bg-primary/10 rounded">
              Feedback requested {formatDistanceToNow(new Date(requestedAt), { addSuffix: true })}
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardFooter className="flex p-4 pt-2 gap-2">
        <Link href={`/tracks/${slug}`}>
          <Button variant="secondary" size="sm">
            View Track
          </Button>
        </Link>
        {!isRequested && (
          <Button onClick={handleRequestFeedback} variant="outline" size="sm">
            Request Feedback
          </Button>
        )}
        {error && <ErrorDisplay message={error} />}
      </CardFooter>
    </Card>
  )
}

export default DashboardTrackItem