import { Router } from "express";

const router = Router();

import {
  registerEquimentCleaning,
  deleteEquipmentCleaning,
  getEquipmentCleaningById,
  updateEquimentCleaning,
  getEquipmentCleaningByDateActual,
} from "../controllers/EquipmentCleaningController";
import { isAuthenticated } from "../middleware/auth";
import { handleInputErrors } from "../middleware/validation";
import { body, param } from "express-validator";

router.post(
  "/registerEquimentCleaning",
  body("fecharealizado")
    .isString()
    .withMessage("La fecha de realizado es obligatoria"),
  body("nombre").isString().withMessage("El nombre es obligatorio"),
  body("marca").isString().withMessage("La marca es obligatoria"),
  body("modelo").isString().withMessage("El modelo es obligatorio"),
  body("fechacompra")
    .isString()
    .withMessage("La fecha de compra es obligatoria"),
  body("area").isString().withMessage("La area es obligatoria"),
  body("estado").isString().withMessage("El estado del equipo es obligatorio"),
  body("descripcionsituacion")
    .isString()
    .withMessage("La descripcion es obligatoria"),
  body("mantenimiento")
    .isString()
    .withMessage("El mantenimiento es obligatorio"),
  body("descripcionmantemiento")
    .isString()
    .withMessage("La descripcion de mantenimiento es obligatoria"),
  body("falla").isString().withMessage("La falla es obligatoria"),
  body("descripcionfalla")
    .isString()
    .withMessage("La descripcion de la falla es obligatoria"),
  body("proximomantenimiento")
    .isString()
    .withMessage("Ek proximo mantenimiento es obligatorio"),
  body("motivomantenimiento")
    .isString()
    .withMessage("El motivo del mantenimiento es obligatorio"),
  isAuthenticated,
  handleInputErrors,
  registerEquimentCleaning
);

router.get(
  "/getEquimentCleaningById/:id",
  isAuthenticated,
  getEquipmentCleaningById
);

router.patch(
  "/updateEquimentCleaning/:id",
  param("id").isInt().withMessage("El id es obligatorio"),
  body("fecharealizado")
    .isString()
    .withMessage("La fecha de realizado es obligatoria"),
  body("nombre").isString().withMessage("El nombre es obligatorio"),
  body("marca").isString().withMessage("La marca es obligatoria"),
  body("modelo").isString().withMessage("El modelo es obligatorio"),
  body("fechacompra")
    .isString()
    .withMessage("La fecha de compra es obligatoria"),
  body("area").isString().withMessage("La area es obligatoria"),
  body("estado").isString().withMessage("El estado del equipo es obligatorio"),
  body("descripcionsituacion")
    .isString()
    .withMessage("La descripcion es obligatoria"),
  body("mantenimiento")
    .isString()
    .withMessage("El mantenimiento es obligatorio"),
  body("descripcionmantemiento")
    .isString()
    .withMessage("La descripcion de mantenimiento es obligatoria"),
  body("falla").isString().withMessage("La falla es obligatoria"),
  body("descripcionfalla")
    .isString()
    .withMessage("La descripcion de la falla es obligatoria"),
  body("proximomantenimiento")
    .isString()
    .withMessage("Ek proximo mantenimiento es obligatorio"),
  body("motivomantenimiento").isString(),
  isAuthenticated,
  handleInputErrors,
  updateEquimentCleaning
);

router.get(
  "/getEquimentCleaningByDateActual",
  isAuthenticated,
  getEquipmentCleaningByDateActual
);

export default router;
