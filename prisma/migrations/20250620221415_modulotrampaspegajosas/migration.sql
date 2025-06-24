-- CreateTable
CREATE TABLE "TrampasPegajosas" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "lugarcolocacion" TEXT,
    "tipotrampa" TEXT,
    "cantidadtrampas" TEXT,
    "plagamonitor" TEXT,
    "fecharecambio" TIMESTAMP(3),
    "imagenes" JSONB,

    CONSTRAINT "TrampasPegajosas_pkey" PRIMARY KEY ("id")
);
