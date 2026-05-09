import { supabaseAdmin } from "../supabase-admin";

export async function getProjects() {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createProject(project: any) {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .insert([project])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProject(id: string, updates: any) {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(id: string) {
  const { error } = await supabaseAdmin
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function updateProjectsOrder(orders: { id: string, position: number }[]) {
  const promises = orders.map(order => 
    supabaseAdmin
      .from("projects")
      .update({ position: order.position })
      .eq("id", order.id)
  );

  await Promise.all(promises);
}
