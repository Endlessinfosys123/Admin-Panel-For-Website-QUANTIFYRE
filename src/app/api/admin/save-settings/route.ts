import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { updateSiteSettings } from "@/lib/db/settings";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const updates = await req.json();
    const result = await updateSiteSettings(updates);

    revalidatePath("/");
    revalidatePath("/(site)", "layout"); // Revalidate the whole site layout to update theme

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}
