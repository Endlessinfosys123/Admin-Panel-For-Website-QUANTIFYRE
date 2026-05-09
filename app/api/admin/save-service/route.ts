import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createService, updateService, deleteService, updateServicesOrder } from "@/lib/db/services";
import { revalidatePath } from "next/cache";

// CREATE
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const { id, ...updates } = data;

    let result;
    if (id) {
      // Update
      result = await updateService(id, updates);
    } else {
      // Create
      result = await createService(updates);
    }

    revalidatePath("/services");
    revalidatePath("/");

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}

