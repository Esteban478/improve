import { CritiqueWithTrack } from '@/types/index';
import UserAvatar from './UserAvatar';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import Link from 'next/link';
import { Button } from './ui/button';
import { canEditCritique } from '@/lib/critique-utils';
import RatingPopover from './RatingPopover';

interface CritiqueDetailsProps {
    critique: CritiqueWithTrack;
    isAuthor: boolean;
    isTrackOwner: boolean;
    currentUserEmail: string | null;    
}

const CritiqueDetails: React.FC<CritiqueDetailsProps> = ({ critique, isTrackOwner, currentUserEmail }) => {
  const objectiveCriteria = [
    { label: 'Mixing Quality', value: critique.mixingQuality },
    { label: 'Tonal Balance', value: critique.tonalBalance },
    { label: 'Mastering Loudness', value: critique.masteringLoudness },
    { label: 'Sound Design', value: critique.soundDesign },
    { label: 'Arrangement', value: critique.arrangement },
  ];

  return (
    <div className="mx-auto p-6 bg-card shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{critique.title || 'Critique'}</h1>
        {isTrackOwner && (
          <RatingPopover critiqueId={critique.id} existingRating={critique.rating} />
        )}
        </div>
      <div className="flex items-center mb-4">
        <UserAvatar src={critique.user.image} alt={critique.user.name || ''} size={60} />
        <div className="ml-4">
          <p className="text-lg font-bold">
            {critique.user.name} 
            <span className="text-sm text-muted-foreground ml-2">({critique.user.role || 'User'})</span>
          </p>                  
            <p className="text-sm text-primary mb-1">
                &Oslash; Rating: {critique.user.averageRating?.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(critique.createdAt), { addSuffix: true })}
            </p>
          </div>
          </div>
          
      <div className="mt-6 flex justify-end space-x-4">
        {canEditCritique(currentUserEmail, critique) && (
          <Link href={`/critique/${critique.track.slug}/${critique.id}/edit`} passHref>
            <Button variant="outline">Edit Critique</Button>
          </Link>
        )}
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Overall Impression</h3>
        <p className="text-foreground">{critique.overallImpression}</p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Objective Criteria</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {objectiveCriteria.map((criterion) => (
            criterion.value !== null && (
              <div key={criterion.label}>
                <label htmlFor={criterion.label} className="block text-sm font-medium text-foreground mb-1">
                  {criterion.label}
                </label>
                <meter
                    id={criterion.label}
                    value={criterion.value}
                    min={0}
                    low={4}
                    high={7}
                    optimum={10}
                    max={10}
                    className="w-full h-6">   
                  {criterion.value}/10
                </meter>
              </div>
            )
          ))}
        </div>
        {critique.technicalSummary && (
          <div>
            <h4 className="text-lg font-semibold mb-2">Technical Summary</h4>
            <p className="text-foreground">{critique.technicalSummary}</p>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Subjective Criteria</h3>
        {critique.emotionalResponse && (
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Emotional Response</h4>
            <p className="text-foreground">{critique.emotionalResponse}</p>
          </div>
        )}
        {critique.imagery && (
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Imagery</h4>
            <p className="text-foreground">{critique.imagery}</p>
          </div>
        )}
        {critique.standoutElements && (
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Standout Elements</h4>
            <p className="text-foreground">{critique.standoutElements}</p>
          </div>
        )}
        {critique.genreFit && (
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Genre Fit</h4>
            <p className="text-foreground">{critique.genreFit}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CritiqueDetails;