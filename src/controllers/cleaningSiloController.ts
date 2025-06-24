import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { endOfDay, isValid, parseISO, startOfDay } from "date-fns";

export const registerLimpiezaSilo = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      date,
      userId,
      silouno,
      silodos,
      clasificadoragranos,
      patiossecado,
      barridoaspirado,
      otrasintervenciones,
      controlplagas,
      insumosutilizados,
      observaciones,
      responsable,
    } = req.body;

    const data = {
      userId,
      date: date.toLocaleString(),
      silouno,
      silodos,
      clasificadoragranos,
      patiossecado,
      barridoaspirado,
      otrasintervenciones,
      controlplagas,
      insumosutilizados,
      observaciones,
      responsable,
    };

    await prisma.limpiezaSilo.create({
      data,
    });

    res.send("Limpieza de silo registrada Correctamente");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al al registrar la limpieza" });
  }
};

export const updateLimpizaSilo = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      date,
      userId,
      silouno,
      silodos,
      clasificadoragranos,
      patiossecado,
      barridoaspirado,
      otrasintervenciones,
      controlplagas,
      insumosutilizados,
      observaciones,
      responsable,
    } = req.body;

    const limpiezaSilo = await prisma.limpiezaSilo.findFirst({
      where: {
        userId,
        id: +req.params.id,
      },
    });
    if (!limpiezaSilo) {
      return res
        .status(404)
        .json({ error: "Registro de limpieza no encontrado" });
    }
    const data = {
      userId,
      date: date.toLocaleString(),
      silouno,
      silodos,
      clasificadoragranos,
      patiossecado,
      barridoaspirado,
      otrasintervenciones,
      controlplagas,
      insumosutilizados,
      observaciones,
      responsable,
    };
    await prisma.limpiezaSilo.update({
      where: { id: limpiezaSilo.id },
      data,
    });
    res.send("Limpieza de silo actualizada Correctamente");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al actualizar la limpieza" });
  }
};

export const getLimpiezaSiloById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const limpiezaSiloId = req.params.id;
  try {
    const limpieza = await prisma.limpiezaSilo.findFirst({
      where: { id: +limpiezaSiloId },
    });

    if (!limpieza) {
      return res
        .status(404)
        .json({ error: "Registro de limpieza no encontrado" });
    }
    res.status(200).json(limpieza);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener la limpieza" });
  }
};

export const getLimpiezaByDate = async (
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
    };
    // if (req.user.id !== "") {
    //   whereClause.userId = req.user.id;
    // }

    const limpieza = await prisma.limpiezaSilo.findMany({
      where: whereClause,
      orderBy: {
        date: "desc",
      },
    });
    console.log(limpieza);
    if (!limpieza) {
      return res
        .status(404)
        .json({ error: "Registros de limpiezas no encontrado" });
    }
    res.send(limpieza);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener la limpieza" });
  }
};

export const deleteLimpieza = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const limpiezaId = +req.params.id;
    const limpieza = await prisma.limpiezaSilo.findUnique({
      where: { id: limpiezaId },
    });
    if (!limpieza) {
      return res
        .status(404)
        .json({ error: "Registro de limpieza no encontrado" });
    }

    await prisma.limpiezaSilo.delete({
      where: { id: limpiezaId },
    });

    res.send("Registro de limpieza eliminado correctamente");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al eliminar la limpieza" });
  }
};
