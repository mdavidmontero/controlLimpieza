import { transporter } from "../config/nodemailer";
import dotenv from "dotenv";
dotenv.config();

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    await transporter.sendMail({
      from: "Asoseynekun <asoseynekun@gmail.com>",
      to: user.email,
      subject: "Seynekun - Confirma tu cuenta",
      text: "Seynekun - Confirma tu cuenta",
      html: `<p>Hola: ${user.name}, has creado tu cuenta en Seynekun, ya casi esta todo listo, solo debes confirmar tu cuenta</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
                <p>E ingresa el código: <b>${user.token}</b></p>
               
            `,
    });
  };

  static sendPasswordResetToken = async (user: IEmail) => {
    await transporter.sendMail({
      from: "Seynekun <asoseynekun@gmail.com>",
      to: user.email,
      subject: "Seynekun - Reestablece tu password",
      text: "Seynekun - Reestablece tu password",
      html: `<p>Hola: ${user.name}, has solicitado reestablecer tu password.</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Password</a>
                <p>E ingresa el código: <b>${user.token}</b></p>
            `,
    });
  };
}
