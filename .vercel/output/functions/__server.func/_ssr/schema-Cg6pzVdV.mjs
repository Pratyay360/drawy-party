if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { a as pgTable, c as text, l as jsonb, o as uuid, s as timestamp, t as drizzle, u as src_default } from "../_libs/drizzle-orm+postgres.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/schema-Cg6pzVdV.js
var url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");
var sql = src_default(url, {
	max: 1,
	idle_timeout: 20,
	connect_timeout: 10,
	prepare: false
});
var db = drizzle({ client: sql });
var appUsers = pgTable("app_users", {
	username: text("username").primaryKey(),
	passwordHash: text("password_hash").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});
var canvases = pgTable("canvases", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").notNull(),
	title: text("title").notNull().default("Untitled"),
	elements: jsonb("elements").notNull().default("[]"),
	appState: jsonb("app_state").notNull().default("{}"),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
	sharedWith: text("shared_with").array().notNull().default([])
});
//#endregion
export { canvases as n, db as r, appUsers as t };
