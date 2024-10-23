import prisma from "@/lib/prisma"
import { catchErrorTyped } from "@/lib/utils"
import { CritiqueWithTrack, UserProfile } from "@/types/index"
import { revalidatePath } from "next/cache"

export async function getUserProfile(email: string): Promise<UserProfile> {
  const [error, user] = await catchErrorTyped(
    prisma.user.findUnique({
      where: { email },
      select: { 
        name: true, 
        email: true, 
        image: true,
        role: true,
        coins: true, 
        averageRating: true,
        totalCritiquesGiven: true,
        totalRatingsReceived: true,
        sumOfRatingsReceived: true,
        createdAt: true
      },
    })
  )

  if (error) {
    console.error("Failed to fetch user profile:", error)
    return null as unknown as UserProfile
  }

  return user as UserProfile
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
            slug: true,
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
            slug: true,
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

export async function updateUserStatistics(userId: string, newRating: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { averageRating: true, totalCritiquesGiven: true }
  });

  if (!user) throw new Error("User not found");

  const totalRatings = user.totalCritiquesGiven + 1;
  const newAverageRating = user.averageRating 
    ? (user.averageRating * user.totalCritiquesGiven + newRating) / totalRatings
    : newRating;

  await prisma.user.update({
    where: { id: userId },
    data: { 
      averageRating: newAverageRating,
      totalCritiquesGiven: { increment: 1 }
    }
  });

  return newAverageRating;
}

export async function getUserActivityLogs(email: string, page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  const [error, result] = await catchErrorTyped(
    prisma.user.findUnique({
      where: { email },
      select: {
        activityLogs: {
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        },
        _count: {
          select: { activityLogs: true }
        }
      },
    })
  )

  if (error) {
    console.error("Failed to fetch user activity logs:", error)
    return { logs: [], totalCount: 0 }
  }

  return { 
    logs: result?.activityLogs || [], 
    totalCount: result?._count.activityLogs || 0 
  }
}

export async function updateUserProfile(email: string | null | undefined, data: { name: string; role: string }) {
  if (!email) {
    throw new Error("User email is required")
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        name: data.name,
        role: data.role,
      },
    })
    revalidatePath('/profile')
    
    return updatedUser
  } catch (error) {
    console.error("Failed to update user profile:", error)
    throw new Error("Failed to update user profile")
  }
}

export async function loadMoreActivityLogs(email: string, page: number, limit: number = 10) {
  const skip = (page - 1) * limit
  try {
    const logs = await prisma.activityLog.findMany({
      where: { user: { email } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    })
    return logs
  } catch (error) {
    console.error("Failed to load more activity logs:", error)
    throw new Error("Failed to load more activity logs")
  }
}