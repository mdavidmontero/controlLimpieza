import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { isAuthenticated } from "../middleware/auth";
import {
  getLimpiezaByDateActual,
  getLimpiezaById,
  registerLimpiezaAcopio,
  updateLimpiezaAcopio,
} from "../controllers/CleaninCenterController";

const router = Router();

router.post(
  "/register-limpieza-acopio",
  body("userId").isString().withMessage("Tipo inválido"),
  body("responsable").isString().withMessage("Tipo inválido"),
  // body("imagenes").isArray().withMessage("Tipo inválido"),
  isAuthenticated,
  handleInputErrors,
  registerLimpiezaAcopio
);

router.get("/actual", isAuthenticated, getLimpiezaByDateActual);
router.get("/:id", isAuthenticated, getLimpiezaById);
router.patch("/:id", isAuthenticated, updateLimpiezaAcopio);

export default router;
