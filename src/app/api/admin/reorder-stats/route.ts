import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { updateStatsOrder } from "@/lib/db/stats";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { items } = await req.json();
    await updateStatsOrder(items);

    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Reorder failed" }, { status: 500 });
  }
}
