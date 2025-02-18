import type { Question } from "@/components/types/survey";

interface FileUploadProps {
  question: Question;
  updateQuestion: (updates: Partial<Question>) => void;
}

export default function FileUpload({ question, updateQuestion }: FileUploadProps) {
  return (
    <div className="space-y-4 bg-white p-4 border border-gray-300 rounded-md shadow-sm">
      {/* Admin Input - Enter Question */}
      <input
        type="text"
        value={question.text || ""}
        onChange={(e) => updateQuestion({ text: e.target.value })}
        placeholder="Enter your question"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-itg-red focus:border-transparent font-semibold"
      />

      {/* Respondent File Upload Input */}
      <input
        type="file"
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
        aria-label="File upload input"
        disabled
      />
    </div>
  );
}
