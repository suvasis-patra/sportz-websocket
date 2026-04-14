import {
  pgTable,
  serial,
  text,
  timestamp,
  pgEnum,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

export const matchStatusEnum = pgEnum("match_status", [
  "live",
  "scheduled",
  "finished",
]);

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  sport: text("sport").notNull(),
  homeTeamName: text("home_team_name").notNull(),
  awayTeamName: text("away_team_name").notNull(),
  status: matchStatusEnum("status").notNull().default("scheduled"),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  homeTeamScore: integer("home_team_score").notNull().default(0),
  awayTeamScore: integer("away_team_score").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const commentry = pgTable("commentry", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id")
    .notNull()
    .references(() => matches.id),
  minute: integer("minute"),
  sequence: integer("sequence"),
  period: text("period"),
  eventType: text("event_type"),
  actor: text("actor"),
  team: text("team"),
  message: text("message"),
  metadata: jsonb("metadata"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
