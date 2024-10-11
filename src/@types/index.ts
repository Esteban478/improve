import { Critique, User } from '@prisma/client'

export interface ExtendedCritique extends Critique {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  }
}

export interface TrackWithCritiques {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  genre?: string | null;
  user: User;
  critiques: ExtendedCritique[];
}

export interface Track {
  id: string;
  title: string;
  url: string;
  description: string;
  genre: string;
  createdAt: Date;
}