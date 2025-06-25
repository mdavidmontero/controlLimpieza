import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { isAuthenticated } from "../middleware/auth";
import {
  deleteImageTraps,
  getTraps,
  getTrapsById,
  registerTraps,
  updateTraps,
  uploadImagesTraps,
} from "../controllers/TrapsController";

const router = Router();

router.post(
  "/register-traps",
  body("lugarcolocacion").isString().withMessage("Tipo inválido"),
  body("tipotrampa").isString().withMessage("Tipo inválido"),
  body("cantidadtrampas").isString().withMessage("Tipo inválido"),
  body("plagamonitor").isString().withMessage("Tipo inválido"),
  body("fecharecambio").isString().withMessage("Tipo inválido"),
  body("responsable").isString().withMessage("Tipo inválido"),
  isAuthenticated,
  handleInputErrors,
  registerTraps
);

router.patch(
  "/update-traps/:id",
  isAuthenticated,
  handleInputErrors,
  updateTraps
);

router.get("/get-traps/:id", isAuthenticated, getTrapsById);
router.get("/get-traps-by-date", isAuthenticated, getTraps);
router.post("/upload-image/:id", isAuthenticated, uploadImagesTraps);
router.delete("/delete-image/:id", isAuthenticated, deleteImageTraps);

export default router;
