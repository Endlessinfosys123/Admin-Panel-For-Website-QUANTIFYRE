import { NextRequest, NextResponse } from "next/server";
import { getPageSections } from "@/lib/db/sections";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pageId = searchParams.get("page_id");
    if (!pageId) return NextResponse.json({ error: "Missing page_id" }, { status: 400 });

    const sections = await getPageSections(pageId);
    return NextResponse.json(sections);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sections" }, { status: 500 });
  }
}
