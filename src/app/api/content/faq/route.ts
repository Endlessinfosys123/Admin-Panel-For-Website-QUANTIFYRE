import { NextRequest, NextResponse } from "next/server";
import { getFAQs } from "@/lib/db/faq";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "Homepage";
    const faqs = await getFAQs(page);
    return NextResponse.json(faqs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}
