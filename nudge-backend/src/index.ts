import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";
import { authRouter } from "./routes/auth.js";
import { remindersRouter } from "./routes/reminders";
import { circleRouter } from "./routes/circle";
import { startScheduler } from "./services/scheduler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use("/api/auth", authRouter);
app.use("/api/reminders", remindersRouter);
app.use("/api/circle", circleRouter);

app.get("/api/health", (_, res) => res.json({ status: "ok", time: new Date() }));

app.listen(PORT, () => {
  console.log(`🐻 Nudge backend running on port ${PORT}`);
  startScheduler();
});