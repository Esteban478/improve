import prisma from './prisma'

export async function calculateUserStatistics(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      critiques: true,
      tracks: {
        include: {
          critiques: true
        }
      }
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  const totalCritiquesGiven = user.critiques.length
  const totalRatingsReceived = user.tracks.reduce((sum, track) => 
    sum + track.critiques.filter(critique => critique.rating !== null).length, 0
  )
  const sumOfRatingsReceived = user.tracks.reduce((sum, track) => 
    sum + track.critiques.reduce((trackSum, critique) => trackSum + (critique.rating || 0), 0), 0
  )
  const averageRating = totalRatingsReceived > 0 ? sumOfRatingsReceived / totalRatingsReceived : 0

  return {
    totalCritiquesGiven,
    totalRatingsReceived,
    sumOfRatingsReceived,
    averageRating
  }
}

export async function updateUserStatistics(userId: string) {
  const stats = await calculateUserStatistics(userId)
  
  await prisma.user.update({
    where: { id: userId },
    data: stats
  })
}

export async function logUserActivity(userId: string, action: string, details?: string) {
  await prisma.activityLog.create({
    data: {
      userId,
      action,
      details
    }
  })
}