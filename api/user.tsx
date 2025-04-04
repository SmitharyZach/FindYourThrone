import { supabase } from "@/lib/supabase";

// Get list of bathrooms with their average ratings
export async function deleteUser(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);
  if (error) throw error;
  return data;
}
