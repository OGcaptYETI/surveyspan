// 📂 lib/email.ts
import { Resend } from "resend";
import supabase from "./supabase";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function sendSurveyEmail(to: string, surveyTitle: string, pdfUrl: string) {
  if (!to || !surveyTitle || !pdfUrl) {
    throw new Error("Missing required parameters for sending survey email.");
  }

  const { data: template, error } = await supabase
    .from("email_templates")
    .select("subject, body")
    .eq("name", "survey_completion")
    .single();

  if (error || !template) {
    console.error("Email template not found:", error?.message);
    throw new Error("Email template not found.");
  }

  try {
    await resend.emails.send({
      from: "no-reply@surveyspan.com",
      to,
      subject: template.subject.replace("{{surveyTitle}}", surveyTitle),
      html: template.body.replace("{{surveyTitle}}", surveyTitle).replace("{{pdfUrl}}", pdfUrl),
    });
  } catch (err) {
    console.error("Error sending survey email:", err);
    throw new Error("Failed to send survey email.");
  }
}
