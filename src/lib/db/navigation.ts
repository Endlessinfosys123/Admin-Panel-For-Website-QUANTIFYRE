import { supabaseAdmin } from "../supabase-admin";

export async function getNavigation(type: "header" | "footer") {
  const { data, error } = await supabaseAdmin
    .from("navigation_links")
    .select("*")
    .eq("type", type)
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createNavigationLink(link: any) {
  const { data, error } = await supabaseAdmin
    .from("navigation_links")
    .insert([link])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateNavigationLink(id: string, updates: any) {
  const { data, error } = await supabaseAdmin
    .from("navigation_links")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteNavigationLink(id: string) {
  const { error } = await supabaseAdmin
    .from("navigation_links")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function updateNavigationOrder(orders: { id: string, position: number, parent_id?: string | null }[]) {
  const promises = orders.map(order => 
    supabaseAdmin
      .from("navigation_links")
      .update({ position: order.position, parent_id: order.parent_id })
      .eq("id", order.id)
  );

  await Promise.all(promises);
}
