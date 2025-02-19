import { useCallback } from 'react';
import type { Question } from "@/components/types/survey";

export default function useQuestionValidation() {
  const validateQuestion = useCallback((question: Question): boolean => {
    if (question.required && !question.text) return false;
    if (question.type === "multiple_choice" && (!question.options || question.options.length === 0)) return false;
    if (question.validation?.type !== 'none') {
      // Add custom validation logic here
      return true;
    }
    return true;
  }, []);

  return { validateQuestion };
}