import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const script = await prisma.customScript.findUnique({
      where: { id: "default" },
    });

    if (!script) {
      return NextResponse.json({
        headerCode: "",
        footerCode: "",
        pageBodyCodes: {},
      });
    }

    return NextResponse.json({
      headerCode: script.headerCode || "",
      footerCode: script.footerCode || "",
      pageBodyCodes: script.pageBodyCodes || {},
    });
  } catch (error) {
    console.error("[GET /api/scripts] Error:", error);
    return NextResponse.json(
      { headerCode: "", footerCode: "", pageBodyCodes: {} },
      { status: 500 }
    );
  }
}
