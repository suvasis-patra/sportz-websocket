import { Router } from "express";
import { createNewMatch, getMatches } from "../controllers/match.controller.js";

export const matchRouter = Router();

matchRouter.post("/", createNewMatch).get("/", getMatches);
