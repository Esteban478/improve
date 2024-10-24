'use server'

import { getServerSession } from "next-auth/next"
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { AuthorizationError } from '@/types/errors'
import { logUserActivity } from '@/lib/statistics-utils'
import { z } from 'zod'

// Input validation schemas
const UpdateCoinsInput = z.object({
  amount: z.number().int().min(1),
  type: z.enum(['EARN', 'SPEND']),
  reason: z.string().min(1).max(100)
})

export async function updateCoins(
  userEmail: string, 
  amount: number, 
  type: 'EARN' | 'SPEND', 
  reason: string
) {
  // Session validation
  const session = await getServerSession()
  if (!session?.user?.email) {
    throw new AuthorizationError('Not authenticated')
  }

  // Authorization check - only allow users to update their own coins
  // or admins to update anyone's coins (you might want to add admin role check)
  if (session.user.email !== userEmail) {
    throw new AuthorizationError('Not authorized to update coins for this user')
  }

  // Input validation
  try {
    UpdateCoinsInput.parse({ amount, type, reason })
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid input: ${error.errors.map(e => e.message).join(', ')}`)
    }
    throw error
  }
  
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  })

  if (!user) {
    throw new AuthorizationError('User not found')
  }

  // Additional validation for SPEND operations
  if (type === 'SPEND') {
    if (user.coins < amount) {
      throw new Error('Insufficient coins')
    }
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: {
        coins: type === 'EARN' ? { increment: amount } : { decrement: amount },
        coinTransactions: {
          create: {
            amount,
            type,
            reason,
          },
        },
      },
    })

    await logUserActivity(
      updatedUser.id, 
      `Coins ${type.toLowerCase()}ed`, 
      `Amount: ${amount}, Reason: ${reason}`
    )

    revalidatePath('/dashboard')
    revalidatePath('/profile')

    return updatedUser.coins
  } catch (error) {
    console.error('Error updating coins:', error)
    throw new Error('Failed to update coins')
  }
}

export async function getUserCoins(email: string): Promise<number> {
  const session = await getServerSession()
  if (!session?.user?.email) {
    throw new AuthorizationError('Not authenticated')
  }

  // Users can only view their own coins
  if (session.user.email !== email) {
    throw new AuthorizationError('Not authorized to view this user\'s coins')
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { coins: true },
  })

  if (!user) {
    throw new AuthorizationError('User not found')
  }

  return user.coins
}