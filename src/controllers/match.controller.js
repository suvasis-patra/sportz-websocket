import { desc } from "drizzle-orm";
import { MAX_LIMIT } from "../constants.js";
import { db } from "../db/db.js";
import { matches } from "../db/schema.js";
import { getMatchStatus, syncMatchStatus } from "../utils/matches.js";
import {
  createMatchSchema,
  listMatchesQuerySchema,
} from "../validations/index.js";

export const createNewMatch = async (req, res) => {
  const validateMatchData = createMatchSchema.safeParse(req.body);

  if (!validateMatchData.success) {
    return res.status(400).json({
      error: "Invalid data format",
      details: validateMatchData.error,
    });
  }

  const {
    sport,
    homeTeamName,
    awayTeamName,
    startTime,
    endTime,
    homeTeamScore,
    awayTeamScore,
  } = validateMatchData.data;

  try {
    const [event] = await db
      .insert(matches)
      .values({
        sport,
        homeTeamName,
        awayTeamName,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: getMatchStatus(startTime, endTime),
        homeTeamScore: homeTeamScore ?? 0,
        awayTeamScore: awayTeamScore ?? 0,
      })
      .returning();

    if (typeof res.app.locals.broadcastCreatedMatch === "function") {
      try {
        res.app.locals.broadcastCreatedMatch(event);
      } catch (broadcastError) {
        console.error("failed to broadcast created match", broadcastError);
      }
    }
    return res.status(201).json({
      message: "new match added",
      data: event,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "failed to create new match",
      details: error?.message,
    });
  }
};

export const getMatches = async (req, res) => {
  const validatedData = listMatchesQuerySchema.safeParse(req.query);
  if (!validatedData.success) {
    return res.status(400).json({
      error: "Invalid data format",
      details: validatedData.error.issues,
    });
  }
  const limit = Math.min(validatedData.data.limit ?? 50, MAX_LIMIT);
  try {
    const data = await db
      .select()
      .from(matches)
      .orderBy(desc(matches.createdAt))
      .limit(limit);

    const matchList = syncMatchStatus(data);

    res.status(200).json({ message: "success", matchList });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "failed to get new matches",
      details: error?.message,
    });
  }
};
