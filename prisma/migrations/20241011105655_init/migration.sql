/*
  Warnings:

  - You are about to drop the column `content` on the `Critique` table. All the data in the column will be lost.
  - Added the required column `emotionalResponse` to the `Critique` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genreFit` to the `Critique` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagery` to the `Critique` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overallImpression` to the `Critique` table without a default value. This is not possible if the table is not empty.
  - Added the required column `standoutElements` to the `Critique` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Critique` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Critique" DROP COLUMN "content",
ADD COLUMN     "arrangement" INTEGER,
ADD COLUMN     "emotionalResponse" TEXT NOT NULL,
ADD COLUMN     "genreFit" TEXT NOT NULL,
ADD COLUMN     "imagery" TEXT NOT NULL,
ADD COLUMN     "masteringLoudness" INTEGER,
ADD COLUMN     "mixingQuality" INTEGER,
ADD COLUMN     "overallImpression" TEXT NOT NULL,
ADD COLUMN     "soundDesign" INTEGER,
ADD COLUMN     "standoutElements" TEXT NOT NULL,
ADD COLUMN     "technicalSummary" TEXT,
ADD COLUMN     "tonalBalance" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT;
