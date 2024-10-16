'use server'

import prisma from '@/lib/prisma'
import { TrackWithCritiques } from '@/types/index'

export async function getTrack(id: string): Promise<TrackWithCritiques | null> {
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