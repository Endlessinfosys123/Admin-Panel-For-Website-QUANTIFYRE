import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [
      { count: blogCount },
      { count: portfolioCount },
      { count: testimonialCount },
      { count: serviceCount },
      { data: mediaFiles }
    ] = await Promise.all([
      supabaseAdmin.from("blog_posts").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("portfolio_projects").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("testimonials").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("services").select("*", { count: "exact", head: true }),
      supabaseAdmin.storage.from("content").list()
    ]);

    return NextResponse.json({
      blog: blogCount || 0,
      portfolio: portfolioCount || 0,
      testimonials: testimonialCount || 0,
      services: serviceCount || 0,
      media: mediaFiles?.length || 0
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
