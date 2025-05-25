import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import authRouter from "./routes/authRoutes";
import attendanceRouter from "./routes/attendanceRoutes";
import cleaningCenter from "./routes/CleaningCenterRoutes";
import { corsConfig } from "./config/cors";
dotenv.config();
const app = express();

app.use(cors(corsConfig));

app.use(morgan("dev"));

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/cleaning-center", cleaningCenter);

export default app;
