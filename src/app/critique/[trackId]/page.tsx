import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import TrackDisplay from "@/src/components/TrackDisplay"
import CritiqueForm from "@/src/components/CritiqueForm"
import { TrackWithCritiques } from "@/src/@types"

export default async function CritiquePage({ params }: { params: { trackId: string } }) {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/sign-in?callbackUrl=/critique/" + params.trackId)
  }

  // Fetch the track data
  const track = await prisma.track.findUnique({
    where: { id: params.trackId },
    include: { 
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      critiques: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!track) {
    return <div>Track not found</div>
  }

  // Shape the data to match TrackWithCritiques
  const shapedTrack: TrackWithCritiques = {
    ...track,
    user: track.user,
    critiques: track.critiques.map(critique => ({
      ...critique,
      user: critique.user
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Critique for: {track.title}</h1>
      <TrackDisplay track={shapedTrack} isListingPage={false} isCritiquePage={true} />
      <CritiqueForm trackId={shapedTrack.id} />
    </div>
  )
}