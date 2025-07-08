import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { endOfDay, isValid, parseISO, startOfDay } from "date-fns";
import { supabase } from "../config/supabase";
import fs from "fs";
import { v4 as uuid } from "uuid";
import formidable from "formidable";
import { AsistenteVisita } from "@prisma/client";

export const registerVisit = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      municipio,
      dia,
      mes,
      anio,
      nombres,
      empresa,
      area,
      email,
      telefono,
      fechaVisitaDia,
      fechaVisitaMes,
      fechaVisitaAnio,
      horaInicio,
      horaFin,
      dependencia,
      objeto,
      material,
      evaluacion,
      asistentes,
      documentVisit,
    } = req.body;

    await prisma.solicitudVisita.create({
      data: {
        municipio,
        dia,
        mes,
        anio,
        nombres,
        empresa,
        area,
        email,
        telefono,
        fechaVisitaDia,
        fechaVisitaMes,
        fechaVisitaAnio,
        horaInicio,
        horaFin,
        dependencia,
        objeto,
        material,
        evaluacion,
        asistentes: {
          create: asistentes.map((asistente: AsistenteVisita) => ({
            nombres: asistente.nombres,
            tipoDocumento: asistente.tipoDocumento,
            numeroDocumento: asistente.numeroDocumento,
            dependencia: asistente.dependencia,
          })),
        },
        documentVisit,
        userId: req.user.id,
      },
    });

    res.send(
      "se le informara por correo electrónico el resultado, en cuanto se acepte se le enviará un documento con el registro de la visita"
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error al registrar visita" });
  }
};

export const updateVisit = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      municipio,
      dia,
      mes,
      anio,
      nombres,
      empresa,
      area,
      email,
      telefono,
      fechaVisitaDia,
      fechaVisitaMes,
      fechaVisitaAnio,
      horaInicio,
      horaFin,
      dependencia,
      objeto,
      material,
      evaluacion,
      asistentes,
      documentVisit,
    } = req.body;

    const visitExist = await prisma.solicitudVisita.findFirst({
      where: {
        id: +req.params.id,
      },
    });

    if (!visitExist) {
      return res.status(404).json({ message: "Visita no encontrada" });
    }

    const data = {
      municipio,
      dia,
      mes,
      anio,
      nombres,
      empresa,
      area,
      email,
      telefono,
      fechaVisitaDia,
      fechaVisitaMes,
      fechaVisitaAnio,
      horaInicio,
      horaFin,
      dependencia,
      objeto,
      material,
      evaluacion,
      asistentes,
      documentVisit,
      userId: req.user.id,
    };
    await prisma.solicitudVisita.update({
      where: { id: visitExist.id },
      data,
    });

    res.send("Visita actualizada Correctamente");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar la visita" });
  }
};

export const updateStatusVisit = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id, evaluacion } = req.body;
    const visitExist = await prisma.solicitudVisita.findFirst({
      where: {
        id: +id,
      },
    });
    if (!visitExist) {
      return res.status(404).json({ message: "Visita no encontrada" });
    }

    await prisma.solicitudVisita.update({
      where: { id: visitExist.id },
      data: {
        evaluacion,
      },
    });
    res.send("Estado de la visita actualizado Correctamente");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar el estado de la visita" });
  }
};

export const getVisitCenterByUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const visits = await prisma.solicitudVisita.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        asistentes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las visitas" });
  }
};

export const getVisitById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const visit = await prisma.solicitudVisita.findFirst({
      where: { id: +id },
    });

    if (!visit) {
      return res.status(404).json({ message: "Visita no encontrada" });
    }
    res.status(200).json(visit);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la visita" });
  }
};

export const getVisitByDate = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { from, to, empresa, limit = "10", offset = "0" } = req.query;

    const whereClause: any = {};

    if (from && to) {
      const startDate = parseISO(from as string);
      const endDate = parseISO(to as string);

      if (!isValid(startDate) || !isValid(endDate)) {
        return res.status(400).json({
          message: "Las fechas proporcionadas no son válidas",
        });
      }

      whereClause.createdAt = {
        gte: startOfDay(startDate),
        lte: endOfDay(endDate),
      };
    }

    if (empresa) {
      whereClause.empresa = {
        contains: empresa as string,
        mode: "insensitive",
      };
    }

    const take = parseInt(limit as string, 10);
    const skip = parseInt(offset as string, 10);

    const total = await prisma.solicitudVisita.count({
      where: whereClause,
    });

    const visits = await prisma.solicitudVisita.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      take,
      skip,
    });

    const totalPages = Math.ceil(total / take);
    const currentPage = Math.floor(skip / take) + 1;

    res.json({
      total,
      limit: take,
      offset: skip,
      totalPages,
      currentPage,
      nextOffset: skip + take < total ? skip + take : null,
      prevOffset: skip - take >= 0 ? skip - take : null,
      data: visits,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las visitas" });
  }
};

export const deleteVisit = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const visit = await prisma.solicitudVisita.findFirst({
      where: { id: +id },
    });

    if (!visit) {
      return res.status(404).json({ message: "Visita no encontrada" });
    }

    await prisma.solicitudVisita.delete({
      where: { id: visit.id },
    });

    res.send("Visita eliminada Correctamente");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la visita" });
  }
};

export const uploadPdf = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const form = formidable({
    multiples: false,
  });

  try {
    form.parse(req, async (error, fields, files) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al procesar el archivo" });
      }

      const file = files.file;
      if (!file || !file[0]) {
        return res.status(400).json({ error: "Archivo no encontrado" });
      }

      const filePath = file[0].filepath;
      const fileName = `${uuid()}.pdf`;

      const fileBuffer = fs.readFileSync(filePath);

      const { data, error: uploadError } = await supabase.storage
        .from("serviciosgenerales")
        .upload(fileName, fileBuffer, {
          contentType: file[0].mimetype || "application/pdf",
        });

      if (uploadError) {
        console.error(uploadError);
        return res
          .status(500)
          .json({ error: "Error al subir el archivo a Supabase" });
      }

      const { data: publicUrlData } = supabase.storage
        .from("serviciosgenerales")
        .getPublicUrl(fileName);

      res.json({
        file: publicUrlData.publicUrl,
      });
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error inesperado" });
  }
};

export const generatePdfVisit = () => {};
