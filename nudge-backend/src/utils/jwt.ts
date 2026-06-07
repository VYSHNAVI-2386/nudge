import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const signAccess = (userId: string) =>
  jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: "15m" });

export const signRefresh = (userId: string) =>
  jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "30d" });

export const verifyAccess = (token: string) =>
  jwt.verify(token, ACCESS_SECRET) as { userId: string };

export const verifyRefresh = (token: string) =>
  jwt.verify(token, REFRESH_SECRET) as { userId: string };