import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { Card, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DashboardCritiqueItemProps {
  id: string
  title: string
  trackSlug: string
  createdAt: Date
  rating: number | null
  isTrackOwner: boolean
}

const DashboardCritiqueItem = ({ 
  id, 
  title, 
  trackSlug, 
  createdAt, 
  rating
}: DashboardCritiqueItemProps) => {
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
          {rating !== null && (
            <span className="text-xs text-primary px-2 py-1 bg-primary/10 rounded">
              Rating: {rating}/5
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardFooter className="flex p-4 pt-2 gap-2">
        <Link href={`/critique/${trackSlug}/${id}`}>
          <Button variant="secondary" size="sm">
            View Critique
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default DashboardCritiqueItem