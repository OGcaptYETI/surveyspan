import React from 'react';
import type { Question } from "@/components/types/survey";

interface QuestionFieldProps {
  question: Question;
  updateQuestion: (updates: Partial<Question>) => void;
}

export default function QuestionField({ question, updateQuestion }: QuestionFieldProps) {
  return (
    <div className="space-y-2">
      {/* Single Input for Question */}
      <input
        type="text"
        value={question.text}
        onChange={(e) => updateQuestion({ text: e.target.value })}
        placeholder="Enter your question"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-itg-red focus:border-transparent"
      />

      {/* Help Text Input */}
      {question.helpText !== undefined && (
        <input
          type="text"
          value={question.helpText}
          onChange={(e) => updateQuestion({ helpText: e.target.value })}
          placeholder="Help text (optional)"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-itg-red focus:border-transparent"
        />
      )}
    </div>
  );
}
