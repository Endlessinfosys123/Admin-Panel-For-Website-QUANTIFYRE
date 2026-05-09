import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/db/settings";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}
