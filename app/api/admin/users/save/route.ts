import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createAdminUser, updateAdminUser } from "@/lib/db/users";

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session || session.user?.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { id, ...updates } = data;

    let result;
    if (id) {
      result = await updateAdminUser(id, updates);
    } else {
      result = await createAdminUser(updates);
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}
