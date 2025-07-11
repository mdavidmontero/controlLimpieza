import { Router } from "express";
import {
  getVisitByDate,
  getVisitById,
  registerVisit,
  updateStatusVisit,
  updateVisit,
  uploadPdf,
  getVisitCenterByUser,
} from "../controllers/VisitController";
import { isAuthenticated } from "../middleware/auth";

const router = Router();

router.post("/register-visit", isAuthenticated, registerVisit);
router.get("/get-visit-by-user", isAuthenticated, getVisitCenterByUser);
router.get("/get-visit-by-id/:id", isAuthenticated, getVisitById);
router.patch("/update-visit/:id", isAuthenticated, updateVisit);
router.delete("/delete-visit/:id", isAuthenticated, updateVisit);
router.get("/get-visit-by-date", isAuthenticated, getVisitByDate);
router.patch("/update-status-visit/:id", isAuthenticated, updateStatusVisit);
router.post("/upload-pdf/:id", isAuthenticated, uploadPdf);

export default router;
