"use client"

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import SoundCloudEmbed from './SoundCloudEmbed';
import UserAvatar from './UserAvatar';
import { Critique } from '@prisma/client';

interface User {
  id?: string;
  email: string | null;
  name: string | null;
  image: string | null;
}

interface TrackDisplayProps {
  track: {
    id: string;
    title: string;
    url: string;
    description?: string | null;
    genre?: string | null;
    user: User;
    critiques?: Critique[]; // We'll keep this as any[] for flexibility
  };
}

const TrackDisplay: React.FC<TrackDisplayProps> = ({ track }) => {
  const { data: session } = useSession();

  const isOwnTrack = session?.user?.email === track.user.email;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <div className="flex items-center mb-4">
        <UserAvatar src={track.user.image} alt={track.user.name || 'User'} size={40} />
        <h2 className="text-xl font-semibold ml-2">{track.title}</h2>
      </div>
      <p className="text-gray-600 mb-2">By {track.user.name || "Unknown Artist"}</p>
      {track.genre && <p className="text-sm text-gray-500 mb-4">Genre: {track.genre}</p>}
      <SoundCloudEmbed url={track.url} />
      {track.description && <p className="text-gray-700 my-4">{track.description}</p>}
      {track.critiques && track.critiques.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Latest Critique</h3>
          <p className="text-gray-700">{track.critiques[0].content}</p>
        </div>
      )}
      {!isOwnTrack && (
        <Link href={`/critique/${track.id}`} className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Give Critique
        </Link>
      )}
    </div>
  );
};

export default TrackDisplay;