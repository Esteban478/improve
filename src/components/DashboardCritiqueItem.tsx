import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import RatingPopover from './RatingPopover'

interface DashboardCritiqueItemProps {
  id: string
  title: string
  trackSlug: string
  createdAt: Date
  rating: number | null
  isTrackOwner: boolean
}

const DashboardCritiqueItem: React.FC<DashboardCritiqueItemProps> = ({ 
  id, 
  title, 
  trackSlug, 
  createdAt, 
  rating,
  isTrackOwner
}) => {
  return (
    <div className="flex justify-between p-4 border rounded bg-card mb-4">
      <div className="flex flex-col justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</p>
      </div>
      <div className="flex flex-col self-start items-end space-y-2">
        <Link href={`/critique/${trackSlug}/${id}`} className="text-sm text-accent-foreground hover:underline">
          View Critique
        </Link>
              {rating !== null &&(
                  <span className="text-xs font-medium">Rating: {rating}/5</span>
            )}
      </div>
    </div>
  )
}

export default DashboardCritiqueItem