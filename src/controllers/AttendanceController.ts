import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { endOfDay, isValid, parseISO, startOfDay } from "date-fns";

export const registerMorning = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user.id;
    const { tipo, ubicacion, anotaciones } = req.body;

    const now = new Date();
    const dateOnly = startOfDay(now);

    const attendance = await prisma.attendance.findFirst({
      where: { userId, date: dateOnly },
    });

    if (tipo === "entrada") {
      if (attendance?.morningIn) {
        return res
          .status(400)
          .json({ error: "Ya registraste la entrada de la mañana" });
      }

      if (attendance) {
        await prisma.attendance.update({
          where: { id: attendance.id },
          data: {
            morningIn: now,
            morningInLocation: ubicacion,
            anotacionesMorning: anotaciones,
          },
        });
      } else {
        await prisma.attendance.create({
          data: {
            userId,
            date: dateOnly,
            morningIn: now,
            morningInLocation: ubicacion,
            anotacionesMorning: anotaciones,
          },
        });
      }

      return res.json("Entrada mañana registrada Correctamente");
    }

    if (tipo === "salida") {
      if (!attendance?.morningIn) {
        return res
          .status(400)
          .json({ error: "Primero debes registrar la entrada de la mañana" });
      }

      if (attendance?.morningOut) {
        return res
          .status(400)
          .json({ error: "Ya registraste la salida de la mañana" });
      }

      await prisma.attendance.update({
        where: { id: attendance.id },
        data: {
          morningOut: now,
          morningOutLocation: ubicacion,
        },
      });

      return res.json("Salida mañana registrada Correctamente");
    }

    res.status(400).json({ error: "Tipo inválido" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const registerAfternoon = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user.id;
    const { tipo, ubicacion, anotaciones } = req.body;

    const now = new Date();
    const dateOnly = startOfDay(now);

    const attendance = await prisma.attendance.findFirst({
      where: { userId, date: dateOnly },
    });

    if (tipo === "entrada") {
      if (attendance?.afternoonIn) {
        return res
          .status(400)
          .json({ error: "Ya registraste la entrada de la tarde" });
      }

      if (attendance) {
        await prisma.attendance.update({
          where: { id: attendance.id },
          data: {
            afternoonIn: now,
            afternoonInLocation: ubicacion,
            anotacionesAfternoon: anotaciones,
          },
        });
      } else {
        await prisma.attendance.create({
          data: {
            userId,
            date: dateOnly,
            afternoonIn: now,
            afternoonInLocation: ubicacion,
            anotacionesAfternoon: anotaciones,
          },
        });
      }

      return res.json("Entrada tarde registrada Correctamente");
    }

    if (tipo === "salida") {
      // if (!attendance?.afternoonIn) {
      //   return res
      //     .status(400)
      //     .json({ error: "Primero debes registrar la entrada de la tarde" });
      // }

      if (attendance?.afternoonOut) {
        return res
          .status(400)
          .json({ error: "Ya registraste la salida de la tarde" });
      }

      await prisma.attendance.update({
        where: { id: attendance.id },
        data: {
          afternoonOut: now,
          afternoonOutLocation: ubicacion,
          anotacionesAfternoon: anotaciones,
        },
      });

      return res.json("salida tarde registrada Correctamente");
    }

    res.status(400).json({ error: "Tipo inválido" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getAttendandesUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const attendances = await prisma.attendance.findFirst({
      where: {
        userId: req.user.id,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(attendances);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getAttendanceHistoryMonth = async (
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
      userId: req.user.id,
    };
    if (req.user.id !== "") {
      whereClause.userId = req.user.id;
    }
    const attendances = await prisma.attendance.findMany({
      where: whereClause,
      orderBy: {
        date: "desc",
      },
    });
    res.status(200).json(attendances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getAttendanceHistoryAll = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { fecha } = req.query;
    if (!fecha) {
      return res.status(400).json({
        message: "La fecha es obligatoria",
      });
    }
    const startDate = parseISO(fecha as string);
    if (!isValid(startDate)) {
      return res.status(400).json({
        message: "La fecha proporcionada no es válida",
      });
    }
    const startOfDayDate = startOfDay(startDate);
    const endOfDayDate = endOfDay(startDate);

    const attendances = await prisma.attendance.findMany({
      where: {
        date: {
          gte: startOfDayDate,
          lte: endOfDayDate,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
            cargo: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
    res.send(attendances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
