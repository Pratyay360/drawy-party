import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const appUsers = pgTable("app_users", {
	username: text("username").primaryKey(),
	passwordHash: text("password_hash").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const canvases = pgTable("canvases", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").notNull(),
	title: text("title").notNull().default("Untitled"),
	elements: jsonb("elements").notNull().default("[]"),
	appState: jsonb("app_state").notNull().default("{}"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	sharedWith: text("shared_with").array().notNull().default([]),
});

export type Canvas = typeof canvases.$inferSelect;
