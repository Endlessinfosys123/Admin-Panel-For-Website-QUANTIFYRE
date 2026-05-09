import { supabaseAdmin } from "../supabase-admin";

export async function getBlogPosts() {
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getBlogPostById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createBlogPost(post: any) {
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .insert([post])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBlogPost(id: string, updates: any) {
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabaseAdmin
    .from("blog_posts")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
