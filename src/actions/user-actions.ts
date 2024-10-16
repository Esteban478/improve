import prisma from "@/lib/prisma"
import { catchErrorTyped } from "@/lib/utils"
import { CritiqueWithTrack } from "@/types/index"

export async function getUserProfile(email: string) {
  const [error, user] = await catchErrorTyped(
    prisma.user.findUnique({
      where: { email },
      select: { name: true, email: true, image: true, coins: true },
    })
  )

  if (error) {
    console.error("Failed to fetch user profile:", error)
    return null
  }

  return user
}

export async function getUserTracks(email: string) {
  const [error, tracks] = await catchErrorTyped(
    prisma.track.findMany({
      where: { user: { email } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })
  )

  if (error) {
    console.error("Failed to fetch user tracks:", error)
    return []
  }

  return tracks || []
}

export async function getUserGivenCritiques(email: string): Promise<CritiqueWithTrack[]> {
  const [error, critiques] = await catchErrorTyped(
    prisma.critique.findMany({
      where: { user: { email } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { 
        track: {
          select: {
            id: true,
            title: true,
          }
        } 
      },
    })
  )

  if (error) {
    console.error("Failed to fetch user given critiques:", error)
    return [] as CritiqueWithTrack[]
  }

  return critiques as CritiqueWithTrack[]
}

export async function getUserReceivedCritiques(email: string): Promise<CritiqueWithTrack[]> {
  const [error, critiques] = await catchErrorTyped(
    prisma.critique.findMany({
      where: { track: { user: { email } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { 
        track: {
          select: {
            id: true,
            title: true,
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        } 
      },
    })
  )

  if (error) {
    console.error("Failed to fetch user received critiques:", error)
    return [] as CritiqueWithTrack[]
  }

  return critiques as CritiqueWithTrack[]
}