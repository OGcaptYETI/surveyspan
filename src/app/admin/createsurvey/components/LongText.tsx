import React from 'react';
import type { Question } from "@/components/types/survey";

interface LongTextProps {
  question: Question;
  updateQuestion: (updates: Partial<Question>) => void;
}

export default function LongText({ question, updateQuestion }: LongTextProps) {
  return (
    <div className="space-y-2">
      {/* Admin Input - Enter Question */}
      <input
        type="text"
        value={question.text || ''}
        onChange={(e) => updateQuestion({ text: e.target.value })}
        placeholder="Enter your question"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-itg-red focus:border-transparent font-semibold"
      />

      {/* Respondent Input - Answer Field */}
      <textarea
        placeholder="Type your answer here..."
        rows={4}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-y"
        disabled
      />
      <p className="text-sm text-gray-500">Expandable for longer responses</p>
    </div>
  );
}

