import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { updateContentField } from "@/lib/db/content";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, value } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: "Missing field ID" }, { status: 400 });
    }

    const updatedField = await updateContentField(id, value);

    // Trigger revalidation for the relevant page
    // We can revalidate the page based on the updatedField.page
    const pagePath = updatedField.page === "homepage" ? "/" : `/${updatedField.page}`;
    revalidatePath(pagePath);
    
    // Also revalidate the main layout for global settings
    revalidatePath("/", "layout");

    return NextResponse.json({ success: true, data: updatedField });
  } catch (error) {
    console.error("Save content error:", error);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
