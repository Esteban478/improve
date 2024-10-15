import { TrackWithCritiques } from '@/src/@types';
import TrackDisplay from "@/src/components/TrackDisplay";
import prisma from '@/lib/prisma';

async function getLatestTracks(limit: number = 5): Promise<TrackWithCritiques[]> {
  const tracks = await prisma.track.findMany({
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
  });

  return tracks as TrackWithCritiques[];
}

export default async function Home() {
  const tracks = await getLatestTracks();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Latest Tracks</h1>
      <div className="space-y-8">
        {tracks.map((track) => (
          <TrackDisplay key={track.id} track={track} isListingPage={true} />
        ))}
      </div>
    </main>
  );
}