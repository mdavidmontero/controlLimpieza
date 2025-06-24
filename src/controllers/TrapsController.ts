import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { v4 as uuid } from "uuid";
import { endOfDay, isValid, parseISO, startOfDay } from "date-fns";
import cloudinary from "../config/cloudinary";
import formidable from "formidable";

export const registerTraps = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      fecha,
      lugarcolocacion,
      tipotrampa,
      cantidadtrampas,
      plagamonitor,
      fecharecambio,
      imagenes,
      responsable,
    } = req.body;

    const data = {
      fecha,
      lugarcolocacion,
      tipotrampa,
      cantidadtrampas,
      plagamonitor,
      fecharecambio,
      imagenes,
      responsable,
    };

    await prisma.trampasPegajosas.create({
      data,
    });

    return res.json("Trampas pegajosas registradas Correctamente");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getTraps = async (req: Request, res: Response) => {
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
    };
    if (req.user.id !== "") {
      whereClause.userId = req.user.id;
    }

    const traps = await prisma.trampasPegajosas.findMany({
      where: whereClause,
      orderBy: {
        fecha: "desc",
      },
    });
    res.status(200).json(traps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updateTraps = async (req: Request, res: Response) => {
  try {
    const {
      fecha,
      lugarcolocacion,
      tipotrampa,
      cantidadtrampas,
      plagamonitor,
      fecharecambio,
      imagenes,
    } = req.body;

    const data = {
      fecha,
      lugarcolocacion,
      tipotrampa,
      cantidadtrampas,
      plagamonitor,
      fecharecambio,
      imagenes,
    };

    const controlTramps = await prisma.trampasPegajosas.findFirst({
      where: {
        id: +req.params.id,
      },
    });
    if (!controlTramps) {
      return res
        .status(404)
        .json({ error: "Registro de traps pegajosas no encontrado" });
    }

    await prisma.trampasPegajosas.update({
      where: { id: +req.params.id },
      data,
    });

    return res.json("Trampas pegajosas actualizadas Correctamente");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const deleteTraps = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.trampasPegajosas.delete({
      where: { id: +id },
    });

    return res.json("Trampas pegajosas eliminadas Correctamente");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getTrapsById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const traps = await prisma.trampasPegajosas.findUnique({
      where: { id: +id },
    });

    if (!traps) {
      return res
        .status(404)
        .json({ error: "Registro de traps pegajosas no encontrado" });
    }

    res.status(200).json(traps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const uploadImagesTraps = async (req: Request, res: Response) => {
  const trapsId = parseInt(req.params.id);

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
      const traps = await prisma.trampasPegajosas.findUnique({
        where: { id: trapsId },
      });
      const currentImages = Array.isArray(traps?.imagenes)
        ? traps.imagenes
        : [];

      const newImages = uploads.map((img) => ({
        url: img.secure_url,
        public_id: img.public_id,
      }));

      const updatedImages = [...currentImages, ...newImages];

      await prisma.trampasPegajosas.update({
        where: { id: trapsId },
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
