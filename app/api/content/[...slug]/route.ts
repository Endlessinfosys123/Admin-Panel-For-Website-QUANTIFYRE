import { NextRequest, NextResponse } from "next/server";
import { getPageContent } from "@/lib/db/content";
import { getBlogPosts, getBlogPostById } from "@/lib/db/blog";
import { getProjects } from "@/lib/db/projects";
import { getServices } from "@/lib/db/services";
import { getTestimonials } from "@/lib/db/testimonials";
import { getFAQs } from "@/lib/db/faq";
import { getStats } from "@/lib/db/stats";
import { getNavigation } from "@/lib/db/navigation";
import { getSiteSettings } from "@/lib/db/settings";
import { getSections } from "@/lib/db/sections";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const path = slug.join("/");

  try {
    switch (path) {
      case "navigation":
        const nav = await getNavigation();
        return NextResponse.json(nav);
      
      case "settings":
        const settings = await getSiteSettings();
        return NextResponse.json(settings);

      case "blog":
        const posts = await getBlogPosts();
        return NextResponse.json(posts);

      case "portfolio":
        const projects = await getProjects();
        return NextResponse.json(projects);

      case "services":
        const services = await getServices();
        return NextResponse.json(services);

      case "testimonials":
        const testimonials = await getTestimonials();
        return NextResponse.json(testimonials);

      case "faq":
        const faqs = await getFAQs();
        return NextResponse.json(faqs);

      case "stats":
        const stats = await getStats();
        return NextResponse.json(stats);

      case "sections":
        const pageParam = new URL(req.url).searchParams.get("page");
        const sections = await getSections(pageParam || "home");
        return NextResponse.json(sections);

      default:
        // Handle blog/[id] and other dynamic patterns
        if (path.startsWith("blog/")) {
          const id = path.split("/")[1];
          const post = await getBlogPostById(id);
          return NextResponse.json(post);
        }
        
        // Fallback to page content
        const content = await getPageContent(path);
        return NextResponse.json(content);
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}
