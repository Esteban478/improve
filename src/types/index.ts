import { Critique, Track } from '@prisma/client'

export interface MinimalUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string | null;
}

export interface ExtendedCritique extends Omit<Critique, 'user'> {
  user: MinimalUser;
}

export interface TrackWithCritiques extends Omit<Track, 'user' | 'critiques'> {
  user: MinimalUser;
  critiques: ExtendedCritique[];
}

export interface CritiqueWithTrack extends ExtendedCritique {
  track: {
    id: string;
    title: string;
    slug: string;
  };
}