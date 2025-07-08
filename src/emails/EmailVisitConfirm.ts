import dotenv from "dotenv";
import { resend } from "../config/resend";
import { SolicitudVisita } from "@prisma/client";
dotenv.config();

interface IVisit {
  email: string;
  name: string;
  estado: string;
  visita: SolicitudVisita;
}

export class ConfirmVisit {
  static sendConfirmationVisit = async (user: IVisit) => {
    const send = await resend.emails.send({
      from: "Asoseynekun <asoseynekun@gruposeynekun.com>",
      to: user.email,
      subject: "Confirmación de Visita Programada",
      text: `Hola ${user.name}, tu visita ha sido ${user.estado}. Revisa los detalles en el correo.`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #1B5040;">Confirmación de Visita</h2>
          <p>Estimado/a <strong>${user.name}</strong>,</p>

          <p>Tu solicitud de visita ha sido <strong>${user.estado.toUpperCase()}</strong>. A continuación, te compartimos los detalles:</p>

          <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Municipio:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${user.visita.municipio}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Fecha de Solicitud:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${user.visita.dia}/${user.visita.mes}/${user.visita.anio}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Fecha de Visita:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${user.visita.fechaVisitaDia}/${user.visita.fechaVisitaMes}/${user.visita.fechaVisitaAnio}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Horario:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${user.visita.horaInicio} - ${user.visita.horaFin}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Dependencia:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${user.visita.dependencia}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Objeto de la visita:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${user.visita.objeto}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Material a ingresar:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${user.visita.material}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Estado:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${user.visita.evaluacion}</td>
            </tr>
          </table>

          <p style="margin-top: 20px;">Si tienes alguna duda o necesitas modificar tu visita, por favor contáctanos.</p>

          <p style="margin-top: 20px;">Saludos cordiales,<br><strong>Equipo Asoseynekun</strong></p>

          <hr style="margin-top: 20px;">
          <p style="font-size: 12px; color: #888;">Este es un correo automático, por favor no respondas a este mensaje.</p>
        </div>
      `,
    });
    console.log(send);
  };
}
