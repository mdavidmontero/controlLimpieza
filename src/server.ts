import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import authRouter from "./routes/authRoutes";
import attendanceRouter from "./routes/attendanceRoutes";
import cleaningCenter from "./routes/CleaningCenterRoutes";
import cleaningSiloCenter from "./routes/cleaningSiloCenterRoutes";
import equipmentCenter from "./routes/equipmentCenterRoutes";
import trapsRouter from "./routes/trapRoutes";
import visitCenter from "./routes/VisitCenterRoutes";
import { corsConfig } from "./config/cors";
import cronservice from "./routes/cronService";
dotenv.config();
const app = express();

app.use(cors(corsConfig));

app.use(morgan("dev"));

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/cleaning-center", cleaningCenter);
app.use("/api/traps", trapsRouter);
app.use("/api/cron", cronservice);
app.use("/api/cleaning-silo", cleaningSiloCenter);
app.use("/api/equipment-center", equipmentCenter);
app.use("/api/visit-center", visitCenter);

export default app;
