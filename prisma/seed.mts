/** Creates (or resets) the admin user. Run: npm run admin:create */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import { hashPassword } from "../lib/auth";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main() {
  const email = (process.argv[2] ?? process.env.ADMIN_EMAIL ?? "").toLowerCase().trim();
  const password = process.argv[3] ?? process.env.ADMIN_PASSWORD ?? "";

  if (!email || password.length < 10) {
    console.error("Usage: npm run admin:create -- <email> <password>   (password: 10+ characters)");
    process.exit(1);
  }

  const hash = await hashPassword(password);
  await prisma.adminUser.upsert({
    where: { email },
    create: { email, password: hash },
    update: { password: hash },
  });
  console.log(`Admin ready: ${email}`);
}

main().finally(() => prisma.$disconnect());
