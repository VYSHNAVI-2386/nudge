import type { Request, Response, NextFunction } from "express";
import { verifyAccess } from "../utils/jwt.js";

export interface AuthRequest extends Request {
  userId?: string;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const { userId } = verifyAccess(header.slice(7));
    req.userId = userId;
    next();
  } catch {
    res.status(401).json({ error: "Token expired" });
  }
};