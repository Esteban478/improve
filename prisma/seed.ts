import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { generateUniqueSlug } from '../lib/utils'
import { SAMPLE_USER_NAMES, SAMPLE_USER_ROLES, SAMPLE_TRACKS, SAMPLE_GENRES, SAMPLE_DESCRIPTIONS, SAMPLE_CRITIQUES } from '../lib/sample-data'
import { logUserActivity } from '../lib/statistics-utils'
import { CRITIQUE_REWARD, FEEDBACK_REQUEST_COST } from '../lib/constants'

const prisma = new PrismaClient()

// Helper function to extract title from URL
function extractTitleFromUrl(url: string): string {
  const parts = url.split('/')
  return parts[parts.length - 1].replace(/-/g, ' ').replace(/^\d+/, '').trim()
}

// Function to generate a critique title
function generateCritiqueTitle(): string {
  const adjectives = [
    'Energetic', 'Mellow', 'Uplifting', 'Atmospheric', 'Groovy',
    'Haunting', 'Powerful', 'Soothing', 'Intense', 'Dreamy',
    'Hypnotic', 'Quirky', 'Nostalgic', 'Futuristic', 'Raw'
  ];
  const nouns = [
    'Beats', 'Melodies', 'Rhythms', 'Soundscape', 'Composition',
    'Journey', 'Vibes', 'Harmony', 'Textures', 'Groove',
    'Arrangement', 'Production', 'Mix', 'Atmosphere', 'Experience'
  ];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomAdjective} ${randomNoun}`;
}

// Function to generate a random rating
function generateRandomRating(): { rating: number | null, ratedAt: Date | null, ratedBy: string | null } {
  if (Math.random() < 0.7) { // 70% chance of having a rating
    return {
      rating: Math.floor(Math.random() * 5) + 1,
      ratedAt: new Date(),
      ratedBy: null // We'll set this later
    }
  }
  return { rating: null, ratedAt: null, ratedBy: null }
}

// Function to update user statistics
async function updateUserStatistics(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      critiques: {
        where: { rating: { not: null } }
      }
    }
  });

  if (!user) throw new Error("User not found");

  const totalCritiquesGiven = user.totalCritiquesGiven;
  const totalRatingsReceived = user.critiques.length;
  const sumOfRatingsReceived = user.critiques.reduce((sum, critique) => sum + (critique.rating || 0), 0);
  const averageRating = totalRatingsReceived > 0 ? sumOfRatingsReceived / totalRatingsReceived : 0;

  await prisma.user.update({
    where: { id: userId },
    data: { 
      totalCritiquesGiven,
      totalRatingsReceived,
      sumOfRatingsReceived,
      averageRating
    }
  });
}

async function main() {
  // Clear existing data
  await prisma.activityLog.deleteMany()
  await prisma.coinTransaction.deleteMany()
  await prisma.critique.deleteMany()
  await prisma.track.deleteMany()
  await prisma.user.deleteMany()

  const password = await bcrypt.hash('password123', 10)

  // Create users
  const users = await Promise.all(
    SAMPLE_USER_NAMES.map(async (name, i) => {
      const role = SAMPLE_USER_ROLES[Math.floor(Math.random() * SAMPLE_USER_ROLES.length)]
      const user = await prisma.user.create({
        data: {
          email: `${name.toLowerCase()}@mail.com`,
          name,
          password,
          coins: 100 + (i * 10),
          role,
          totalCritiquesGiven: 0,
          totalRatingsReceived: 0,
          sumOfRatingsReceived: 0,
          averageRating: 0,
        }
      })
      
      await logUserActivity(user.id, 'User account created')
      
      return user
    })
  )

  // Create tracks
  const tracks = await Promise.all(
    SAMPLE_TRACKS.map(async (url) => {
      const user = users[Math.floor(Math.random() * users.length)]
      const title = extractTitleFromUrl(url)
      const slug = await generateUniqueSlug(title)
      const track = await prisma.track.create({
        data: {
          title,
          slug,
          description: SAMPLE_DESCRIPTIONS[Math.floor(Math.random() * SAMPLE_DESCRIPTIONS.length)],
          url,
          genre: SAMPLE_GENRES[Math.floor(Math.random() * SAMPLE_GENRES.length)],
          userId: user.id,
          requested: Math.random() < 0.3,
          requestedAt: Math.random() < 0.3 ? new Date() : null,
        }
      })

      await logUserActivity(user.id, 'Track submitted', `Track ID: ${track.id}`)

      return track
    })
  )

  // Create critiques
  const critiques = await Promise.all(
    tracks.flatMap((track) =>
      users
        .filter(user => user.id !== track.userId)
        .slice(0, Math.floor(Math.random() * 10) + 5)
        .map(async (user) => {
          const sampleCritique = SAMPLE_CRITIQUES[Math.floor(Math.random() * SAMPLE_CRITIQUES.length)]
          const randomTitle = generateCritiqueTitle()
          const { rating, ratedAt } = generateRandomRating()
          const critique = await prisma.critique.create({
            data: {
              trackId: track.id,
              userId: user.id,
              title: randomTitle,
              ...sampleCritique,
              rating,
              ratedAt,
              ratedBy: rating ? track.userId : null
            }
          })

          await logUserActivity(user.id, 'Critique submitted', `Critique ID: ${critique.id}`)
          await prisma.user.update({
            where: { id: user.id },
            data: { totalCritiquesGiven: { increment: 1 } }
          })

          if (rating !== null) {
            await logUserActivity(track.userId, 'Critique rated', `Critique ID: ${critique.id}, Rating: ${rating}`)
            await prisma.user.update({
              where: { id: user.id },
              data: {
                totalRatingsReceived: { increment: 1 },
                sumOfRatingsReceived: { increment: rating }
              }
            })
          }

          return critique
        })
    )
  )

  // Update user statistics
  for (const user of users) {
    await updateUserStatistics(user.id)
  }

  // Create coin transactions
const coinTransactions = await Promise.all(
  users.flatMap((user) =>
    Array.from({ length: Math.floor(Math.random() * 10) + 1 }, async () => {
      const isEarning = Math.random() < 0.7; // 70% chance of earning
      let amount: number;
      let reason: string;

      if (isEarning) {
        amount = CRITIQUE_REWARD;
        reason = Math.random() < 0.3 ? 'Critique highly rated' : 'Critique submitted';
      } else {
        amount = FEEDBACK_REQUEST_COST;
        reason = 'Feedback requested';
      }

      const transaction = await prisma.coinTransaction.create({
        data: {
          userId: user.id,
          amount,
          type: isEarning ? 'EARN' : 'SPEND',
          reason,
        }
      });

      await logUserActivity(user.id, `Coins ${isEarning ? 'earned' : 'spent'}`, `Amount: ${amount}, Reason: ${reason}`);

      return transaction;
    })
  )
);

  console.log(`Created ${users.length} users`)
  console.log(`Created ${tracks.length} tracks`)
  console.log(`Created ${critiques.length} critiques`)
  console.log(`Created ${coinTransactions.length} coin transactions`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })