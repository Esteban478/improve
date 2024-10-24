import { CritiqueWithTrack } from '@/types/index'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { UserInfoDisplay } from './UserInfoDisplay'
import { Button } from './ui/button'
import Link from 'next/link'
import { canEditCritique } from '@/lib/critique-utils'
import RatingPopover from './RatingPopover'

interface CritiqueDetailsProps {
  critique: CritiqueWithTrack
  isTrackOwner: boolean
  currentUserEmail: string | null
}

const CritiqueDetails = ({ 
  critique, 
  isTrackOwner, 
  currentUserEmail 
}: CritiqueDetailsProps) => {
  const objectiveCriteria = [
    { label: 'Mixing Quality', value: critique.mixingQuality },
    { label: 'Tonal Balance', value: critique.tonalBalance },
    { label: 'Mastering Loudness', value: critique.masteringLoudness },
    { label: 'Sound Design', value: critique.soundDesign },
    { label: 'Arrangement', value: critique.arrangement },
  ]

  return (
    <Card className="rounded p-4">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="mb-2">{critique.title || 'Critique'}</CardTitle>
            <UserInfoDisplay 
              user={critique.user}
              timestamp={critique.createdAt}
              size={60}
              showRole={true}
              additionalInfo={
                critique.user.averageRating 
                  ? `Average Rating: ${critique.user.averageRating.toFixed(2)}`
                  : undefined
              }
            />
          </div>
          {isTrackOwner && (
            <RatingPopover 
              critiqueId={critique.id} 
              existingRating={critique.rating} 
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 space-y-8">
        {/* Objective Criteria Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Objective Criteria</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {objectiveCriteria.map((criterion) => (
              criterion.value !== null && (
                <div key={criterion.label}>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {criterion.label}
                  </label>
                  <meter
                    value={criterion.value}
                    min={0}
                    low={4}
                    high={7}
                    optimum={10}
                    max={10}
                    className="w-full h-6"
                  >
                    {criterion.value}/10
                  </meter>
                </div>
              )
            ))}
          </div>
          {critique.technicalSummary && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">Technical Summary</h4>
              <p className="text-foreground">{critique.technicalSummary}</p>
            </div>
          )}
        </div>

        {/* Subjective Criteria Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Subjective Criteria</h3>
          <div className="space-y-6">
            {critique.emotionalResponse && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Emotional Response</h4>
                <p className="text-foreground">{critique.emotionalResponse}</p>
              </div>
            )}
            {critique.imagery && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Imagery</h4>
                <p className="text-foreground">{critique.imagery}</p>
              </div>
            )}
            {critique.standoutElements && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Standout Elements</h4>
                <p className="text-foreground">{critique.standoutElements}</p>
              </div>
            )}
            {critique.genreFit && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Genre Fit</h4>
                <p className="text-foreground">{critique.genreFit}</p>
              </div>
            )}
          </div>
        </div>

        {/* Edit Button */}
        {canEditCritique(currentUserEmail, critique) && (
          <div className="pt-4">
            <Link href={`/critique/${critique.track.slug}/${critique.id}/edit`}>
              <Button variant="outline">Edit Critique</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CritiqueDetails