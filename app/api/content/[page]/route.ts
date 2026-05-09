import { NextRequest, NextResponse } from "next/server";
import { getPageContent } from "@/lib/db/content";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const { page } = await params;
    const content = await getPageContent(page);
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}
