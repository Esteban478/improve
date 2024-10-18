'use server'

import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { AuthorizationError } from "@/types/errors";
import { updateCoins } from "./coin-actions";
import { updateUserStatistics } from "./user-actions";

export async function submitRating(formData: FormData) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    throw new AuthorizationError("You must be logged in to submit a rating.");
  }

  const critiqueId = formData.get("critiqueId") as string;
  const rating = parseInt(formData.get("rating") as string);

  if (!critiqueId || isNaN(rating) || rating < 1 || rating > 5) {
    throw new Error("Invalid rating submission.");
  }

  // Fetch the critique and associated track
  const critique = await prisma.critique.findUnique({
    where: { id: critiqueId },
    include: { 
      track: {
        include: {
          user: {
            select: {
              email: true
            }
          }
        }
      }, 
      user: true 
    },
  });

  if (!critique) {
    throw new Error("Critique not found.");
  }

  // Check if the current user is the track owner
  if (critique.track.user.email !== session.user.email) {
    throw new AuthorizationError("Only the track owner can rate this critique.");
  }

  // Check if the critique has already been rated
  if (critique.rating !== null) {
    throw new Error("This critique has already been rated.");
  }

  // Update the critique with the rating
  const updatedCritique = await prisma.critique.update({
    where: { id: critiqueId },
    data: {
      rating,
      ratedAt: new Date(),
      ratedBy: session.user.email,
    },
  });

  // Update user statistics
  await updateUserStatistics(critique.user.id, rating);

  // If rating is 4 or 5, award an additional coin
  if (rating >= 4) {
    await updateCoins(critique.user.email!, 1, 'EARN', 'Received high rating on critique');
  }

  revalidatePath(`/tracks/${critique.track.slug}`);
  revalidatePath("/dashboard");

  return updatedCritique;
}