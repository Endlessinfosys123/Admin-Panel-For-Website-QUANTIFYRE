import { supabaseAdmin } from "../supabase-admin";
import bcrypt from "bcryptjs";

export async function getAdminUsers() {
  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .select("id, email, full_name, role, last_login, created_at");

  if (error) throw error;
  return data;
}

export async function createAdminUser(user: any) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .insert([{ ...user, password: hashedPassword }])
    .select("id, email, full_name, role")
    .single();

  if (error) throw error;
  return data;
}

export async function updateAdminUser(id: string, updates: any) {
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }
  
  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, email, full_name, role")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAdminUser(id: string) {
  const { error } = await supabaseAdmin
    .from("admin_users")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
