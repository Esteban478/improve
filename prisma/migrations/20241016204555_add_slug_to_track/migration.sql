/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Track` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Track_slug_key" ON "Track"("slug");
