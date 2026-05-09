import { NextRequest, NextResponse } from "next/server";
import { getPageContent } from "@/lib/db/content";

export async function GET(
  req: NextRequest,
  { params }: { params: { page: string } }
) {
  try {
    const page = params.page;
    const content = await getPageContent(page);
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}
