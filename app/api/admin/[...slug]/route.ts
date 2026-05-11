import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { listFiles, uploadFile, deleteFile } from "@/lib/db/storage";
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from "@/lib/db/users";
import { saveSettings } from "@/lib/db/settings";
import { saveNavigation, reorderNavigation } from "@/lib/db/navigation";
import { saveSection, reorderSections, deleteSection } from "@/lib/db/sections";
import { saveBlogPost, deleteBlogPost } from "@/lib/db/blog";
import { saveProject, deleteProject } from "@/lib/db/projects";
import { saveService, deleteService, reorderServices } from "@/lib/db/services";
import { saveTestimonial, deleteTestimonial, reorderTestimonials } from "@/lib/db/testimonials";
import { saveFAQ, deleteFAQ, reorderFAQs } from "@/lib/db/faq";
import { saveStat, deleteStat, reorderStats } from "@/lib/db/stats";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const path = slug.join("/");

  try {
    switch (path) {
      case "dashboard/stats":
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

      case "media/list":
        const files = await listFiles();
        return NextResponse.json(files);

      case "users/list":
        if (session.user?.role !== "super_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        const users = await getAdminUsers();
        return NextResponse.json(users);

      default:
        return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const path = slug.join("/");
  
  try {
    const data = await req.json();

    switch (path) {
      case "users/save":
        if (session.user?.role !== "super_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        const userResult = data.id ? await updateAdminUser(data.id, data) : await createAdminUser(data);
        return NextResponse.json(userResult);

      case "settings/save":
        const settingsResult = await saveSettings(data);
        return NextResponse.json(settingsResult);

      case "navigation/save":
        const navResult = await saveNavigation(data);
        return NextResponse.json(navResult);

      case "navigation/reorder":
        await reorderNavigation(data.items);
        return NextResponse.json({ success: true });

      case "sections/save":
        const sectionResult = await saveSection(data);
        return NextResponse.json(sectionResult);

      case "sections/reorder":
        await reorderSections(data.page, data.items);
        return NextResponse.json({ success: true });

      case "blog/save":
        const blogResult = await saveBlogPost(data);
        return NextResponse.json(blogResult);

      case "portfolio/save":
        const projectResult = await saveProject(data);
        return NextResponse.json(projectResult);

      case "services/save":
        const serviceResult = await saveService(data);
        return NextResponse.json(serviceResult);

      case "services/reorder":
        await reorderServices(data.items);
        return NextResponse.json({ success: true });

      case "testimonials/save":
        const testimonialResult = await saveTestimonial(data);
        return NextResponse.json(testimonialResult);

      case "testimonials/reorder":
        await reorderTestimonials(data.items);
        return NextResponse.json({ success: true });

      case "faq/save":
        const faqResult = await saveFAQ(data);
        return NextResponse.json(faqResult);

      case "faq/reorder":
        await reorderFAQs(data.items);
        return NextResponse.json({ success: true });

      case "stats/save":
        const statResult = await saveStat(data);
        return NextResponse.json(statResult);

      case "stats/reorder":
        await reorderStats(data.items);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const path = slug.join("/");
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  try {
    switch (path) {
      case "media/delete":
        await deleteFile(id); 
        return NextResponse.json({ success: true });

      case "users/delete":
        if (session.user?.role !== "super_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        if (id === session.user?.id) return NextResponse.json({ error: "Cannot delete self" }, { status: 400 });
        await deleteAdminUser(id);
        return NextResponse.json({ success: true });

      case "sections/delete":
        await deleteSection(id);
        return NextResponse.json({ success: true });

      case "blog/delete":
        await deleteBlogPost(id);
        return NextResponse.json({ success: true });

      case "portfolio/delete":
        await deleteProject(id);
        return NextResponse.json({ success: true });

      case "services/delete":
        await deleteService(id);
        return NextResponse.json({ success: true });

      case "testimonials/delete":
        await deleteTestimonial(id);
        return NextResponse.json({ success: true });

      case "faq/delete":
        await deleteFAQ(id);
        return NextResponse.json({ success: true });

      case "stats/delete":
        await deleteStat(id);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
