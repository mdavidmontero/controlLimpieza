import { Router } from "express";
import { sendPDF } from "../controllers/cronController";

const router = Router();

// Services pdf

router.post("/send-pdf", sendPDF);

export default router;
