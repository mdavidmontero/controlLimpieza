import { Router } from "express";
import { sendPDFEmail } from "../controllers/cronControllerEmail";

const router = Router();

// Services pdf

router.post("/send-pdf", sendPDFEmail);

export default router;
