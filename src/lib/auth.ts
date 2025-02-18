// 📂 lib/auth.ts
import supabase from "./supabase";

export async function getUserRole(userId: string): Promise<string | null> {
  if (!userId) throw new Error("User ID is required");

  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user role:", error.message);
    return null;
  }

  return data?.role || null;
}
