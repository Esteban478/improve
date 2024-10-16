'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { AuthorizationError } from '@/types/errors'

export async function updateCoins(userId: string, amount: number, type: 'EARN' | 'SPEND', reason: string) {
  console.log(`Updating coins for user ${userId}: ${type} ${amount} coins for ${reason}`);
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    console.error(`User not found for ID: ${userId}`);
    throw new AuthorizationError('User not found')
  }

  if (type === 'SPEND' && user.coins < amount) {
    throw new Error('Insufficient coins')
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
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

  console.log(`Updated coins for user ${userId}: new balance ${updatedUser.coins}`);

  revalidatePath('/dashboard')
  revalidatePath('/profile')

  return updatedUser.coins
}

export async function getUserCoins(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { coins: true },
  })

  if (!user) {
    throw new AuthorizationError('User not found')
  }

  return user.coins
}