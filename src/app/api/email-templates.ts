// 📂 pages/admin/email-templates.tsx
import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { data, error } = await supabase.from("email_templates").select("*");
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "PUT") {
    const { id, subject, body } = req.body;
    if (!id || !subject || !body) return res.status(400).json({ error: "Missing required fields" });

    const { data, error } = await supabase
      .from("email_templates")
      .update({ subject, body })
      .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: "Email template updated successfully", data });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
