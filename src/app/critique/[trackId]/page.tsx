import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import TrackDisplay from "@/src/components/TrackDisplay"
import CritiqueForm from "@/src/components/CritiqueForm"

export default async function CritiquePage({ params }: { params: { trackId: string } }) {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/sign-in?callbackUrl=/critique/" + params.trackId)
  }

  // Fetch the track data
  const track = await prisma.track.findUnique({
    where: { id: params.trackId },
    include: { user: true },
  })

  if (!track) {
    return <div>Track not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Critique for: {track.title}</h1>
      <TrackDisplay track={track} />
      <CritiqueForm trackId={track.id} />
    </div>
  )
}