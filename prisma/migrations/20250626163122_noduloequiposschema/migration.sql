-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('BUENO', 'REGULAR', 'MALO', 'DESARMADO');

-- CreateEnum
CREATE TYPE "Mantenimiento" AS ENUM ('PREVENTIVO', 'CORRECTIVO', 'INSTALACION', 'DESMONTAJE');

-- CreateTable
CREATE TABLE "MantemientoEquipos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "nroserie" TEXT,
    "fechacompra" TIMESTAMP(3) NOT NULL,
    "nroplaca" TEXT,
    "referencia" TEXT,
    "potencia" TEXT,
    "area" TEXT NOT NULL,
    "estado" "Estado" NOT NULL,
    "descripcionsituacion" TEXT NOT NULL,
    "mantenimiento" "Mantenimiento" NOT NULL,
    "descripcionmantemiento" TEXT NOT NULL,
    "falla" TEXT NOT NULL,
    "descripcionfalla" TEXT NOT NULL,
    "proximomantenimiento" TIMESTAMP(3) NOT NULL,
    "motivomantenimiento" TEXT NOT NULL,

    CONSTRAINT "MantemientoEquipos_pkey" PRIMARY KEY ("id")
);
