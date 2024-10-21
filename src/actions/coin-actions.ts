'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { AuthorizationError } from '@/types/errors'
import { logUserActivity } from '@/lib/statistics-utils'

export async function updateCoins(userEmail: string, amount: number, type: 'EARN' | 'SPEND', reason: string) {
  // console.log(`Updating coins for user ${userId}: ${type} ${amount} coins for ${reason}`);
  
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  })

  if (!user) {
    console.error(`User not found for email: ${userEmail}`);
    throw new AuthorizationError('User not found')
  }

  if (type === 'SPEND' && user.coins < amount) {
    throw new Error('Insufficient coins')
  }

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

  await logUserActivity(updatedUser.id, `Coins ${type.toLowerCase()}ed`, `Amount: ${amount}, Reason: ${reason}`)

  revalidatePath('/dashboard')
  revalidatePath('/profile')

  return updatedUser.coins
}

export async function getUserCoins(email: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { coins: true },
  })

  if (!user) {
    throw new AuthorizationError('User not found')
  }

  return user.coins
}