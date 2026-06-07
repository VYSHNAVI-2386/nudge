import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getCircle, addMember, updateMember, deleteMember } from "../controllers/circle.controller.js";

export const circleRouter = Router();
circleRouter.use(requireAuth);
circleRouter.get("/", getCircle);
circleRouter.post("/", addMember);
circleRouter.patch("/:id", updateMember);
circleRouter.delete("/:id", deleteMember);