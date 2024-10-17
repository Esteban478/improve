import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'

interface DashboardCritiqueItemProps {
  id: string
  title: string
  trackTitle: string
  trackSlug: string
  createdAt: Date
  rating: number | null
}

const DashboardCritiqueItem: React.FC<DashboardCritiqueItemProps> = ({ 
  id, 
  title, 
  trackTitle, 
  trackSlug, 
  createdAt, 
  rating 
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg mb-4">
      <div className="flex-grow">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-600">For track: {trackTitle}</p>
        <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</p>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <Link href={`/critique/${trackSlug}/${id}`} className="text-sm text-blue-500 hover:underline">
          View Critique
        </Link>
        {rating !== null && (
          <span className="text-sm text-yellow-500">Rating: {rating}/5</span>
        )}
      </div>
    </div>
  )
}

export default DashboardCritiqueItem