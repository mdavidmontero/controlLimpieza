-- CreateTable
CREATE TABLE "LimpiezaAcopio" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "baños" BOOLEAN,
    "zonaSecadoras" BOOLEAN,
    "patiosMarquesinas" BOOLEAN,
    "oficinas" BOOLEAN,
    "recepcion" BOOLEAN,
    "cafetería" BOOLEAN,
    "labcacao" BOOLEAN,
    "labcafe" BOOLEAN,
    "labrones" BOOLEAN,
    "casahospedaje" BOOLEAN,
    "aspirado" BOOLEAN,
    "limpiezapisos" BOOLEAN,
    "dispobasuras" BOOLEAN,
    "barridopisos" BOOLEAN,
    "limpiezasuperficies" BOOLEAN,
    "lavadosuperficies" BOOLEAN,
    "lavadoparedes" BOOLEAN,
    "responsable" TEXT NOT NULL,
    "insumosutilizados" TEXT NOT NULL,

    CONSTRAINT "LimpiezaAcopio_pkey" PRIMARY KEY ("id")
);
