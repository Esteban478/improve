import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import RatingPopover from './RatingPopover'

interface DashboardCritiqueItemProps {
  id: string
  title: string
  trackTitle: string
  trackSlug: string
  createdAt: Date
  rating: number | null
  isTrackOwner: boolean
}

const DashboardCritiqueItem: React.FC<DashboardCritiqueItemProps> = ({ 
  id, 
  title, 
  trackTitle, 
  trackSlug, 
  createdAt, 
  rating,
  isTrackOwner
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg mb-4">
      <div className="flex-grow">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600 mb-1">On track: {trackTitle}</p>
        <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</p>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <Link href={`/critique/${trackSlug}/${id}`} className="text-sm text-blue-500 hover:underline">
          View Critique
        </Link>
        {rating !== null ? (
          <span className="text-sm font-medium">Rating: {rating}/5</span>
        ) : isTrackOwner ? (
          <RatingPopover critiqueId={id} existingRating={null} />
        ) : null}
      </div>
    </div>
  )
}

export default DashboardCritiqueItem