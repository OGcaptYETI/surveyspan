import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { surveyId, userId, answers } = req.body;
    if (!surveyId || !userId || !answers) return res.status(400).json({ error: "Missing required fields" });

    const { data, error } = await supabase.from("responses").insert({ surveyId, userId, answers });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ message: "Response saved successfully", data });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
