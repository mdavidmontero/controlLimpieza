import { Router } from "express";
import { body, param } from "express-validator";
import {
  createAccount,
  login,
  validateToken,
  uploadImage,
  getUser,
  updateProfile,
  getUsers,
  passwordCheck,
  updateCurrentUserPassword,
  resetPasswordWithToken,
  updateUserStatus,
} from "../controllers/AuthController";

import { handleInputErrors } from "../middleware/validation";

import { isAuthenticated } from "../middleware/auth";
const router = Router();
router.post(
  "/create-account",
  body("name").isLength({ min: 3 }).withMessage("Nombre inválido"),
  body("email").isEmail().withMessage("Email inválido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Los Password no son iguales");
    }
    return true;
  }),
  handleInputErrors,
  createAccount
);

router.post(
  "/login",
  body("email").isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("La contraseña no puede ir vacia"),
  handleInputErrors,
  login
);

router.post(
  "/validate-token",
  body("token").notEmpty().withMessage("El Token no puede ir vacio"),
  handleInputErrors,
  validateToken
);

router.get("/user", isAuthenticated, getUser);
router.get("/users", getUsers);
router.post("/upload-image", isAuthenticated, uploadImage);
router.patch("/userstatus", isAuthenticated, updateUserStatus);
router.patch(
  "/update-profile",
  body("name").notEmpty().withMessage("El nombre no puede ir vacio"),
  body("email").isEmail().withMessage("E-mail no válido"),
  isAuthenticated,
  updateProfile
);

router.post(
  "/update-password/:token",
  param("token").isNumeric().withMessage("Token no válido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password es muy corto, minimo 8 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Los Password no son iguales");
    }
    return true;
  }),
  handleInputErrors,
  resetPasswordWithToken
);
router.post(
  "/update-password",
  isAuthenticated,
  body("current_password")
    .notEmpty()
    .withMessage("El password actual no puede ir vacio"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password es muy corto, minimo 8 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Los Password no son iguales");
    }
    return true;
  }),
  handleInputErrors,
  updateCurrentUserPassword
);

router.post(
  "/check-password",
  isAuthenticated,
  body("password").notEmpty().withMessage("El password no puede ir vacio"),
  handleInputErrors,
  passwordCheck
);

export default router;
