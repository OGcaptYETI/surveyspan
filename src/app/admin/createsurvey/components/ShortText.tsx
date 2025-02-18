import React from 'react';
import type { Question } from "@/components/types/survey";

interface ShortTextProps {
  question: Question;
  updateQuestion: (updates: Partial<Question>) => void;
}

export default function ShortText({ question, updateQuestion }: ShortTextProps) {
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
      <input
        type="text"
        placeholder="Type your answer here..."
        maxLength={150}  // Character limit for short text
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
        disabled
      />
      <p className="text-sm text-gray-500">Limit: 150 characters</p>
    </div>
  );
}

