import type { Question } from "@/components/types/survey";

interface LikertScaleProps {
  question: Question;
  updateQuestion: (updates: Partial<Question>) => void;
}

export default function LikertScale({ question, updateQuestion }: LikertScaleProps) {
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

      {/* Respondent Likert Scale Input */}
      <select
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
        aria-label="Likert Scale selection"
        disabled
      >
        <option value="5">1-5</option>
        <option value="7">1-7</option>
        <option value="10">1-10</option>
      </select>
    </div>
  );
}
