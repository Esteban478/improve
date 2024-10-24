import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { UserInfoDisplay } from "./UserInfoDisplay"
import SoundCloudEmbed from "./SoundCloudEmbed"
import { TrackWithCritiques } from '@/types/index'
import { canGiveCritique } from '@/lib/critique-utils'

interface TrackDisplayProps {
  track: TrackWithCritiques
  isListingPage: boolean
  isCritiquePage: boolean
  isTrackOwner: boolean
  currentUserEmail: string | null
}

export default function TrackDisplay({ 
  track,
  isListingPage,
  isCritiquePage,
  isTrackOwner,
  currentUserEmail,
}: TrackDisplayProps) {
  const renderCritiqueButton = () => {
    if (isTrackOwner) return null;

    if (canGiveCritique(currentUserEmail, track.user.id, track.critiques) && 
        !isListingPage && 
        !isCritiquePage) {
      return (
        <Link href={`/critique/${track.slug}`}>
          <Button variant="secondary" size="sm">
            Give Critique
          </Button>
        </Link>
      );
    }

    return null;
  };

  return (
    <Card className="mb-4 p-2 rounded">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-foreground mb-2">{track.title}</CardTitle>
            <UserInfoDisplay 
              user={track.user}
              timestamp={track.createdAt}
              size={54}
              showRole={false}
            />
          </div>
          {track.genre && (
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
              {track.genre}
            </span>
          )}
        </div>
      </CardHeader>

      {track.description && (
        <CardContent className="p-4 pt-2">
          <p>{track.description}</p>
        </CardContent>
      )}

      <CardContent className="p-4 pt-2">
        <SoundCloudEmbed url={track.url} />
      </CardContent>

      <CardFooter className="p-4 pt-2 flex gap-2">
        {isListingPage && (
          <Link href={`/tracks/${track.slug}`}>
            <Button variant="secondary" size="sm">
              View Track
            </Button>
          </Link>
        )}
        {isCritiquePage && (
          <Link href={`/tracks/${track.slug}`}>
            <Button variant="secondary" size="sm">
              Back to Track
            </Button>
          </Link>
        )}
        {renderCritiqueButton()}
      </CardFooter>
    </Card>
  );
}