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
    const info = await transporter.sendMail({
      from: "Dnatahelados <dnatahelados@gmail.com>",
      to: user.email,
      subject: "Dnata - Confirma tu cuenta",
      text: "Dnata - Confirma tu cuenta",
      html: `<p>Hola: ${user.name}, has creado tu cuenta en Dnata, ya casi esta todo listo, solo debes confirmar tu cuenta</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
                <p>E ingresa el código: <b>${user.token}</b></p>
               
            `,
    });
  };

  static sendPasswordResetToken = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: "Dnata <dantahelados@uptask.com>",
      to: user.email,
      subject: "Dnata - Reestablece tu password",
      text: "Dnata - Reestablece tu password",
      html: `<p>Hola: ${user.name}, has solicitado reestablecer tu password.</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Password</a>
                <p>E ingresa el código: <b>${user.token}</b></p>
            `,
    });
  };
}
