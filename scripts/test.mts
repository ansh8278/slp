/** Smallest thing that fails if the parsing / auth logic breaks. Run: npm test */
import "dotenv/config";
import assert from "node:assert/strict";
import { parseVideoId, formatDuration } from "../lib/video";
import { excerpt } from "../lib/site";
import { hashPassword, verifyPassword } from "../lib/auth";

// --- parseVideoId ---
for (const input of [
  "dQw4w9WgXcQ",
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s",
  "https://youtu.be/dQw4w9WgXcQ",
  "https://www.youtube.com/embed/dQw4w9WgXcQ",
  "https://www.youtube.com/shorts/dQw4w9WgXcQ",
  "  https://www.youtube.com/live/dQw4w9WgXcQ  ",
]) {
  assert.equal(parseVideoId(input), "dQw4w9WgXcQ", `parseVideoId(${input})`);
}
for (const bad of ["", "not a url", "https://example.com/watch?v=short", "https://youtu.be/tooshort", "abc"]) {
  assert.equal(parseVideoId(bad), null, `parseVideoId should reject ${JSON.stringify(bad)}`);
}
// real ids from the channel
assert.equal(parseVideoId("https://www.youtube.com/watch?v=ep34kPRQpmg"), "ep34kPRQpmg");

// --- formatDuration ---
assert.equal(formatDuration("PT42M11S"), "42:11");
assert.equal(formatDuration("PT1H2M10S"), "1:02:10");
assert.equal(formatDuration("PT58S"), "0:58");
assert.equal(formatDuration("P1DT2H3M4S"), "26:03:04");
assert.equal(formatDuration(null), null);
assert.equal(formatDuration("garbage"), null);

// --- excerpt: YouTube descriptions carry link/hashtag lines we must drop ---
assert.equal(excerpt("This is the Security Leader Podcast"), "This is the Security Leader Podcast");
assert.equal(excerpt("Real line\nhttps://example.com\n#tag"), "Real line");
assert.equal(excerpt("https://only.example.com"), "");
{
  const long = "word ".repeat(80).trim();
  const out = excerpt(long, 40);
  assert.ok(out.length <= 41 && out.endsWith("…"), `truncation: ${out}`);
}

// --- password hashing ---
{
  const stored = await hashPassword("correct horse battery staple");
  assert.ok(await verifyPassword("correct horse battery staple", stored), "correct password must verify");
  assert.equal(await verifyPassword("wrong password", stored), false, "wrong password must fail");
  assert.equal(await verifyPassword("anything", "malformed"), false, "malformed hash must fail, not throw");
  assert.equal(await verifyPassword("anything", "x:00"), false, "login dummy hash must fail");
  const again = await hashPassword("correct horse battery staple");
  assert.notEqual(again, stored, "salt must differ per hash");
}

console.log("✓ all checks passed");
