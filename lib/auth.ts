import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";

const scryptAsync = promisify(scrypt) as (p: string, s: string, k: number) => Promise<Buffer>;
const COOKIE = "slp_session";
const MAX_AGE = 60 * 60 * 8; // 8h

let fallbackSecretCache: string | null = null;

function secret() {
  const s = process.env.AUTH_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("CRITICAL SECURITY ERROR: AUTH_SECRET environment variable is missing or shorter than 32 characters in production!");
  }
  if (!fallbackSecretCache) {
    fallbackSecretCache = randomBytes(32).toString("hex");
    console.warn("[SECURITY NOTICE] AUTH_SECRET not set in development. Using auto-generated 64-char HMAC secret.");
  }
  return fallbackSecretCache;
}

export function validatePasswordStrength(password: string): { valid: boolean; error?: string } {
  if (password.length < 10) return { valid: false, error: "Password must be at least 10 characters long." };
  if (!/[A-Z]/.test(password)) return { valid: false, error: "Password must contain at least one uppercase letter." };
  if (!/[a-z]/.test(password)) return { valid: false, error: "Password must contain at least one lowercase letter." };
  if (!/[0-9]/.test(password)) return { valid: false, error: "Password must contain at least one number." };
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { valid: false, error: "Password must contain at least one special character." };
  }
  return { valid: true };
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const key = await scryptAsync(password, salt, 64);
  return `${salt}:${key.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const key = await scryptAsync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  // timingSafeEqual throws on length mismatch
  return expected.length === key.length && timingSafeEqual(expected, key);
}

/** token = base64url(payload).hmac — payload is {sub,exp} */
function sign(payload: object) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const mac = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${mac}`;
}

function unsign(token: string): { sub: string; exp: number } | null {
  const [body, mac] = token.split(".");
  if (!body || !mac) return null;
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (typeof payload.exp !== "number" || payload.exp < Date.now() / 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(userId: string) {
  const jar = await cookies();
  jar.set(COOKIE, sign({ sub: userId, exp: Math.floor(Date.now() / 1000) + MAX_AGE }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function getSession() {
  const token = (await cookies()).get(COOKIE)?.value;
  return token ? unsign(token) : null;
}

/** Throws in server actions / pages that must be admin-only. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

/** Page/layout guard: redirects to the login screen instead of throwing. */
export async function requireAdminPage() {
  const { redirect } = await import("next/navigation");
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session!;
}
