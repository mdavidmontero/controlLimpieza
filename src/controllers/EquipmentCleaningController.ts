import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { endOfDay, isValid, parseISO, startOfDay } from "date-fns";

export const registerEquimentCleaning = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      fecharealizado,
      nombre,
      marca,
      modelo,
      nroserie,
      fechacompra,
      nroplaca,
      referencia,
      potencia,
      area,
      estado,
      descripcionsituacion,
      mantenimiento,
      descripcionmantemiento,
      falla,
      descripcionfalla,
      proximomantenimiento,
      motivomantenimiento,
      tecnico,
      responsable,
    } = req.body;

    const data = {
      fecharealizado,
      nombre,
      marca,
      modelo,
      nroserie,
      fechacompra,
      nroplaca,
      referencia,
      potencia,
      area,
      estado,
      descripcionsituacion,
      mantenimiento,
      descripcionmantemiento,
      falla,
      descripcionfalla,
      proximomantenimiento,
      motivomantenimiento,
      tecnico,
      responsable,
    };
    await prisma.mantemientoEquipos.create({
      data,
    });
    res.send("Mantenimiento equipos registrado correctamente");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updateEquimentCleaning = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      fecharealizado,
      nombre,
      marca,
      modelo,
      nroserie,
      fechacompra,
      nroplaca,
      referencia,
      potencia,
      area,
      estado,
      descripcionsituacion,
      mantenimiento,
      descripcionmantemiento,
      falla,
      descripcionfalla,
      proximomantenimiento,
      motivomantenimiento,
      tecnico,
      responsable,
    } = req.body;
    const limpiezaEquipos = await prisma.mantemientoEquipos.findFirst({
      where: {
        id: +req.params.id,
      },
    });

    if (!limpiezaEquipos) {
      return res
        .status(404)
        .json({ error: "Registro de limpieza no encontrado" });
    }

    const data = {
      fecharealizado,
      nombre,
      marca,
      modelo,
      nroserie,
      fechacompra,
      nroplaca,
      referencia,
      potencia,
      area,
      estado,
      descripcionsituacion,
      mantenimiento,
      descripcionmantemiento,
      falla,
      descripcionfalla,
      proximomantenimiento,
      motivomantenimiento,
      tecnico,
      responsable,
    };

    await prisma.mantemientoEquipos.update({
      where: { id: limpiezaEquipos.id },
      data,
    });
    res.send("Mantenimiento equipos actualizado correctamente");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getEquipmentCleaningById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const limpiezaEquiposId = +req.params.id;

    const limpiezaEquipos = await prisma.mantemientoEquipos.findFirst({
      where: { id: limpiezaEquiposId },
    });
    if (!limpiezaEquipos) {
      return res
        .status(404)
        .json({ error: "Registro de limpieza no encontrado" });
    }
    res.status(200).json(limpiezaEquipos);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getEquipmentCleaningByDateActual = async (
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
      fecharealizado: {
        gte: startOfDayDate,
        lte: endOfDayDate,
      },
    };

    const limpiezaEquipos = await prisma.mantemientoEquipos.findMany({
      where: whereClause,
      orderBy: {
        fecharealizado: "desc",
      },
    });
    if (!limpiezaEquipos) {
      return res
        .status(404)
        .json({ error: "Registro de limpieza no encontrado" });
    }
    res.send(limpiezaEquipos);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const deleteEquipmentCleaning = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const limpiezaEquipoId = +req.params.id;
    const limpiezaEquipo = await prisma.mantemientoEquipos.findFirst({
      where: {
        id: limpiezaEquipoId,
      },
    });
    if (!limpiezaEquipo) {
      return res
        .status(404)
        .json({ error: "Registro de limpieza no encontrado" });
    }
    await prisma.mantemientoEquipos.delete({
      where: {
        id: limpiezaEquipoId,
      },
    });
    res.send("Limpieza de Equipo eliminada Correctamente");
  } catch (error) {}
};
