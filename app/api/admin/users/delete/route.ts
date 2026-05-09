import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { deleteAdminUser } from "@/lib/db/users";

export async function DELETE(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session || session.user?.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    // Prevent self-deletion
    if (id === session.user?.id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    await deleteAdminUser(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
