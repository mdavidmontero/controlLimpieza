/*
  Warnings:

  - Added the required column `userId` to the `SolicitudVisita` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SolicitudVisita" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SolicitudVisita" ADD CONSTRAINT "SolicitudVisita_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
