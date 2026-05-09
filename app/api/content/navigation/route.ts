import { NextRequest, NextResponse } from "next/server";
import { getNavigation } from "@/lib/db/navigation";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = (searchParams.get("type") as "header" | "footer") || "header";
    const links = await getNavigation(type);
    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 });
  }
}
