import { supabaseAdmin } from "../supabase-admin";

export async function getPageContent(page: string) {
  const { data, error } = await supabaseAdmin
    .from("page_content")
    .select("*")
    .eq("page", page)
    .order("section", { ascending: true });

  if (error) {
    console.error("Error fetching page content:", error);
    return [];
  }

  return data;
}

export async function updateContentField(id: string, value: string) {
  const { data, error } = await supabaseAdmin
    .from("page_content")
    .update({ field_value: value, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating content field:", error);
    throw error;
  }

  return data;
}
