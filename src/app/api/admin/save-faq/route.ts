import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createFAQ, updateFAQ, deleteFAQ } from "@/lib/db/faq";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const { id, ...updates } = data;

    let result;
    if (id) {
      result = await updateFAQ(id, updates);
    } else {
      result = await createFAQ(updates);
    }

    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/contact");

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await deleteFAQ(id);
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
