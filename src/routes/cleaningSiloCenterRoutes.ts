import { Router } from "express";
import {
  registerLimpiezaSilo,
  updateLimpizaSilo,
  getLimpiezaSiloById,
  getLimpiezaByDate,
  deleteLimpieza,
} from "../controllers/cleaningSiloController";
import { body } from "express-validator";
import { isAuthenticated } from "../middleware/auth";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.post(
  "/register-cleaning-silo",
  body("userId").isString().withMessage("Tipo inválido"),
  body("responsable").isString().withMessage("Tipo inválido"),
  body("controlplagas").isString().withMessage("Tipo inválido"),
  body("insumosutilizados").isString().withMessage("Tipo inválido"),
  isAuthenticated,
  handleInputErrors,
  registerLimpiezaSilo
);
router.patch("/update-cleaning-silo/:id", updateLimpizaSilo);
router.get(
  "/get-cleaning-silo/:id",
  isAuthenticated,
  handleInputErrors,
  getLimpiezaSiloById
);
router.get("/get-cleaning-silo-by-date", isAuthenticated, getLimpiezaByDate);
router.delete("/delete-cleaning-silo/:id", deleteLimpieza);

export default router;
