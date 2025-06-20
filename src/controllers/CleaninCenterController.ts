import { Request, Response } from "express";
import { prisma } from "../config/prisma";

import formidable from "formidable";
import { v4 as uuid } from "uuid";
import cloudinary from "../config/cloudinary";
import { endOfDay, isValid, parseISO, startOfDay } from "date-fns";

export const registerLimpiezaAcopio = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      date,
      userId,
      baños,
      zonaSecadoras,
      patiosMarquesinas,
      oficinas,
      recepcion,
      cafetería,
      labcacao,
      labcafe,
      labrones,
      casahospedaje,
      aspirado,
      limpiezapisos,
      dispobasuras,
      barridopisos,
      limpiezasuperficies,
      lavadosuperficies,
      lavadoparedes,
      lavadopisos,
      controlplagas,
      limpiezaparedes,
      responsable,
      insumosutilizados,
    } = req.body;

    // const limpiezaAcopio = await prisma.limpiezaAcopio.findFirst({
    //   where: {
    //     userId,
    //     date: date,
    //   },
    // });

    // if (limpiezaAcopio) {
    //   const error = new Error("Ya registraste la limpieza de acopio");
    //   return res.status(409).json({ error: error.message });
    // }

    const data = {
      userId,
      date: date.toLocaleString(),
      baños,
      zonaSecadoras,
      patiosMarquesinas,
      oficinas,
      recepcion,
      cafetería,
      labcacao,
      labcafe,
      labrones,
      casahospedaje,
      aspirado,
      limpiezapisos,
      dispobasuras,
      barridopisos,
      limpiezasuperficies,
      lavadosuperficies,
      lavadoparedes,
      lavadopisos,
      controlplagas,
      limpiezaparedes,
      responsable,
      insumosutilizados,
    };

    await prisma.limpiezaAcopio.create({
      data,
    });

    res.send("Limpieza de acopio registrada Correctamente");
  } catch (error) {}
};

export const updateLimpiezaAcopio = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      date,
      userId,
      baños,
      zonaSecadoras,
      patiosMarquesinas,
      oficinas,
      recepcion,
      cafetería,
      labcacao,
      labcafe,
      labrones,
      casahospedaje,
      aspirado,
      limpiezapisos,
      dispobasuras,
      barridopisos,
      limpiezasuperficies,
      lavadosuperficies,
      lavadoparedes,
      lavadopisos,
      controlplagas,
      limpiezaparedes,
      responsable,
      insumosutilizados,
    } = req.body;

    const limpiezaAcopio = await prisma.limpiezaAcopio.findFirst({
      where: {
        userId,
        id: +req.params.id,
      },
    });

    if (!limpiezaAcopio) {
      return res
        .status(404)
        .json({ error: "Registro de limpieza no encontrado" });
    }

    const data = {
      userId,
      date: date.toLocaleString(),
      baños,
      zonaSecadoras,
      patiosMarquesinas,
      oficinas,
      recepcion,
      cafetería,
      labcacao,
      labcafe,
      labrones,
      casahospedaje,
      aspirado,
      limpiezapisos,
      dispobasuras,
      barridopisos,
      limpiezasuperficies,
      lavadosuperficies,
      lavadoparedes,
      lavadopisos,
      controlplagas,
      limpiezaparedes,
      responsable,
      insumosutilizados,
    };

    await prisma.limpiezaAcopio.update({
      where: { id: limpiezaAcopio.id },
      data,
    });

    res.send("Limpieza de acopio actualizada Correctamente");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la limpieza" });
  }
};

export const uploadImagesLimpieza = async (req: Request, res: Response) => {
  const limpiezaId = parseInt(req.params.id);

  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err)
      return res.status(500).json({ error: "Error al parsear el formulario" });

    const fileArray = Array.isArray(files.file) ? files.file : [files.file];

    try {
      const uploads = await Promise.all(
        fileArray.map((file: any) =>
          cloudinary.uploader.upload(file.filepath, {
            public_id: uuid(),
          })
        )
      );
      const limpieza = await prisma.limpiezaAcopio.findUnique({
        where: { id: limpiezaId },
      });
      const currentImages = Array.isArray(limpieza?.imagenes)
        ? limpieza.imagenes
        : [];

      const newImages = uploads.map((img) => ({
        url: img.secure_url,
        public_id: img.public_id,
      }));

      const updatedImages = [...currentImages, ...newImages];

      await prisma.limpiezaAcopio.update({
        where: { id: limpiezaId },
        data: {
          imagenes: updatedImages,
        },
      });

      res.json({ images: updatedImages });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Error al subir imágenes" });
    }
  });
};

export const getLimpiezaById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const limpiezaId = req.params.id;

  try {
    const limpieza = await prisma.limpiezaAcopio.findFirst({
      where: { id: +limpiezaId },
    });

    if (!limpieza) {
      return res
        .status(404)
        .json({ error: "Registro de limpieza no encontrado" });
    }

    res.status(200).json(limpieza);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la limpieza" });
  }
};

export const getLimpiezaByDateActual = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({
        message: "La fecha de inicio y la de fin son obligatorias",
      });
    }
    const startDate = parseISO(from as string);
    const endDate = parseISO(to as string);
    if (!isValid(startDate) || !isValid(endDate)) {
      return res.status(400).json({
        message: "Las fechas proporcionadas no son válidas",
      });
    }
    const startOfDayDate = startOfDay(startDate);
    const endOfDayDate = endOfDay(endDate);
    const whereClause: any = {
      date: {
        gte: startOfDayDate,
        lte: endOfDayDate,
      },
      // userId: req.user.id,
    };
    if (req.user.id !== "") {
      whereClause.userId = req.user.id;
    }

    const limpieza = await prisma.limpiezaAcopio.findMany({
      where: whereClause,
      orderBy: {
        date: "desc",
      },
    });
    if (!limpieza) {
      return res
        .status(404)
        .json({ error: "Registro de limpieza no encontrado" });
    }
    res.send(limpieza);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la limpieza" });
  }
};

export const deleteImageLimpieza = async (req: Request, res: Response) => {
  const limpiezaId = parseInt(req.params.id);
  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({ error: "Falta el public_id" });
  }

  try {
    await cloudinary.uploader.destroy(public_id);

    const limpieza = await prisma.limpiezaAcopio.findUnique({
      where: { id: limpiezaId },
    });

    if (!limpieza) {
      return res
        .status(404)
        .json({ error: "Registro de limpieza no encontrado" });
    }

    const currentImages = Array.isArray(limpieza.imagenes)
      ? limpieza.imagenes
      : [];

    const updatedImages = currentImages.filter(
      (img: any) => img.public_id !== public_id
    );

    await prisma.limpiezaAcopio.update({
      where: { id: limpiezaId },
      data: { imagenes: updatedImages },
    });

    return res.json({ images: updatedImages });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al eliminar imagen" });
  }
};
