import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";
import cloudinary from "../config/cloudinary";
import { v4 as uuid } from "uuid";
import formidable from "formidable";
import { AuthEmail } from "../emails/AuthEmail";
import { generateToken } from "../utils/token";

export const createAccount = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, password, name } = req.body;

    const userExist = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (userExist) {
      const error = new Error("El usuario ya esta registrado");
      return res.status(409).json({ error: error.message });
    }

    const passwordHash = await hashPassword(password);

    const data = {
      name,
      email,
      password: passwordHash,
      confirmed: false,
      token: generateToken(),
    };
    await prisma.user.create({
      data: data,
    });

    AuthEmail.sendConfirmationEmail({
      email: data.email,
      name: data.name,
      token: data.token,
    });

    res.send(
      "Cuenta creada correctamente, dile al administrador que te comparta el codigo de confirmación"
    );
  } catch (error) {
    console.log(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      const error = new Error("El usuario no esta registrado");
      return res.status(404).json({ error: error.message });
    }
    const token = generateToken();
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        token: token,
      },
    });
    AuthEmail.sendPasswordResetToken({
      email: user.email,
      name: user.name,
      token: token,
    });
    res.send(
      "Solicitale al administrador que te comparta el codigo de confirmación"
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Hubo un error" });
  }
};

export const validateToken = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { token } = req.body;
    const tokenExists = await prisma.user.findFirst({
      where: {
        token: token,
      },
    });
    if (!tokenExists) {
      const error = new Error("Token no válido");
      return res.status(404).json({ error: error.message });
    }
    res.send("Token válido, Define tu nuevo password");
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
};

export const requestConfirmationCode = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      const error = new Error("El usuario no esta registrado");
      return res.status(404).json({ error: error.message });
    }
    if (user.confirmed) {
      const error = new Error("El usuario ya esta confirmado");
      return res.status(403).json({ error: error.message });
    }

    const confirmed = generateToken();

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        token: confirmed,
      },
    });

    AuthEmail.sendConfirmationEmail({
      email: user.email,
      name: user.name,
      token: confirmed,
    });
    res.send("Solicitale al administrador el codigo de confirmación");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Hubo un error" });
  }
};

export const confirmAccount = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { token } = req.body;
    const tokenExists = await prisma.user.findFirst({
      where: {
        token: token,
      },
    });
    if (!tokenExists) {
      const error = new Error("Token no válido");
      return res.status(404).json({ error: error.message });
    }
    await prisma.user.update({
      where: {
        id: tokenExists.id,
      },
      data: {
        confirmed: true,
        token: "",
      },
    });
    res.send("Cuenta confirmada correctamente");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Hubo un error" });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, role } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      const error = new Error("Usuario no encontrado");
      return res.status(404).json({ error: error.message });
    }

    if (user.role !== role) {
      const error = new Error("El usuario no tiene el rol necesario");
      return res.status(401).json({ error: error.message });
    }
    if (!user.confirmed) {
      const token = generateToken();
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          token: token,
        },
      });
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token,
      });
      const error = new Error(
        "La cuenta no ha sido confirmada,debes ir a la pagina de confirmacion e ingresar el codigo de confirmacion que te brinde el administrador"
      );
      return res.status(401).json({ error: error.message });
    }
    const isPasswordCorrect = await checkPassword(password, user.password);
    if (!isPasswordCorrect) {
      const error = new Error("Password Incorrecto");
      return res.status(401).json({ error: error.message });
    }
    const token = generateJWT({ id: user.id });
    res.send(token);
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
};
export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const form = formidable({
    multiples: false,
  });
  try {
    form.parse(req, (error, fields, files) => {
      cloudinary.uploader.upload(
        files.file[0].filepath,
        { public_id: uuid() },
        async function (error, result) {
          if (error) {
            const error = new Error("Hubo un error al subir la imagen");
            return res.status(500).json({ error: error.message });
          }
          if (result) {
            req.user.image = result.secure_url;
            await prisma.user.update({
              where: {
                id: req.user.id,
              },
              data: {
                image: result.secure_url,
              },
            });
            res.json({
              image: result.secure_url,
            });
          }
        }
      );
    });
  } catch (e) {
    const error = new Error("Hubo un error");
    return res.status(500).json({ error: error.message });
  }
};
export const getUser = async (req: Request, res: Response): Promise<any> => {
  return res.json(req.user);
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { name, email } = req.body;
    const emailExist = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (emailExist && emailExist.id !== req.user.id) {
      const error = new Error("El email ya esta registrado");
      return res.status(409).json({ error: error.message });
    }
    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        name,
        email,
      },
    });
    res.send("Perfil actualizado correctamente");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Hubo un error" });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await prisma.user.findMany({
      where: {
        confirmed: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
    console.log(error);
  }
};

export const getUsersAll = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "USER",
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
    console.log(error);
  }
};

export const passwordCheck = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });

  const isPasswordCorrect = await checkPassword(password, user.password);
  if (!isPasswordCorrect) {
    const error = new Error("El Password es incorrecto");
    return res.status(401).json({ error: error.message });
  }

  res.send("Password Correcto");
};

export const updateCurrentUserPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { current_password, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    const isPasswordCorrect = await checkPassword(
      current_password,
      user.password
    );
    if (!isPasswordCorrect) {
      const error = new Error("El Password actual es incorrecto");
      return res.status(401).json({ error: error.message });
    }
    try {
      user.password = await hashPassword(password);
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: user.password,
        },
      });

      res.send("El Password se modificó correctamente");
    } catch (error) {
      res.status(500).send("Hubo un error");
    }
  } catch (error) {
    res.status(500).send("Hubo un error");
  }
};

export const updatePasswordWithToken = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const tokenExists = await prisma.user.findFirst({
      where: {
        token: token,
      },
    });
    if (!tokenExists) {
      const error = new Error("Token no válido");
      return res.status(404).json({ error: error.message });
    }
    const user = await prisma.user.findFirst({
      where: {
        token: tokenExists.token,
      },
    });
    const hash = await hashPassword(password);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hash,
        token: "",
      },
    });
    res.send("El password se modificó correctamente");
  } catch (error) {
    res.status(500).send("Hubo un error");
  }
};

export const updateUserStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId, status } = req.body;
  try {
    await prisma.user.update({
      where: {
        id: +userId,
      },
      data: {
        confirmed: status,
      },
    });
    res.send("Usuario actualizado correctamente");
  } catch (error) {
    res.status(500).send("Hubo un error");
  }
};

export const getTokensConfirmUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tokens = await prisma.user.findMany({
      where: {
        OR: [{ token: { not: "" } }, { confirmed: false }],
      },
      select: {
        name: true,
        token: true,
        email: true,
      },
    });

    res.status(200).json(tokens);
  } catch (error) {
    console.error("Error fetching users with tokens:", error);
    res.status(500).json({ message: "Error fetching users with tokens" });
  }
};
