import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { data, error } = await supabase.from("surveys").select("*").order("createdAt", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { title, description, userId } = req.body;
    if (!title || !userId) return res.status(400).json({ error: "Title and user ID are required" });

    const { data, error } = await supabase
      .from("surveys")
      .insert({ title, description, userId })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ message: "Survey created successfully", data });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
