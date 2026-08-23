import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import { hashPassword } from "../lib/auth";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hash = await hashPassword("SLPSecure2026!");
  const user = await prisma.adminUser.upsert({
    where: { email: "admin@bsa.in" },
    create: { email: "admin@bsa.in", password: hash },
    update: { password: hash },
  });
  console.log(`✅ Admin user admin@bsa.in successfully created on Supabase! (ID: ${user.id})`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
