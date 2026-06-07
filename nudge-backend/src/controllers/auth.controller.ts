import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../utils/prisma.js";
import { signAccess, signRefresh, verifyRefresh } from "../utils/jwt.js";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  const { email, password, name } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) { res.status(409).json({ error: "Email already in use" }); return; }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { email, name, passwordHash } });

  const accessToken = signAccess(user.id);
  const refreshToken = signRefresh(user.id);
  await prisma.refreshToken.create({
    data: { userId: user.id, token: refreshToken, expiresAt: new Date(Date.now() + 30 * 86400000) },
  });

  res.status(201).json({ accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name } });
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash) { res.status(401).json({ error: "Invalid credentials" }); return; }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) { res.status(401).json({ error: "Invalid credentials" }); return; }

  const accessToken = signAccess(user.id);
  const refreshToken = signRefresh(user.id);
  await prisma.refreshToken.create({
    data: { userId: user.id, token: refreshToken, expiresAt: new Date(Date.now() + 30 * 86400000) },
  });

  res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name } });
}

export async function refresh(req: Request, res: Response) {
  const { token } = req.body;
  if (!token) { res.status(400).json({ error: "Token required" }); return; }
  try {
    const { userId } = verifyRefresh(token);
    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.userId !== userId) { res.status(401).json({ error: "Invalid token" }); return; }

    await prisma.refreshToken.delete({ where: { token } });
    const accessToken = signAccess(userId);
    const refreshToken = signRefresh(userId);
    await prisma.refreshToken.create({
      data: { userId, token: refreshToken, expiresAt: new Date(Date.now() + 30 * 86400000) },
    });
    res.json({ accessToken, refreshToken });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export async function logout(req: Request, res: Response) {
  const { token } = req.body;
  if (token) await prisma.refreshToken.deleteMany({ where: { token } });
  res.json({ ok: true });
}

export async function me(req: Request & { userId?: string }, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, email: true, name: true, createdAt: true },
  });
  res.json(user);
}