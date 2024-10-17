'use server'

import prisma from '@/lib/prisma'
import { catchErrorTyped, generateUniqueSlug } from '@/lib/utils'
import { TrackWithCritiques } from '@/types/index'
import { updateCoins } from './coin-actions'
import { AuthorizationError } from '@/types/errors'
import { revalidatePath } from 'next/cache'

const FEEDBACK_REQUEST_COST = 3

export async function getTrackById(id: string): Promise<TrackWithCritiques | null> {
  const track = await prisma.track.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          coins: true,
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
              coins: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  return track as TrackWithCritiques | null
}

export async function getTrackBySlug(slug: string): Promise<TrackWithCritiques | null> {
  // console.log('Fetching track with slug:', slug);

  const track = await prisma.track.findUnique({
    where: { slug },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          coins: true,
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
              coins: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  // console.log('Found track:', track);

  return track as TrackWithCritiques | null
}

export async function getTracks(searchParams: { search?: string, genre?: string, page?: string, take?: string }): Promise<TrackWithCritiques[]> {
  const { search = '', genre = '', page = '1', take = '10' } = searchParams
  const pageSize = parseInt(take)
  const skip = (parseInt(page) - 1) * pageSize

  const tracks = await prisma.track.findMany({
    where: {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
      genre: genre ? { contains: genre, mode: 'insensitive' } : undefined,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          coins: true,
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
              coins: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip,
    take: pageSize,
  })

  return tracks as TrackWithCritiques[]
}

export async function getLatestTracks(limit: number = 5): Promise<TrackWithCritiques[]> {
  const [error, tracks] = await catchErrorTyped(
    prisma.track.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            coins: true,
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
                coins: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })
  );

  if (error) {
    console.error("Failed to fetch latest tracks:", error);
    return [];
  }

  return tracks as TrackWithCritiques[];
}

export async function getTrackForCritique(trackId: string): Promise<TrackWithCritiques | null> {
  const [error, track] = await catchErrorTyped(
    prisma.track.findUnique({
      where: { id: trackId },
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
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })
  );

  if (error) {
    console.error("Failed to fetch track for critique:", error);
    return null;
  }

  if (!track) return null;

  return {
    ...track,
    user: track.user,
    critiques: track.critiques.map(critique => ({
      ...critique,
      user: critique.user
    }))
  };
}

export async function submitTrack(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const url = formData.get('url') as string
  const genre = formData.get('genre') as string
  const userEmail = formData.get('userEmail') as string
  const requestFeedback = formData.get('requestFeedback') as string

  if (!title || !url || !userEmail) {
    throw new Error('Missing required fields')
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const slug = await generateUniqueSlug(title)

  const newTrack = await prisma.track.create({
    data: {
      title,
      slug,
      description: description || undefined,
      url,
      genre: genre || undefined,
      userId: user.id,
      requested: requestFeedback ? true : false,
      requestedAt: requestFeedback ? new Date() : null,
    },
  })

  revalidatePath('/tracks')
  revalidatePath('/')
  revalidatePath('/dashboard')

  return newTrack
}

export async function requestFeedback(trackId: string, userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new AuthorizationError('User not found')

  if (user.coins < FEEDBACK_REQUEST_COST) {
    throw new Error('Insufficient coins to request feedback')
  }

  const updatedTrack = await prisma.track.update({
    where: { id: trackId },
    data: { requested: true, requestedAt: new Date() },
  })

  // Deduct coins for requesting feedback
  await updateCoins(userId, FEEDBACK_REQUEST_COST, 'SPEND', 'Requested feedback')

  revalidatePath(`/tracks/${trackId}`)
  revalidatePath('/dashboard')

  return updatedTrack
}

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
      },
    },
  });

  return tracks;
}