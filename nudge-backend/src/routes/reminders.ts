import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getReminders, createReminder, updateReminder, deleteReminder, markDone } from "../controllers/reminders.controller.js";

export const remindersRouter = Router();
remindersRouter.use(requireAuth);
remindersRouter.get("/", getReminders);
remindersRouter.post("/", createReminder);
remindersRouter.patch("/:id", updateReminder);
remindersRouter.delete("/:id", deleteReminder);
remindersRouter.post("/:id/done", markDone);