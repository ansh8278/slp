import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
    const script = await prisma.customScript.findUnique({
      where: { id: "default" },
    });

    return NextResponse.json({
      headerCode: script?.headerCode || "",
      footerCode: script?.footerCode || "",
      pageBodyCodes: script?.pageBodyCodes || {},
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[GET /api/admin/scripts] Error:", error);
    return NextResponse.json({ error: "Failed to fetch scripts" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    const headerCode = typeof body.headerCode === "string" ? body.headerCode : "";
    const footerCode = typeof body.footerCode === "string" ? body.footerCode : "";
    const pageBodyCodes = typeof body.pageBodyCodes === "object" && body.pageBodyCodes !== null ? body.pageBodyCodes : {};

    const updated = await prisma.customScript.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        headerCode,
        footerCode,
        pageBodyCodes,
      },
      update: {
        headerCode,
        footerCode,
        pageBodyCodes,
      },
    });

    try {
      revalidatePath("/", "layout");
    } catch (e) {
      console.warn("revalidatePath notice:", e);
    }

    return NextResponse.json({
      success: true,
      script: {
        headerCode: updated.headerCode,
        footerCode: updated.footerCode,
        pageBodyCodes: updated.pageBodyCodes,
      },
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[PATCH /api/admin/scripts] Error:", error);
    return NextResponse.json({ error: "Failed to update scripts" }, { status: 500 });
  }
}
