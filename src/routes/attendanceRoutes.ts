import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { isAuthenticated } from "../middleware/auth";
import {
  getAttendanceHistoryMonth,
  getAttendandesUser,
  registerAfternoon,
  registerMorning,
} from "../controllers/AttendanceController";
const router = Router();

router.post(
  "/register-morning",
  body("tipo").isIn(["entrada", "salida"]).withMessage("Tipo inválido"),
  isAuthenticated,
  handleInputErrors,
  registerMorning
);

router.post(
  "/register-afternoon",
  body("tipo").isIn(["entrada", "salida"]).withMessage("Tipo inválido"),
  isAuthenticated,
  handleInputErrors,
  registerAfternoon
);

router.get("/", isAuthenticated, getAttendandesUser);
router.get("/history", isAuthenticated, getAttendanceHistoryMonth);
export default router;
