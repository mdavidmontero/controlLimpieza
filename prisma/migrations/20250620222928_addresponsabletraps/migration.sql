/*
  Warnings:

  - Added the required column `responsable` to the `TrampasPegajosas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TrampasPegajosas" ADD COLUMN     "responsable" TEXT NOT NULL;
