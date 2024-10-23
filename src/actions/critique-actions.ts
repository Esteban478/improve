'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { updateCoins } from './coin-actions'
import { AuthorizationError, NotFoundError } from '../types/errors'
import { ExtendedCritique } from '../types'
import { logUserActivity, updateUserStatistics } from '@/lib/statistics-utils'

const CRITIQUE_REWARD = 1
const FEEDBACK_REQUEST_COST = 3

export async function getTracksNeedingFeedback(limit: number = 10) {
  const tracks = await prisma.track.findMany({
    where: { requested: true },
    orderBy: { requestedAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
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
              role: true,
            },
          },
        },
      },
    },
  })

  return tracks
}

export async function getCritiqueById(id: string): Promise<ExtendedCritique | null> {
  const critique = await prisma.critique.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          averageRating: true,
        },
      },
      track: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  })

  if (!critique) {
    throw new NotFoundError('Critique not found')
  }

  return critique as ExtendedCritique
}

export async function getUserCritiqueForTrack(userEmail: string, trackId: string): Promise<ExtendedCritique | null> {
  const critique = await prisma.critique.findFirst({
    where: {
      trackId: trackId,
      user: { email: userEmail },
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
      track: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  })

  return critique as ExtendedCritique | null
}

export async function requestFeedback(trackId: string, userEmail: string) {
  const user = await prisma.user.findUnique({ where: { email: userEmail } })
  if (!user) throw new AuthorizationError('User not found')

  if (user.coins < FEEDBACK_REQUEST_COST) {
    throw new Error('Insufficient coins to request feedback')
  }

  const updatedTrack = await prisma.track.update({
    where: { id: trackId },
    data: { requested: true, requestedAt: new Date() },
  })

  // Deduct coins for requesting feedback
  await updateCoins(userEmail, FEEDBACK_REQUEST_COST, 'SPEND', 'Requested feedback')

  revalidatePath(`/tracks/${trackId}`)
  revalidatePath('/dashboard')
  // revalidatePath('/', 'layout')

  return updatedTrack
}
export async function submitCritique(formData: FormData) {
  try {
    const trackId = formData.get('trackId') as string
    const slug = formData.get('slug') as string
    const userEmail = formData.get('userEmail') as string
    const mixingQuality = parseInt(formData.get('mixingQuality') as string) || null
    const tonalBalance = parseInt(formData.get('tonalBalance') as string) || null
    const masteringLoudness = parseInt(formData.get('masteringLoudness') as string) || null
    const soundDesign = parseInt(formData.get('soundDesign') as string) || null
    const arrangement = parseInt(formData.get('arrangement') as string) || null
    const technicalSummary = formData.get('technicalSummary') as string
    const emotionalResponse = formData.get('emotionalResponse') as string
    const imagery = formData.get('imagery') as string
    const standoutElements = formData.get('standoutElements') as string
    const genreFit = formData.get('genreFit') as string
    const title = formData.get('title') as string
    const overallImpression = formData.get('overallImpression') as string

    if (!trackId || !userEmail || !overallImpression) {
      throw new Error('Missing required fields')
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    })

    if (!user) {
      console.error('User not found for email:', userEmail);
      throw new Error('User not found');
    }

    const newCritique = await prisma.critique.create({
      data: {
        trackId,
        userId: user.id,
        mixingQuality,
        tonalBalance,
        masteringLoudness,
        soundDesign,
        arrangement,
        technicalSummary,
        emotionalResponse,
        imagery,
        standoutElements,
        genreFit,
        title,
        overallImpression,
      },
    })

    await updateUserStatistics(user.id)
    await logUserActivity(user.id, 'Critique submitted', `Critique ID: ${newCritique.id}`)

    await updateCoins(userEmail, CRITIQUE_REWARD, 'EARN', 'Submitted critique')
    revalidatePath(`/tracks/${slug}`)
    
    return newCritique
  } catch (error: unknown) {
    console.error('Error in submitCritique:', error)
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack)
    } else {
      console.error('An unknown error occurred')
    }
    throw error
  }
}
export async function updateCritique(formData: FormData) {
  try {
  const critiqueId = formData.get('critiqueId') as string
  const userEmail = formData.get('userEmail') as string
  const mixingQuality = parseInt(formData.get('mixingQuality') as string) || null
  const tonalBalance = parseInt(formData.get('tonalBalance') as string) || null
  const masteringLoudness = parseInt(formData.get('masteringLoudness') as string) || null
  const soundDesign = parseInt(formData.get('soundDesign') as string) || null
  const arrangement = parseInt(formData.get('arrangement') as string) || null
  const technicalSummary = formData.get('technicalSummary') as string
  const emotionalResponse = formData.get('emotionalResponse') as string
  const imagery = formData.get('imagery') as string
  const standoutElements = formData.get('standoutElements') as string
  const genreFit = formData.get('genreFit') as string
  const title = formData.get('title') as string
  const overallImpression = formData.get('overallImpression') as string

  if (!critiqueId || !userEmail || !overallImpression) {
    throw new Error('Missing required fields')
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  })

  if (!user) {
    throw new Error('User not found')
  }

    const updatedCritique = await prisma.critique.update({
      where: { id: critiqueId },
      data: {
        mixingQuality,
        tonalBalance,
        masteringLoudness,
        soundDesign,
        arrangement,
        technicalSummary,
        emotionalResponse,
        imagery,
        standoutElements,
        genreFit,
        title,
        overallImpression,
      },
    })

    revalidatePath(`/tracks/${updatedCritique.trackId}`)

    return updatedCritique
  } catch (error: unknown) {
    console.error('Error in updateCritique:', error)
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack)
    } else {
      console.error('An unknown error occurred')
    }
    throw error
  }
}