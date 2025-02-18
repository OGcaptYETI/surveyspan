import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/lib/supabase";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { data, error } = await supabase.from("questions").select("*");
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { surveyId, question, type } = req.body;
    if (!surveyId || !question || !type) return res.status(400).json({ error: "Missing required fields" });

    const { data, error } = await supabase
      .from("questions")
      .insert({ surveyId, question, type })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ message: "Question added successfully", data });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
