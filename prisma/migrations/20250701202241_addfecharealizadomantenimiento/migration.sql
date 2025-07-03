/*
  Warnings:

  - Added the required column `fecharealizado` to the `MantemientoEquipos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MantemientoEquipos" ADD COLUMN     "fecharealizado" TIMESTAMP(3) NOT NULL;
