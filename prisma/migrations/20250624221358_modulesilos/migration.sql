-- CreateEnum
CREATE TYPE "controlPlagas" AS ENUM ('PREVENTIVO', 'CORRECTIVO');

-- CreateTable
CREATE TABLE "LimpiezaSilo" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "silouno" BOOLEAN,
    "silodos" BOOLEAN,
    "clasificadoragranos" BOOLEAN,
    "patiossecado" BOOLEAN,
    "barridoaspirado" BOOLEAN,
    "otrasintervenciones" TEXT,
    "controlplagas" "controlPlagas" NOT NULL,
    "insumosutilizados" TEXT NOT NULL,
    "observaciones" TEXT NOT NULL,
    "responsable" TEXT NOT NULL,

    CONSTRAINT "LimpiezaSilo_pkey" PRIMARY KEY ("id")
);
