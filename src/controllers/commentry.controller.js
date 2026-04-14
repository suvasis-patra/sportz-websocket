import { desc } from "drizzle-orm";
import { MAX_LIMIT } from "../constants.js";
import { db } from "../db/db.js";
import { commentry } from "../db/schema.js";
import { matchIdParamSchema } from "../validations/index.js";
import {
  createCommentarySchema,
  listCommentaryQuerySchema,
} from "../validations/commentry.js";

export const getCommentries = async (req, res) => {
  const paramsResult = listCommentaryQuerySchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: `invalid param data` });
  }
  const limit = Math.min(paramsResult.data.limit, MAX_LIMIT);

  try {
    const commentries = await db
      .select()
      .from(commentry)
      .orderBy(desc(commentry.createdAt))
      .limit(limit);
    res.status(200).json({ message: "success", data: commentries });
  } catch (error) {
    console.error("failed to get commentreis", error);
    res.status(500).json({ error: "failed to get commentries" });
  }
};

export const createNewCommentry = async (req, res) => {
  const paramsResult = matchIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    console.log(req.params);
    return res
      .status(400)
      .json({ error: `invalid match id : ${paramsResult.data?.id}` });
  }
  const matchId = paramsResult.data.id;
  const parsed = createCommentarySchema.safeParse(req.body);
  if (!parsed.data) {
    return res.status(400).json({ error: parsed.error.message });
  }
  const {
    data: {
      message,
      minute,
      metadata,
      actor,
      eventType,
      period,
      sequence,
      tags,
      team,
    },
  } = parsed;

  try {
    const [event] = await db
      .insert(commentry)
      .values({
        team,
        message,
        minute,
        matchId,
        metadata,
        actor,
        eventType,
        period,
        sequence,
        tags,
      })
      .returning();
    res.status(201).json({ message: "success", data: event });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "success" });
  }
};
