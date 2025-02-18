import PDFDocument from "pdfkit";
import blobStream from "blob-stream";

interface PDFData {
  [key: string]: string;
}

interface BlobStream extends NodeJS.WritableStream {
  toBlob: (type: string) => Blob;
}


export default function generatePDF(data: PDFData): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const stream = doc.pipe(blobStream()) as BlobStream;

      doc.fontSize(20).text("Survey Report", { align: "center" });
      doc.moveDown();

      Object.entries(data).forEach(([key, value]) => {
        doc.fontSize(14).text(`${key}: ${value}`);
        doc.moveDown(0.5);
      });

      doc.end();

      stream.on("finish", () => {
        resolve(stream.toBlob("application/pdf"));
      });

      stream.on("error", (error: Error) => {
        console.error("Error generating PDF:", error);
        reject(error);
      });
    } catch (error) {
      console.error("Error creating PDF:", error instanceof Error ? error.message : error);
      reject(error);
    }
  });
}