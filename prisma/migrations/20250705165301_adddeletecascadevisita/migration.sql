-- DropForeignKey
ALTER TABLE "SolicitudVisita" DROP CONSTRAINT "SolicitudVisita_userId_fkey";

-- AddForeignKey
ALTER TABLE "SolicitudVisita" ADD CONSTRAINT "SolicitudVisita_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
