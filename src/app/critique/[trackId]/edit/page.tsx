import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import CritiqueForm from "@/src/components/CritiqueForm"
import { ExtendedCritique } from "@/src/@types"

export default async function EditCritiquePage({ params }: { params: { trackId: string } }) {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/sign-in?callbackUrl=/critique/" + params.trackId + "/edit")
  }

  const critique = await prisma.critique.findFirst({
    where: {
      trackId: params.trackId,
      user: { email: session.user?.email }
    },
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
  })

  if (!critique) {
    redirect(`/tracks/${params.trackId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Critique</h1>
      <CritiqueForm trackId={params.trackId} existingCritique={critique as ExtendedCritique} />
    </div>
  )
}