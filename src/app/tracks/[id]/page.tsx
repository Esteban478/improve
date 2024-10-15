import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import TrackDisplay from '@/src/components/TrackDisplay';
import { Suspense } from 'react';
import { TrackWithCritiques } from '@/src/@types';

async function getTrack(id: string): Promise<TrackWithCritiques | null> {
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
  });

  return track as TrackWithCritiques | null;
}

export default async function TrackPage({ params }: { params: { id: string } }) {
  const track = await getTrack(params.id);

  if (!track) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading track...</div>}>
        <TrackDisplay track={track} isListingPage={false} />
      </Suspense>
      <h2 className="text-2xl font-bold mt-8 mb-4">Critiques</h2>
      <Suspense fallback={<div>Loading critiques...</div>}>
        {track.critiques.length > 0 ? (
          <div className="space-y-4">
            {track.critiques.map((critique) => (
              <div key={critique.id} className="border p-4 rounded">
                <p className="mb-2">{critique.overallImpression}</p>
                <p className="text-gray-600 text-sm">By {critique.user.name} on {new Date(critique.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No critiques yet. Be the first to critique this track!</p>
        )}
      </Suspense>
    </div>
  );
}