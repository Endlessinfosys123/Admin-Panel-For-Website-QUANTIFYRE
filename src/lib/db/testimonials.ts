import { supabaseAdmin } from "../supabase-admin";

export async function getTestimonials() {
  const { data, error } = await supabaseAdmin
    .from("testimonials")
    .select("*")
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createTestimonial(testimonial: any) {
  const { data, error } = await supabaseAdmin
    .from("testimonials")
    .insert([testimonial])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTestimonial(id: string, updates: any) {
  const { data, error } = await supabaseAdmin
    .from("testimonials")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTestimonial(id: string) {
  const { error } = await supabaseAdmin
    .from("testimonials")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function updateTestimonialsOrder(orders: { id: string, position: number }[]) {
  const promises = orders.map(order => 
    supabaseAdmin
      .from("testimonials")
      .update({ position: order.position })
      .eq("id", order.id)
  );

  await Promise.all(promises);
}
