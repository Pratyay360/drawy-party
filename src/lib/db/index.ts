import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

// Neon free tier: role rv_klsvj2qa has low connection limit (5-10).
// Use single connection + lazy connect to avoid exhaustive 53300.
const sql = postgres(url, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
});
export const db = drizzle({ client: sql });