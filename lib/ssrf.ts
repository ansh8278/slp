import { URL } from "node:url";

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "[::1]",
  "169.254.169.254", // Cloud metadata (AWS/GCP/Azure)
  "metadata.google.internal",
]);

/** Validate URL to protect against SSRF (Server-Side Request Forgery). */
export function isSafePublicUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    
    // Only allow HTTP/HTTPS
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }

    const host = parsed.hostname.toLowerCase();

    // Check explicitly blocked hostnames
    if (BLOCKED_HOSTNAMES.has(host)) {
      return false;
    }

    // Check private IPv4 ranges (10.x.x.x, 172.16.x.x - 172.31.x.x, 192.168.x.x)
    if (/^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host)) {
      return false;
    }
    if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
