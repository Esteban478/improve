import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { generateUniqueSlug } from '../lib/utils'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('password123', 10)

  // Create users
  const users = await Promise.all(
    Array.from({ length: 10 }, (_, i) => 
      prisma.user.create({
        data: {
          email: `user${i + 1}@example.com`,
          name: `User ${i + 1}`,
          password,
          coins: 100 + (i * 10),
          role: i === 0 ? 'admin' : 'user',
        }
      })
    )
  )

  // Create tracks
  const tracks = await Promise.all(
    users.flatMap((user, i) =>
      Array.from({ length: i + 1 }, async (_, j) => {
        const title = `Track ${i + 1}-${j + 1}`
        const slug = `track-${i + 1}-${j + 1}`
        return prisma.track.create({
          data: {
            title,
            slug: slug,
            description: `Description for Track ${i + 1}-${j + 1}`,
            url: `https://soundcloud.com/user${i + 1}/track${j + 1}`,
            genre: ['Rock', 'Pop', 'Jazz', 'Electronic', 'Classical'][Math.floor(Math.random() * 5)],
            userId: user.id,
            requested: j === 0,
            requestedAt: j === 0 ? new Date() : null,
          }
        })
      })
    )
  )

  // Create critiques
  const critiques = await Promise.all(
    tracks.flatMap((track, i) =>
      users
        .filter(user => user.id !== track.userId) // Users can't critique their own tracks
        .slice(0, 3) // Limit to 3 critiques per track
        .map(user =>
          prisma.critique.create({
            data: {
              trackId: track.id,
              userId: user.id,
              mixingQuality: Math.floor(Math.random() * 10) + 1,
              tonalBalance: Math.floor(Math.random() * 10) + 1,
              masteringLoudness: Math.floor(Math.random() * 10) + 1,
              soundDesign: Math.floor(Math.random() * 10) + 1,
              arrangement: Math.floor(Math.random() * 10) + 1,
              technicalSummary: `Technical summary for Track ${i + 1}`,
              emotionalResponse: `Emotional response for Track ${i + 1}`,
              imagery: `Imagery for Track ${i + 1}`,
              standoutElements: `Standout elements for Track ${i + 1}`,
              genreFit: `Genre fit for Track ${i + 1}`,
              overallImpression: `Overall impression for Track ${i + 1}`,
            }
          })
        )
    )
  )

  // Create coin transactions
  const coinTransactions = await Promise.all(
    users.flatMap((user, i) =>
      Array.from({ length: 5 }, (_, j) =>
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