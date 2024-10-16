import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function catchErrorTyped<T, E extends Error = Error>(
  promise: Promise<T>,
  errorsToCatch?: Array<new (...args: unknown[]) => E>
): Promise<[E | undefined, T | undefined]> {
  return promise
    .then(data => [undefined, data] as [undefined, T])
    .catch(error => {
      if (!errorsToCatch) {
        return [error as E, undefined];
      }
      if (errorsToCatch.some(ErrorClass => error instanceof ErrorClass)) {
        return [error as E, undefined];
      }
      throw error;
    });
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-')   // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text
}

export async function generateUniqueSlug(title: string): Promise<string> {
  let slug = slugify(title);
  let uniqueSlug = slug;
  let counter = 1;

  while (true) {
    const existingTrack = await prisma.track.findUnique({
      where: { slug: uniqueSlug },
    });

    if (!existingTrack) {
      return uniqueSlug;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
}