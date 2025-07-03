-- CreateEnum
CREATE TYPE "Evaluacion" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- CreateTable
CREATE TABLE "SolicitudVisita" (
    "id" SERIAL NOT NULL,
    "municipio" TEXT NOT NULL,
    "dia" TEXT NOT NULL,
    "mes" TEXT NOT NULL,
    "anio" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "fechaVisitaDia" TEXT NOT NULL,
    "fechaVisitaMes" TEXT NOT NULL,
    "fechaVisitaAnio" TEXT NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "dependencia" TEXT NOT NULL,
    "objeto" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "evaluacion" "Evaluacion" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolicitudVisita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsistenteVisita" (
    "id" SERIAL NOT NULL,
    "nombres" TEXT NOT NULL,
    "tipoDocumento" TEXT NOT NULL,
    "numeroDocumento" TEXT NOT NULL,
    "dependencia" TEXT NOT NULL,
    "solicitudId" INTEGER NOT NULL,

    CONSTRAINT "AsistenteVisita_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AsistenteVisita" ADD CONSTRAINT "AsistenteVisita_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "SolicitudVisita"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
