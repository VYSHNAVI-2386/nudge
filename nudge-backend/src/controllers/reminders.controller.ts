import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";
import { prisma } from "../utils/prisma.js";
import { z } from "zod";

const schema = z.object({
  recipientId: z.string(),
  title: z.string().min(1),
  message: z.string(),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  repeat: z.enum(["once", "daily", "weekdays", "weekly"]),
  companion: z.string(),
});

export async function getReminders(req: AuthRequest, res: Response) {
  const reminders = await prisma.reminder.findMany({
    where: { userId: req.userId },
    include: { recipient: true, logs: { orderBy: { sentAt: "desc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });
  res.json(reminders);
}

export async function createReminder(req: AuthRequest, res: Response) {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const reminder = await prisma.reminder.create({
    data: { ...parsed.data, userId: req.userId! },
    include: { recipient: true },
  });
  res.status(201).json(reminder);
}

export async function updateReminder(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const reminder = await prisma.reminder.findFirst({ where: { id, userId: req.userId } });
  if (!reminder) { res.status(404).json({ error: "Not found" }); return; }
  const updated = await prisma.reminder.update({ where: { id }, data: req.body });
  res.json(updated);
}

export async function deleteReminder(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const reminder = await prisma.reminder.findFirst({ where: { id, userId: req.userId } });
  if (!reminder) { res.status(404).json({ error: "Not found" }); return; }
  await prisma.reminder.delete({ where: { id } });
  res.json({ ok: true });
}

export async function markDone(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const log = await prisma.reminderLog.findFirst({
    where: { reminderId: id },
    orderBy: { sentAt: "desc" },
  });
  if (!log) { res.status(404).json({ error: "No log found" }); return; }
  const updated = await prisma.reminderLog.update({
    where: { id: log.id },
    data: { markedDone: true, doneAt: new Date() },
  });
  res.json(updated);
}