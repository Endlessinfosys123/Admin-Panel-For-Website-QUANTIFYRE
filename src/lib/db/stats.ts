import { supabaseAdmin } from "../supabase-admin";

export async function getStats() {
  const { data, error } = await supabaseAdmin
    .from("site_stats")
    .select("*")
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createStat(stat: any) {
  const { data, error } = await supabaseAdmin
    .from("site_stats")
    .insert([stat])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateStat(id: string, updates: any) {
  const { data, error } = await supabaseAdmin
    .from("site_stats")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteStat(id: string) {
  const { error } = await supabaseAdmin
    .from("site_stats")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function updateStatsOrder(orders: { id: string, position: number }[]) {
  const promises = orders.map(order => 
    supabaseAdmin
      .from("site_stats")
      .update({ position: order.position })
      .eq("id", order.id)
  );

  await Promise.all(promises);
}
