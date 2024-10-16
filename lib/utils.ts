import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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