import { Critique } from '@prisma/client'

export interface MinimalUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  coins: number;
  role: string | null;
}

export interface ExtendedCritique extends Omit<Critique, 'user'> {
  user: MinimalUser;
}

export interface TrackWithCritiques {
  id: string;
  title: string;
  url: string;
  description: string | null;
  genre: string | null;
  user: MinimalUser;
  critiques: ExtendedCritique[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Track {
  id: string;
  title: string;
  url: string;
  description: string;
  genre: string;
  createdAt: Date;
}