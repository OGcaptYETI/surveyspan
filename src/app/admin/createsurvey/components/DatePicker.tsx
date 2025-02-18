import type { Question } from "@/components/types/survey";

interface DatePickerProps {
  question: Question;
  updateQuestion: (updates: Partial<Question>) => void;
}

export default function DatePicker({ question, updateQuestion }: DatePickerProps) {
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

      {/* Respondent Date Input */}
      <input
        type="date"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-itg-red focus:border-itg-red"
        aria-label="Date input"
        disabled
      />
    </div>
  );
}
