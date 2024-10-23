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
  const slug = slugify(title);
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

/**
 * Calculates the password strength based on entropy
 * Returns a number from 0-4 representing very weak to very strong
 */
export function calculatePasswordStrength(password: string): number {
  // Calculate the range of possible characters based on what's used in the password
  let range = 0;
  
  // Check character types used
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^A-Za-z0-9]/.test(password);
  
  // Add to range based on character types used
  if (hasLowercase) range += 26; // a-z
  if (hasUppercase) range += 26; // A-Z
  if (hasNumbers) range += 10;   // 0-9
  if (hasSymbols) range += 32;   // Common symbols
  
  // If no characters are found (shouldn't happen), set minimum range
  if (range === 0) range = 26;
  
  // Calculate entropy: E = log2(R^L)
  // Which is equivalent to: E = L * log2(R)
  const entropy = password.length * Math.log2(range);
  
  // Convert entropy to strength level (0-4)
  if (entropy < 35) return 0;   // Very weak
  if (entropy < 60) return 1;   // Weak
  if (entropy < 90) return 2;   // Strong
  if (entropy < 120) return 3;  // Very strong
  return 0;
}