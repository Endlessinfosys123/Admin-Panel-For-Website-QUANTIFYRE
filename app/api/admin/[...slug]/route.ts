import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { listFiles, uploadFile, deleteFile } from "@/lib/db/storage";
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from "@/lib/db/users";
import { updateSiteSettings } from "@/lib/db/settings";
import { createNavigationLink, updateNavigationLink, updateNavigationOrder, deleteNavigationLink } from "@/lib/db/navigation";
import { createSection, updateSection, updateSectionsOrder, deleteSection } from "@/lib/db/sections";
import { createBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/db/blog";
import { createProject, updateProject, deleteProject } from "@/lib/db/projects";
import { createService, updateService, updateServicesOrder, deleteService } from "@/lib/db/services";
import { createTestimonial, updateTestimonial, updateTestimonialsOrder, deleteTestimonial } from "@/lib/db/testimonials";
import { createFAQ, updateFAQ, updateFAQsOrder, deleteFAQ } from "@/lib/db/faq";
import { createStat, updateStat, updateStatsOrder, deleteStat } from "@/lib/db/stats";

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
    // Handle Media Upload separately (it uses FormData)
    if (path === "media/upload") {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const url = await uploadFile(file, fileName);
      return NextResponse.json({ url });
    }

    const data = await req.json();

    switch (path) {
      case "users/save":
        if (session.user?.role !== "super_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        const userResult = data.id ? await updateAdminUser(data.id, data) : await createAdminUser(data);
        return NextResponse.json(userResult);

      case "settings/save":
        const settingsResult = await updateSiteSettings(data);
        return NextResponse.json(settingsResult);

      case "navigation/save":
        const navResult = data.id ? await updateNavigationLink(data.id, data) : await createNavigationLink(data);
        return NextResponse.json(navResult);

      case "navigation/reorder":
        await updateNavigationOrder(data.items);
        return NextResponse.json({ success: true });

      case "sections/save":
        const sectionResult = data.id ? await updateSection(data.id, data) : await createSection(data);
        return NextResponse.json(sectionResult);

      case "sections/reorder":
        await updateSectionsOrder(data.items);
        return NextResponse.json({ success: true });

      case "blog/save":
        const blogResult = data.id ? await updateBlogPost(data.id, data) : await createBlogPost(data);
        return NextResponse.json(blogResult);

      case "portfolio/save":
        const projectResult = data.id ? await updateProject(data.id, data) : await createProject(data);
        return NextResponse.json(projectResult);

      case "services/save":
        const serviceResult = data.id ? await updateService(data.id, data) : await createService(data);
        return NextResponse.json(serviceResult);

      case "services/reorder":
        await updateServicesOrder(data.items);
        return NextResponse.json({ success: true });

      case "testimonials/save":
        const testimonialResult = data.id ? await updateTestimonial(data.id, data) : await createTestimonial(data);
        return NextResponse.json(testimonialResult);

      case "testimonials/reorder":
        await updateTestimonialsOrder(data.items);
        return NextResponse.json({ success: true });

      case "faq/save":
        const faqResult = data.id ? await updateFAQ(data.id, data) : await createFAQ(data);
        return NextResponse.json(faqResult);

      case "faq/reorder":
        await updateFAQsOrder(data.items);
        return NextResponse.json({ success: true });

      case "stats/save":
        const statResult = data.id ? await updateStat(data.id, data) : await createStat(data);
        return NextResponse.json(statResult);

      case "stats/reorder":
        await updateStatsOrder(data.items);
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

      case "navigation/delete":
        await deleteNavigationLink(id);
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
