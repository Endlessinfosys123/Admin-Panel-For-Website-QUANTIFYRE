import { supabaseAdmin } from "../supabase-admin";

export async function getPageSections(pageId: string) {
  const { data, error } = await supabaseAdmin
    .from("page_sections")
    .select("*")
    .eq("page_id", pageId)
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

export async function updateSectionsOrder(orders: { id: string, position: number }[]) {
  const promises = orders.map(order => 
    supabaseAdmin
      .from("page_sections")
      .update({ position: order.position })
      .eq("id", order.id)
  );

  await Promise.all(promises);
}

export async function createSection(section: any) {
  const { data, error } = await supabaseAdmin
    .from("page_sections")
    .insert([section])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSection(id: string, updates: any) {
  const { data, error } = await supabaseAdmin
    .from("page_sections")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSection(id: string) {
  const { error } = await supabaseAdmin
    .from("page_sections")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
