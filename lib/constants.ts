import { z } from 'zod'

// COMPONENTS

// CritiqueForm
export const STORAGE_KEY = 'critiqueFormData'

// ErrorDisplay
export const ERROR_DISPLAY_TITLE = 'An error occurred'

// PasswordStrengthMeter
export const MIN_PASSWORD_LENGTH = 8

export const TEXT_COLOR_LABELS = [
  'text-red-500',
  'text-orange-500',
  'text-lime-500',
  'text-green-500',
]

export const METER_COLOR_LABELS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-lime-500',
  'bg-green-500',
]

export const STRENGTH_LABELS = [
  'Very weak',
  'Weak',
  'Strong',
  'Very strong',
]

// VALUES
export const CRITIQUE_REWARD = 1
export const FEEDBACK_REQUEST_COST = 4

// ZOD VALIDATION SCHEMAS

export const TrackSubmissionSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
  description: z.string().max(1000, "Description must be 1000 characters or less").nullable(),
  url: z.string().url("Must be a valid URL").includes("soundcloud.com", { message: "Must be a SoundCloud URL" }),
  genre: z.string().max(50, "Genre must be 50 characters or less").nullable(),
  userEmail: z.string().email("Valid email is required")
});

// RATE LIMIT PRESETS
export const RateLimitPresets = {
  SUBMIT_TRACK: {
    actionName: 'submit-track',
    windowMs: 60 * 60 * 1000,    // 1 hour
    maxAttempts: 5               // 5 tracks per hour
  },
  SUBMIT_CRITIQUE: {
    actionName: 'submit-critique',
    windowMs: 15 * 60 * 1000,    // 15 minutes
    maxAttempts: 3               // 3 critiques per 15 minutes
  },
  REQUEST_FEEDBACK: {
    actionName: 'request-feedback',
    windowMs: 60 * 60 * 1000,    // 1 hour
    maxAttempts: 3               // 3 requests per hour
  },
  USER_REGISTRATION: {
    actionName: 'user-registration',
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    maxAttempts: 2                 // 2 registrations per day (prevent spam accounts)
  }
} as const;