import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { endOfDay, isValid, parseISO, startOfDay } from "date-fns";

export const registerEquimentCleaning = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
