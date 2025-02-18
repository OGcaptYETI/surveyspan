import type { Question } from "@/components/types/survey";

interface NumberInputProps {
  question: Question;
  updateQuestion: (updates: Partial<Question>) => void;
}

export default function NumberInput({ question, updateQuestion }: NumberInputProps) {
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

      {/* Respondent Number Input */}
      <input
        type="number"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-itg-red focus:border-itg-red"
        aria-label="Number input"
        disabled
      />
    </div>
  );
}
