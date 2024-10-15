'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'

export async function submitTrack(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const url = formData.get('url') as string
  const genre = formData.get('genre') as string
  const userEmail = formData.get('userEmail') as string

  if (!title || !url || !userEmail) {
    throw new Error('Missing required fields')
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const newTrack = await prisma.track.create({
    data: {
      title,
      description: description || undefined,
      url,
      genre: genre || undefined,
      userId: user.id,
    },
  })

  revalidatePath('/tracks')
  revalidatePath('/')
  revalidatePath('/dashboard')

  return newTrack
}

export async function submitCritique(formData: FormData) {
  try {
    const trackId = formData.get('trackId') as string
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
    const overallImpression = formData.get('overallImpression') as string

    console.log('Submitting critique with data:', {
      trackId, userEmail, mixingQuality, tonalBalance, masteringLoudness,
      soundDesign, arrangement, technicalSummary, emotionalResponse,
      imagery, standoutElements, genreFit, overallImpression
    })

    if (!trackId || !userEmail || !overallImpression) {
      throw new Error('Missing required fields')
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    })

    console.log('User email:', userEmail);
    console.log('User object:', user);

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
        overallImpression,
      },
    })

    revalidatePath(`/tracks/${trackId}`)

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