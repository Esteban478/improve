'use server'

import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { logUserActivity } from '@/lib/statistics-utils'
import { SAMPLE_USER_ROLES } from '@/lib/sample-data'

export async function signUp(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string
  
  if (!name || !email || !password || !role) {
    throw new Error('Missing required fields')
  }

  // Server-side validation
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long')
  }
  if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
    throw new Error('Password must contain both letters and numbers')
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please enter a valid email address')
  }
  if (!SAMPLE_USER_ROLES.includes(role)) {
    throw new Error('Invalid role selected')
  }

  const exists = await prisma.user.findUnique({
    where: { email },
  })

  if (exists) {
    throw new Error('User already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  })

  await logUserActivity(user.id, 'User account created')

  return { name: user.name, email: user.email }
}