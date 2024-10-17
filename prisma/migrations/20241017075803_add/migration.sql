-- AlterTable
ALTER TABLE "Critique" ADD COLUMN     "ratedAt" TIMESTAMP(3),
ADD COLUMN     "ratedBy" TEXT,
ADD COLUMN     "rating" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "sumOfRatingsReceived" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalCritiquesGiven" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalRatingsReceived" INTEGER NOT NULL DEFAULT 0;
