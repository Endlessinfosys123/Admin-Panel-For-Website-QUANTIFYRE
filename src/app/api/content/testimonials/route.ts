import { NextRequest, NextResponse } from "next/server";
import { getTestimonials } from "@/lib/db/testimonials";

export async function GET() {
  try {
    const testimonials = await getTestimonials();
    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}
