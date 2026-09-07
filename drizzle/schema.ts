import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const appUsers = pgTable("app_users", {
	username: text().primaryKey().notNull(),
	passwordHash: text("password_hash").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const canvases = pgTable("canvases", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	title: text().default('Untitled').notNull(),
	elements: jsonb().default([]).notNull(),
	appState: jsonb("app_state").default({}).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	sharedWith: text("shared_with").array().default([""]).notNull(),
});
