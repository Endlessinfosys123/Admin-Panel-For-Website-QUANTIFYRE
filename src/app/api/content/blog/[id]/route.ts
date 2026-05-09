import { NextRequest, NextResponse } from "next/server";
import { getBlogPostById } from "@/lib/db/blog";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await getBlogPostById(params.id);
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}
