/** Exercises the contact server action against the real DB. Run: npm run test:contact */
import "dotenv/config";
import assert from "node:assert/strict";
import { submitContact } from "../app/(site)/contact/actions";
import { prisma } from "../lib/db";

const fd = (o: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(o)) f.set(k, v);
  return f;
};
const good = { name: "Ada", email: "ada@example.com", organization: "Acme", subject: "Guest pitch", message: "I would like to be a guest on the show." };

let r = await submitContact({ status: "idle" }, fd({ ...good, email: "nope" }));
assert.equal(r.status, "error");
assert.ok(r.fieldErrors?.email, "invalid email must be caught");

r = await submitContact({ status: "idle" }, fd({ ...good, message: "short" }));
assert.ok(r.fieldErrors?.message, "short message must be caught");

r = await submitContact({ status: "idle" }, fd({ ...good, name: "A" }));
assert.ok(r.fieldErrors?.name, "short name must be caught");

// honeypot: reports success but must never persist
const before = await prisma.contactMessage.count();
r = await submitContact({ status: "idle" }, fd({ ...good, website: "spam" }));
assert.equal(r.status, "success");
assert.equal(await prisma.contactMessage.count(), before, "honeypot must not persist");

r = await submitContact({ status: "idle" }, fd(good));
assert.equal(r.status, "success", JSON.stringify(r));
const row = await prisma.contactMessage.findFirst({ orderBy: { createdAt: "desc" } });
assert.equal(row?.email, "ada@example.com");
assert.equal(row?.organization, "Acme");
await prisma.contactMessage.delete({ where: { id: row!.id } });

console.log("✓ contact form: validation, honeypot, persistence");
await prisma.$disconnect();
