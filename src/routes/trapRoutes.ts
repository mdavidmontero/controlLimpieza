import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { isAuthenticated } from "../middleware/auth";
import { registerTraps } from "../controllers/TrapsController";

const router = Router();

router.post(
  "/register-traps",
  body("lugarcolocacion").isString().withMessage("Tipo inválido"),
  body("tipotrampa").isString().withMessage("Tipo inválido"),
  body("cantidadtrampas").isString().withMessage("Tipo inválido"),
  body("plagamonitor").isString().withMessage("Tipo inválido"),
  body("fecharecambio").isString().withMessage("Tipo inválido"),
  body("responsale").isString().withMessage("Tipo inválido"),
  isAuthenticated,
  handleInputErrors,
  registerTraps
);
export default router;
