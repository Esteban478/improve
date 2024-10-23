import { Critique, Track } from '@prisma/client'

export interface MinimalUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string | null;
  averageRating?: number | null;
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

export interface UserProfile {
  name: string
  email: string
  image: string
  role: string
  coins: number
  averageRating?: number
  totalCritiquesGiven: number
  totalRatingsReceived: number
  sumOfRatingsReceived: number
  createdAt: Date
}