import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { generateUniqueSlug } from '../lib/utils'
import { SAMPLE_USER_NAMES, SAMPLE_USER_ROLES, SAMPLE_TRACKS, SAMPLE_GENRES, SAMPLE_DESCRIPTIONS, SAMPLE_CRITIQUES } from '../lib/sample-data'

const prisma = new PrismaClient()

function extractTitleFromUrl(url: string): string {
  const parts = url.split('/')
  return parts[parts.length - 1].replace(/-/g, ' ').replace(/^\d+/, '').trim()
}

async function main() {
  // Clear existing data
  await prisma.coinTransaction.deleteMany()
  await prisma.critique.deleteMany()
  await prisma.track.deleteMany()
  await prisma.user.deleteMany()

  const password = await bcrypt.hash('password123', 10)

  // Create users
  const users = await Promise.all(
    SAMPLE_USER_NAMES.map(async (name, i) => {
      const role = SAMPLE_USER_ROLES[Math.floor(Math.random() * SAMPLE_USER_ROLES.length)]
      return prisma.user.create({
        data: {
          email: `${name.toLowerCase()}@mail.com`,
          name,
          password,
          coins: 100 + (i * 10),
          role,
        }
      })
    })
  )

  // Create tracks
  const tracks = await Promise.all(
    SAMPLE_TRACKS.map(async (url) => {
      const user = users[Math.floor(Math.random() * users.length)]
      const title = extractTitleFromUrl(url)
      const slug = await generateUniqueSlug(title)
      return prisma.track.create({
        data: {
          title,
          slug,
          description: SAMPLE_DESCRIPTIONS[Math.floor(Math.random() * SAMPLE_DESCRIPTIONS.length)],
          url,
          genre: SAMPLE_GENRES[Math.floor(Math.random() * SAMPLE_GENRES.length)],
          userId: user.id,
          requested: Math.random() < 0.3, // 30% chance of being requested
          requestedAt: Math.random() < 0.3 ? new Date() : null,
        }
      })
    })
  )

  // Create critiques
  const critiques = await Promise.all(
    tracks.flatMap((track) =>
      users
        .filter(user => user.id !== track.userId) // Users can't critique their own tracks
        .slice(0, Math.floor(Math.random() * 3) + 1) // Random number of critiques (1-3) per track
        .map(user => {
          const sampleCritique = SAMPLE_CRITIQUES[Math.floor(Math.random() * SAMPLE_CRITIQUES.length)]
          return prisma.critique.create({
            data: {
              trackId: track.id,
              userId: user.id,
              ...sampleCritique,
            }
          })
        })
    )
  )

  // Create coin transactions
  const coinTransactions = await Promise.all(
    users.flatMap((user) =>
      Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) =>
        prisma.coinTransaction.create({
          data: {
            userId: user.id,
            amount: Math.floor(Math.random() * 50) + 1,
            type: j % 2 === 0 ? 'EARN' : 'SPEND',
            reason: j % 2 === 0 ? 'Critique given' : 'Feedback requested',
          }
        })
      )
    )
  )

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