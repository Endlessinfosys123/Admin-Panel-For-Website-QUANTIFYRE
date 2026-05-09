import { supabaseAdmin } from "../supabase-admin";

export async function getSiteSettings() {
  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("*")
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data || {};
}

export async function updateSiteSettings(updates: any) {
  // Check if settings exist
  const { data: existing } = await supabaseAdmin
    .from("site_settings")
    .select("id")
    .limit(1)
    .single();

  let error;
  if (existing) {
    ({ error } = await supabaseAdmin
      .from("site_settings")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", existing.id));
  } else {
    ({ error } = await supabaseAdmin
      .from("site_settings")
      .insert([updates]));
  }

  if (error) throw error;
  return updates;
}
