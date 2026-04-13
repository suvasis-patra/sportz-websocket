import { z } from "zod";

export const MATCH_STATUS = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  FINISHED: "finished",
};

export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createMatchSchema = z
  .object({
    sport: z.string().min(1),
    homeTeamName: z.string().min(1),
    awayTeamName: z.string().min(1),

    startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "startTime must be a valid ISO date string",
    }),

    endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "endTime must be a valid ISO date string",
    }),

    homeTeamScore: z.coerce.number().int().nonnegative().optional(),

    awayTeamScore: z.coerce.number().int().nonnegative().optional(),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    if (end <= start) {
      ctx.addIssue({
        code: "custom",
        message: "endTime must be after startTime",
        path: ["endTime"],
      });
    }
  });

export const updateScoreSchema = z.object({
  homeTeamScore: z.coerce.number().int().nonnegative(),
  awayTeamScore: z.coerce.number().int().nonnegative(),
});
