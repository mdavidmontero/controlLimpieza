import formidable, { File as FormidableFile, Fields, Files } from "formidable";
import fs from "fs";
import { Request, Response } from "express";
import { config } from "dotenv";
import { resend } from "../config/resend";

config();

export const sendPDF = async (req: Request, res: Response): Promise<void> => {
  const form = formidable({ multiples: false });

  form.parse(req, async (err: any, fields: Fields, files: Files) => {
    if (err) {
      res.status(500).json({ error: "Error procesando archivo" });
      return;
    }

    const uploadedFile = files.file;

    if (!uploadedFile) {
      res.status(400).json({ error: "Archivo no válido" });
      return;
    }

    const file: FormidableFile = Array.isArray(uploadedFile)
      ? uploadedFile[0]
      : uploadedFile;

    const content = fs.readFileSync(file.filepath);

    try {
      await resend.emails.send({
        from: `Reporte Asistencia del dia ${new Date().toLocaleDateString()} <asoseynekun@gruposeynekun.com>`,
        to: "mdavidmontero6@gmail.com",
        subject: "Tu reporte PDF",
        html: "<p>Adjunto encontrarás el reporte de la asistencia del dia de hoy</p>",
        attachments: [
          {
            filename: "reporte-asistencia.pdf",
            content: content, // Buffer directo
          },
        ],
      });

      res.send("Correo enviado correctamente, revisa tu bandeja de entrada");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error al enviar el correo" });
    }
  });
};
