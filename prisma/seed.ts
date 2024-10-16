import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create test users
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@test.com' },
    update: {},
    create: {
      email: 'user1@test.com',
      name: 'User One',
      password: await bcrypt.hash('password123', 10),
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@test.com' },
    update: {},
    create: {
      email: 'user2@test.com',
      name: 'User Two',
      password: await bcrypt.hash('password123', 10),
    },
  })

  // Create tracks for users
  const track1 = await prisma.track.create({
    data: {
      title: 'Track 1',
      url: 'https://soundcloud.com/user1/track1',
      userId: user1.id,
    },
  })

  const track2 = await prisma.track.create({
    data: {
      title: 'Track 2',
      url: 'https://soundcloud.com/user2/track2',
      userId: user2.id,
    },
  })

  // Create critiques
  await prisma.critique.create({
    data: {
      trackId: track1.id,
      userId: user2.id,
      overallImpression: 'Great track!',
      emotionalResponse: 'Felt very uplifting',
      imagery: 'Reminds me of a sunny day',
      standoutElements: 'The bass line is fantastic',
      genreFit: 'Fits well in the genre',
    },
  })

  await prisma.critique.create({
    data: {
      trackId: track2.id,
      userId: user1.id,
      overallImpression: 'Interesting composition',
      emotionalResponse: 'Quite melancholic',
      imagery: 'Dark, rainy cityscape',
      standoutElements: 'The synth work is impressive',
      genreFit: 'Pushes the boundaries of the genre',
    },
  })

  console.log('Seed data created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })