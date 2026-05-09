import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createBlogPost, updateBlogPost } from "@/lib/db/blog";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const { id, ...updates } = data;

    let result;
    if (id && id !== "new") {
      result = await updateBlogPost(id, updates);
    } else {
      result = await createBlogPost(updates);
    }

    revalidatePath("/blog");
    revalidatePath(`/blog/${result.slug}`);
    revalidatePath("/");

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}
