import { supabaseAdmin } from "../supabase-admin";

export async function getServices() {
  const { data, error } = await supabaseAdmin
    .from("services")
    .select("*")
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createService(service: any) {
  const { data, error } = await supabaseAdmin
    .from("services")
    .insert([service])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateService(id: string, updates: any) {
  const { data, error } = await supabaseAdmin
    .from("services")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteService(id: string) {
  const { error } = await supabaseAdmin
    .from("services")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function updateServicesOrder(orders: { id: string, position: number }[]) {
  const promises = orders.map(order => 
    supabaseAdmin
      .from("services")
      .update({ position: order.position })
      .eq("id", order.id)
  );

  await Promise.all(promises);
}
