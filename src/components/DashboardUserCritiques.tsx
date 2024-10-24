import { catchErrorTyped } from "@/lib/utils"
import DashboardCritiqueItem from "./DashboardCritiqueItem"
import ErrorDisplay from "./ErrorDisplay"
import { getUserGivenCritiques, getUserReceivedCritiques } from "../actions/user-actions"
import { Button } from "./ui/button"
import Link from "next/link"

export default async function UserCritiques({ email }: { email: string }) {
  const [givenError, givenCritiques] = await catchErrorTyped(getUserGivenCritiques(email))
  const [receivedError, receivedCritiques] = await catchErrorTyped(getUserReceivedCritiques(email))

  if (givenError || receivedError) {
    return <ErrorDisplay message="Failed to load critiques. Please try again later." />
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-1">Critiques</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Given</h3>
          {givenCritiques && givenCritiques.length > 0 ? (
            givenCritiques.map((critique) => (
              <DashboardCritiqueItem
                key={critique.id}
                id={critique.id}
                title={critique.title || 'Untitled Critique'}
                trackSlug={critique.track.slug}
                createdAt={critique.createdAt}
                rating={critique.rating}
                isTrackOwner={false}
              />
            ))
                  ) : (
                          <>
                        <p className="text-primary mb-2">You haven&apos;t given any critiques yet.</p>
                            <Button variant="secondary" size="sm">
                                <Link href="/">
                                Browse Tracks    
                                </Link>
                            </Button>
                        </>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Received</h3>
          {receivedCritiques && receivedCritiques.length > 0 ? (
            receivedCritiques.map((critique) => (
              <DashboardCritiqueItem
                key={critique.id}
                id={critique.id}
                title={critique.title || 'Untitled Critique'}
                trackSlug={critique.track.slug}
                createdAt={critique.createdAt}
                rating={critique.rating}
                isTrackOwner={true}
              />
            ))
          ) : (
            <p className="text-primary">You haven&apos;t received any critiques yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}