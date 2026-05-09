import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAdminUsers } from "@/lib/db/users";

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = (await getServerSession(authOptions)) as any;
  if (!session || session.user?.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await getAdminUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
