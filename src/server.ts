import express from "express";
import morgan from "morgan";
import cors from "cors";
import { corsConfig } from "./config/cors";

const app = express();

app.use(cors(corsConfig));

app.use(morgan("dev"));

app.use(express.json());

export default app;
