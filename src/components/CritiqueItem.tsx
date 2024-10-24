import { PenIcon, EyeIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { UserInfoDisplay } from "./UserInfoDisplay"
import { ExtendedCritique } from '@/types/index'
import Link from 'next/link'
import { canEditCritique } from '@/lib/critique-utils'
import RatingPopover from './RatingPopover'

interface CritiqueItemProps {
  critique: ExtendedCritique
  isTrackOwner: boolean
  currentUserEmail: string | null
  trackSlug: string
}

const CritiqueItem = ({ 
  critique, 
  isTrackOwner, 
  currentUserEmail,
  trackSlug
}: CritiqueItemProps) => {
  const canEdit = canEditCritique(currentUserEmail, critique)
  
  const truncate = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substr(0, maxLength - 3) + '...'
  }

  return (
    <Card className="mb-4 rounded">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-foreground mb-2">
              {critique.title || 'Untitled Critique'}
            </CardTitle>
            <UserInfoDisplay 
              user={critique.user}
              timestamp={critique.createdAt}
              size={40}
              showRole={true}
            />
          </div>
          {critique.rating !== null && (
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
              Rating: {critique.rating}/5
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <p>{truncate(critique.overallImpression, 200)}</p>
      </CardContent>

      <CardFooter className="p-4 pt-2 flex items-center gap-2">
        {isTrackOwner && (
          <RatingPopover 
            critiqueId={critique.id} 
            existingRating={critique.rating} 
          />
        )}
        
        {canEdit && (
          <Link href={`/critique/${trackSlug}/${critique.id}/edit`}>
            <Button variant="outline" size="sm">
              <PenIcon className="mr-2" size={16} />
              Edit
            </Button>
          </Link>
        )}
        
        <Link href={`/critique/${trackSlug}/${critique.id}`}>
          <Button variant="secondary" size="sm">
            <EyeIcon className="mr-2" size={16} />
            View Full Critique
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default CritiqueItem