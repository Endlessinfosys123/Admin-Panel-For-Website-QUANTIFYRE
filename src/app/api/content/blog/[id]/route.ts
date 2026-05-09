import { NextRequest, NextResponse } from "next/server";
import { getBlogPostById } from "@/lib/db/blog";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await getBlogPostById(id);
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}
