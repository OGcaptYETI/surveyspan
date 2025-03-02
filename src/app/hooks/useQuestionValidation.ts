import { useCallback } from 'react';
import type { Question } from "@/components/types/survey";

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export default function useQuestionValidation() {
  const validateQuestion = useCallback((question: Question): ValidationResult => {
    // Required field validation
    if (question.required && !question.text.trim()) {
      return {
        isValid: false,
        error: 'Question text is required'
      };
    }

    // Option validation for choice-based questions
    if (['multiple_choice', 'checkbox', 'radio'].includes(question.type)) {
      if (!question.options || question.options.length === 0) {
        return {
          isValid: false,
          error: `${question.type.replace('_', ' ')} questions require at least one option`
        };
      }

      // Check for duplicate options
      const optionTexts = question.options.map(opt => opt.text.trim().toLowerCase());
      if (new Set(optionTexts).size !== optionTexts.length) {
        return {
          isValid: false,
          error: 'Duplicate options are not allowed'
        };
      }
    }

    // Custom validation types
    if (question.validation?.type !== 'none') {
      switch (question.validation?.type) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(question.text)) {
            return {
              isValid: false,
              error: 'Invalid email format'
            };
          }
          break;

        case 'url':
          try {
            new URL(question.text);
          } catch {
            return {
              isValid: false,
              error: 'Invalid URL format'
            };
          }
          break;

        case 'number':
          if (isNaN(Number(question.text))) {
            return {
              isValid: false,
              error: 'Must be a valid number'
            };
          }
          break;

        // Add more validation types as needed
      }
    }

    return { isValid: true };
  }, []);

  return { validateQuestion };
}