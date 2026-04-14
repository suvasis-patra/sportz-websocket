import { Router } from "express";
import {
  createNewCommentry,
  getCommentries,
} from "../controllers/commentry.controller.js";

export const commentryRouter = Router({ mergeParams: true });

commentryRouter.post("/", createNewCommentry).get("/", getCommentries);
