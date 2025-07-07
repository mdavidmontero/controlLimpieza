-- DropForeignKey
ALTER TABLE "AsistenteVisita" DROP CONSTRAINT "AsistenteVisita_solicitudId_fkey";

-- DropForeignKey
ALTER TABLE "SolicitudVisita" DROP CONSTRAINT "SolicitudVisita_userId_fkey";

-- AddForeignKey
ALTER TABLE "SolicitudVisita" ADD CONSTRAINT "SolicitudVisita_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsistenteVisita" ADD CONSTRAINT "AsistenteVisita_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "SolicitudVisita"("id") ON DELETE CASCADE ON UPDATE CASCADE;
