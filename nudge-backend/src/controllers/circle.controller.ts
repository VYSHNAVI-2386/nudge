import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";
import { prisma } from "../utils/prisma.js";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  companion: z.string(),
});

export async function getCircle(req: AuthRequest, res: Response) {
  const members = await prisma.circleMember.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "asc" },
  });
  res.json(members);
}

export async function addMember(req: AuthRequest, res: Response) {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const member = await prisma.circleMember.create({
    data: { ...parsed.data, userId: req.userId! },
  });
  res.status(201).json(member);
}

export async function updateMember(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const member = await prisma.circleMember.findFirst({ where: { id, userId: req.userId } });
  if (!member) { res.status(404).json({ error: "Not found" }); return; }
  const updated = await prisma.circleMember.update({ where: { id }, data: req.body });
  res.json(updated);
}

export async function deleteMember(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const member = await prisma.circleMember.findFirst({ where: { id, userId: req.userId } });
  if (!member) { res.status(404).json({ error: "Not found" }); return; }
  await prisma.circleMember.delete({ where: { id } });
  res.json({ ok: true });
}