'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { updateCoins } from './coin-actions'
import { AuthorizationError, NotFoundError } from '../types/errors'
import { ExtendedCritique } from '../types'
import { logUserActivity, updateUserStatistics } from '@/lib/statistics-utils'
import { CRITIQUE_REWARD, FEEDBACK_REQUEST_COST } from '@/lib/constants'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

const CritiqueSchema = z.object({
  trackId: z.string().min(1, "Track ID is required"),
  title: z.string().max(100, "Title must be 100 characters or less"),
  mixingQuality: z.number().min(1).max(10).nullable(),
  tonalBalance: z.number().min(1).max(10).nullable(),
  masteringLoudness: z.number().min(1).max(10).nullable(),
  soundDesign: z.number().min(1).max(10).nullable(),
  arrangement: z.number().min(1).max(10).nullable(),
  technicalSummary: z.string().max(500).nullable(),
  emotionalResponse: z.string().min(1, "Emotional response is required").max(500),
  imagery: z.string().min(1, "Imagery is required").max(500),
  standoutElements: z.string().min(1, "Standout elements are required").max(500),
  genreFit: z.string().min(1, "Genre fit is required").max(500),
  overallImpression: z.string().min(1, "Overall impression is required").max(1000)
});

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
  const session = await getServerSession()
  if (!session?.user?.email) {
    throw new AuthorizationError("Not authenticated")
  }

  try {
    // Extract and sanitize form data
    const critiqueData = {
      trackId: formData.get('trackId') as string,
      title: (formData.get('title') as string)?.trim() || '',
      mixingQuality: formData.get('mixingQuality') ? parseInt(formData.get('mixingQuality') as string) : null,
      tonalBalance: formData.get('tonalBalance') ? parseInt(formData.get('tonalBalance') as string) : null,
      masteringLoudness: formData.get('masteringLoudness') ? parseInt(formData.get('masteringLoudness') as string) : null,
      soundDesign: formData.get('soundDesign') ? parseInt(formData.get('soundDesign') as string) : null,
      arrangement: formData.get('arrangement') ? parseInt(formData.get('arrangement') as string) : null,
      technicalSummary: (formData.get('technicalSummary') as string)?.trim() || null,
      emotionalResponse: (formData.get('emotionalResponse') as string)?.trim(),
      imagery: (formData.get('imagery') as string)?.trim(),
      standoutElements: (formData.get('standoutElements') as string)?.trim(),
      genreFit: (formData.get('genreFit') as string)?.trim(),
      overallImpression: (formData.get('overallImpression') as string)?.trim()
    };

    // Validate data
    const validatedData = CritiqueSchema.parse(critiqueData);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if track exists
    const track = await prisma.track.findUnique({
      where: { id: validatedData.trackId }
    });

    if (!track) {
      throw new Error("Track not found");
    }

    // Prevent self-critique
    if (track.userId === user.id) {
      throw new Error("You cannot critique your own track");
    }

    // Check for existing critique
    const existingCritique = await prisma.critique.findFirst({
      where: {
        trackId: validatedData.trackId,
        userId: user.id
      }
    });

    if (existingCritique) {
      throw new Error("You have already critiqued this track");
    }

    // Create critique with validated data
    const newCritique = await prisma.critique.create({
      data: {
        ...validatedData,
        userId: user.id
      },
    });

    await updateUserStatistics(user.id);
    await logUserActivity(user.id, 'Critique submitted', `Critique ID: ${newCritique.id}`);
    await updateCoins(session.user.email, CRITIQUE_REWARD, 'EARN', 'Submitted critique');
    
    revalidatePath(`/tracks/${track.slug}`);
    
    return newCritique;

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format validation errors nicely
      const errorMessage = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      throw new Error(`Validation failed: ${errorMessage}`);
    }
    throw error;
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