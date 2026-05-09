import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { listFiles } from "@/lib/db/storage";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const files = await listFiles();
    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 });
  }
}
