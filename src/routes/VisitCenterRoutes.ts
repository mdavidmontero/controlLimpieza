import { Router } from "express";
import {
  getVisitByDate,
  getVisitById,
  registerVisit,
  updateStatusVisit,
  updateVisit,
  uploadPdf,
} from "../controllers/VisitController";
import { isAuthenticated } from "../middleware/auth";

const router = Router();

router.post("/register-visit", isAuthenticated, registerVisit);
router.get("/get-visit-by-id/:id", isAuthenticated, getVisitById);
router.patch("/update-visit/:id", isAuthenticated, updateVisit);
router.delete("/delete-visit/:id", isAuthenticated, updateVisit);
router.get("/get-visit-by-date", isAuthenticated, getVisitByDate);
router.patch("/update-status-visit/:id", isAuthenticated, updateStatusVisit);
router.post("/upload-pdf", uploadPdf);

export default router;
