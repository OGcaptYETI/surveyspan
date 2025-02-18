import PDFDocument from "pdfkit";
import supabase from "./supabase";
import fs from "fs";
import path from "path";

interface SurveyResponse {
  question: string;
  answer: string | number | boolean;
}

interface PDFGenerationResult {
  url: string;
  filename: string;
}

const storage = supabase.storage.from("survey_pdfs");

export async function generateSurveyPDF(
  surveyTitle: string, 
  surveyData: Record<string, SurveyResponse>
): Promise<PDFGenerationResult> {
  return new Promise((resolve, reject) => {
    try {
      // Validate inputs
      if (!surveyTitle?.trim()) {
        throw new Error("Survey title is required");
      }

      if (!surveyData || Object.keys(surveyData).length === 0) {
        throw new Error("Survey data is required");
      }

      // Create PDF
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        info: {
          Title: surveyTitle,
          Author: "RetailSpan",
          Creator: "RetailSpan PDF Generator"
        }
      });

      // Setup file handling
      const filename = `${surveyTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`;
      const filePath = path.join("/tmp", filename);
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // Add content
      doc.fontSize(20).text(`Survey Results: ${surveyTitle}`, { 
        align: "center",
        underline: true 
      });
      doc.moveDown(2);

      Object.entries(surveyData).forEach(([question, response]) => {
        doc.fontSize(14).text(question, { 
          underline: true,
          continued: false 
        });
        doc.fontSize(12).text(String(response.answer), { 
          indent: 20,
          align: "justify" 
        });
        doc.moveDown();
      });

      doc.end();

      // Handle stream completion
      stream.on("finish", async () => {
        try {
          const fileBuffer = fs.readFileSync(filePath);
          
          const { data, error } = await storage.upload(
            `pdfs/${filename}`, 
            fileBuffer,
            {
              cacheControl: "3600",
              contentType: "application/pdf",
              upsert: true
            }
          );

          // Cleanup
          fs.unlinkSync(filePath);

          if (error) throw error;

          const { data: { publicUrl } } = storage.getPublicUrl(`pdfs/${filename}`);

          resolve({
            url: publicUrl || "",
            filename
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          reject(new Error(`Failed to upload PDF: ${errorMessage}`));
        }
      });

      stream.on("error", (error) => {
        reject(new Error(`Failed to generate PDF: ${error.message}`));
      });

    } catch (error) {
      reject(error);
    }
  });
}
