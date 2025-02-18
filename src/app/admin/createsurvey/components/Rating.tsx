import type { Question } from "@/components/types/survey";

interface RatingProps {
  question: Question;
  updateQuestion: (updates: Partial<Question>) => void;
}

export default function Rating({ question, updateQuestion }: RatingProps) {
  return (
    <div className="space-y-4 bg-white p-4 border border-gray-300 rounded-md shadow-sm">
      {/* Admin Question Input */}
      <input
        type="text"
        value={question.text || ""}
        onChange={(e) => updateQuestion({ text: e.target.value })}
        placeholder="Enter your question"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-itg-red focus:border-transparent"
      />

      {/* Maximum Rating Input */}
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-4">
          <input
            type="number"
            min="1"
            max="10"
            value={question.validation?.max || 5}
            onChange={(e) => {
              const maxValue = Math.max(1, parseInt(e.target.value, 10) || 5);
              updateQuestion({
                validation: {
                  ...question.validation,
                  max: maxValue,
                  message: question.validation?.message || '',
                  type: question.validation?.type || 'rating',
                },
              });
            }}
            className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:ring-itg-red focus:border-itg-red"
            title="Maximum rating value"
            aria-label="Maximum rating value"
          />
          <span className="text-sm text-gray-500">Max rating value (1-10)</span>
        </label>
      </div>

      {/* Optional Description Input */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={question.helpText || ""}
          onChange={(e) => updateQuestion({ helpText: e.target.value })}
          placeholder="Rating scale description (optional)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-itg-red focus:border-itg-red"
        />
      </div>
    </div>
  );
}
