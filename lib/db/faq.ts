import { supabaseAdmin } from "../supabase-admin";

export async function getFAQs(page: string) {
  const { data, error } = await supabaseAdmin
    .from("faqs")
    .select("*")
    .eq("page", page)
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createFAQ(faq: any) {
  const { data, error } = await supabaseAdmin
    .from("faqs")
    .insert([faq])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateFAQ(id: string, updates: any) {
  const { data, error } = await supabaseAdmin
    .from("faqs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFAQ(id: string) {
  const { error } = await supabaseAdmin
    .from("faqs")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function updateFAQsOrder(orders: { id: string, position: number }[]) {
  const promises = orders.map(order => 
    supabaseAdmin
      .from("faqs")
      .update({ position: order.position })
      .eq("id", order.id)
  );

  await Promise.all(promises);
}
