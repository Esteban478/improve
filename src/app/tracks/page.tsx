import { Suspense } from 'react';
import prisma from '@/lib/prisma';
import TrackDisplay from '@/src/components/TrackDisplay';
import LoadMore from '@/src/components/LoadMore';
import { TrackWithCritiques } from '@/src/@types';

async function getTracks(searchParams: { search?: string, genre?: string, page?: string, take?: string }): Promise<TrackWithCritiques[]> {
  const { search = '', genre = '', page = '1', take = '10' } = searchParams;
  const pageSize = parseInt(take);
  const skip = (parseInt(page) - 1) * pageSize;

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
  });

  return tracks as TrackWithCritiques[];
}

export default async function TracksPage({ searchParams }: { searchParams: { search?: string, genre?: string, page?: string, take?: string } }) {
  const tracks: TrackWithCritiques[] = await getTracks(searchParams);
  const currentPage = parseInt(searchParams.page || '1');
  const currentTake = parseInt(searchParams.take || '10');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tracks</h1>
      <Suspense fallback={<div>Loading tracks...</div>}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <TrackDisplay key={track.id} track={track} isListingPage={true} isCritiquePage={false} />
          ))}
        </div>
      </Suspense>
      <LoadMore 
        currentPage={currentPage} 
        currentTake={currentTake} 
        totalTracks={tracks.length} 
      />
    </div>
  );
}