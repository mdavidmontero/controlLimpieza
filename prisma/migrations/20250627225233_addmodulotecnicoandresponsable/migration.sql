/*
  Warnings:

  - Added the required column `responsable` to the `MantemientoEquipos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tecnico` to the `MantemientoEquipos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MantemientoEquipos" ADD COLUMN     "responsable" TEXT NOT NULL,
ADD COLUMN     "tecnico" TEXT NOT NULL;
