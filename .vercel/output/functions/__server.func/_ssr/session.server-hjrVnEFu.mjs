if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { c as updateSession$1, n as clearSession$1, o as getSession$1 } from "./ssr.mjs";
import { i as eq } from "../_libs/drizzle-orm+postgres.mjs";
import { r as db, t as appUsers } from "./schema-Cg6pzVdV.mjs";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/session.server-hjrVnEFu.js
var SESSION_COOKIE_NAME = "drawy-session";
var SESSION_MAX_AGE = 604800;
var PASSWORD_KEY_LENGTH = 64;
var PASSWORD_SALT_LENGTH = 16;
function getSessionConfig() {
	const password = process.env.SESSION_SECRET;
	if (!password) throw new Error("SESSION_SECRET is not set");
	return {
		name: SESSION_COOKIE_NAME,
		password,
		maxAge: SESSION_MAX_AGE,
		cookie: {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			path: "/"
		}
	};
}
function hashPassword(password, salt = randomBytes(PASSWORD_SALT_LENGTH).toString("hex")) {
	return `scrypt$${salt}$${scryptSync(password, salt, PASSWORD_KEY_LENGTH).toString("hex")}`;
}
function verifyPassword(password, storedHash) {
	const parts = storedHash.split("$");
	if (parts.length !== 3 || parts[0] !== "scrypt") return false;
	const [, salt, keyHex] = parts;
	const derivedKey = scryptSync(password, salt, keyHex.length / 2);
	const expected = Buffer.from(keyHex, "hex");
	if (expected.length !== derivedKey.length) return false;
	return timingSafeEqual(expected, derivedKey);
}
function validateCredentials(username, _password) {
	if (!/^[a-zA-Z0-9_-]+$/.test(username)) throw new Error("Username can only contain letters, numbers, underscores, and hyphens.");
}
async function loadCurrentUser() {
	const username = (await getSession$1(getSessionConfig())).data.username;
	if (!username) return null;
	try {
		const [user] = await db.select({ username: appUsers.username }).from(appUsers).where(eq(appUsers.username, username)).limit(1);
		if (!user) return null;
		return { username: user.username };
	} catch (err) {
		console.error("[session] loadCurrentUser failed:", err.message);
		return null;
	}
}
async function resolveCurrentUserServer() {
	return loadCurrentUser();
}
async function signInServer(username, _password) {
	validateCredentials(username, _password);
	const [user] = await db.select({
		username: appUsers.username,
		passwordHash: appUsers.passwordHash
	}).from(appUsers).where(eq(appUsers.username, username)).limit(1);
	if (!user) throw new Error("Invalid username or password.");
	if (!verifyPassword(_password, user.passwordHash)) throw new Error("Invalid username or password.");
	await updateSession$1(getSessionConfig(), { username: user.username });
	return { username: user.username };
}
async function signUpServer(username, password) {
	validateCredentials(username, password);
	const [existing] = await db.select({ username: appUsers.username }).from(appUsers).where(eq(appUsers.username, username)).limit(1);
	if (existing) throw new Error("Username already exists.");
	const passwordHash = hashPassword(password);
	const [created] = await db.insert(appUsers).values({
		username,
		passwordHash
	}).returning({ username: appUsers.username });
	if (!created) throw new Error("Failed to create account.");
	await updateSession$1(getSessionConfig(), { username: created.username });
	return { username: created.username };
}
async function logoutServer() {
	await clearSession$1(getSessionConfig());
	return { ok: true };
}
//#endregion
export { logoutServer, resolveCurrentUserServer, signInServer, signUpServer };
