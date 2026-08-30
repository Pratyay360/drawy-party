import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import {
	clearSession,
	getSession,
	updateSession,
} from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";

import { db } from "#/lib/db";
import { appUsers } from "#/lib/db/schema";

import type { CurrentUser } from "./session";

type SessionData = {
	username?: string;
};

const SESSION_COOKIE_NAME = "drawy-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_SALT_LENGTH = 16;

function getSessionConfig() {
	const password = process.env.SESSION_SECRET;
	if (!password) throw new Error("SESSION_SECRET is not set");
	return {
		name: SESSION_COOKIE_NAME,
		password,
		maxAge: SESSION_MAX_AGE,
		cookie: {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax" as const,
			path: "/",
		},
	};
}

function hashPassword(
	password: string,
	salt = randomBytes(PASSWORD_SALT_LENGTH).toString("hex"),
) {
	const derivedKey = scryptSync(password, salt, PASSWORD_KEY_LENGTH);
	return `scrypt$${salt}$${derivedKey.toString("hex")}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
	const parts = storedHash.split("$");
	if (parts.length !== 3 || parts[0] !== "scrypt") {
		return false;
	}
	const [, salt, keyHex] = parts;

	const derivedKey = scryptSync(password, salt, keyHex.length / 2) as Buffer;
	const expected = Buffer.from(keyHex, "hex");

	if (expected.length !== derivedKey.length) {
		return false;
	}

	return timingSafeEqual(expected, derivedKey);
}

function validateCredentials(username: string, _password: string): void {
	if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
		throw new Error(
			"Username can only contain letters, numbers, underscores, and hyphens.",
		);
	}
}

async function loadCurrentUser(): Promise<CurrentUser | null> {
	const session = await getSession<SessionData>(getSessionConfig());
	const username = session.data.username;
	if (!username) return null;

	try {
		const [user] = await db
			.select({ username: appUsers.username })
			.from(appUsers)
			.where(eq(appUsers.username, username))
			.limit(1);

		if (!user) return null;
		return { username: user.username };
	} catch (err) {
		// Neon free tier throws 53300 too_many_connections; don't crash beforeLoad
		console.error("[session] loadCurrentUser failed:", (err as Error).message);
		return null;
	}
}

export async function resolveCurrentUserServer(): Promise<CurrentUser | null> {
	return loadCurrentUser();
}

export async function signInServer(
	username: string,
	_password: string,
): Promise<CurrentUser> {
	validateCredentials(username, _password);

	const [user] = await db
		.select({
			username: appUsers.username,
			passwordHash: appUsers.passwordHash,
		})
		.from(appUsers)
		.where(eq(appUsers.username, username))
		.limit(1);

	if (!user) {
		throw new Error("Invalid username or password.");
	}

	const matches = verifyPassword(_password, user.passwordHash);

	if (!matches) {
		throw new Error("Invalid username or password.");
	}

	await updateSession<SessionData>(getSessionConfig(), {
		username: user.username,
	});

	return { username: user.username };
}

export async function signUpServer(
	username: string,
	password: string,
): Promise<CurrentUser> {
	validateCredentials(username, password);

	const [existing] = await db
		.select({ username: appUsers.username })
		.from(appUsers)
		.where(eq(appUsers.username, username))
		.limit(1);

	if (existing) {
		throw new Error("Username already exists.");
	}

	const passwordHash = hashPassword(password);

	const [created] = await db
		.insert(appUsers)
		.values({
			username,
			passwordHash,
		})
		.returning({ username: appUsers.username });

	if (!created) {
		throw new Error("Failed to create account.");
	}

	await updateSession<SessionData>(getSessionConfig(), {
		username: created.username,
	});

	return { username: created.username };
}

export async function logoutServer(): Promise<{ ok: true }> {
	await clearSession(getSessionConfig());
	return { ok: true };
}
