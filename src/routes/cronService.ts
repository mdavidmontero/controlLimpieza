import { Router } from "express";
import { sendPDF } from "../controllers/cronController";

const router = Router();

router.post("/send-pdf", sendPDF);

export default router;
