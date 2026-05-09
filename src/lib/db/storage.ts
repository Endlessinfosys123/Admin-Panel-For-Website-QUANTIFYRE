import { supabaseAdmin } from "../supabase-admin";

const BUCKET_NAME = "content";

export async function uploadFile(file: File, path: string) {
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw error;
  
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return publicUrl;
}

export async function listFiles(path: string = "") {
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .list(path, {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

  if (error) throw error;
  return data;
}

export async function deleteFile(path: string) {
  const { error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .remove([path]);

  if (error) throw error;
}
