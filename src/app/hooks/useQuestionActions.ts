import { useCallback } from 'react';
import type { Question, QuestionType, Option } from '@/components/types/survey';

interface QuestionActions {
  setOptions: (options: Option[]) => void;
  addOption: () => void;
  deleteOption: (optionId: string) => void;
  setType: (type: QuestionType) => void;
  setText: (text: string) => void;
  setRequired: (required: boolean) => void;
  setHelpText: (text: string) => void;
  setPlaceholder: (text: string) => void;
  deleteQuestion: () => void;
  moveUp: () => void;
  moveDown: () => void;
  duplicateQuestion: () => void;
  updateOption: (optionId: string, updates: Partial<Option>) => void;
}

export const useQuestionActions = (
  question: Question,
  updateQuestion: (questionId: string, updates: Partial<Question>) => void,
  deleteQuestion: (questionId: string) => void
): QuestionActions => {
  return {
    setOptions: useCallback((options) => {
      updateQuestion(question.id, { options });
    }, [question.id, updateQuestion]),

    addOption: useCallback(() => {
      const newOption: Option = {
        id: crypto.randomUUID(),
        text: '',
        value: '',
        order: question.options.length,
        isValid: true,
        validationType: 'none'
      };
      updateQuestion(question.id, {
        options: [...question.options, newOption]
      });
    }, [question.id, question.options, updateQuestion]),

    deleteOption: useCallback((optionId) => {
      updateQuestion(question.id, {
        options: question.options.filter(option => option.id !== optionId)
      });
    }, [question.id, question.options, updateQuestion]),

    setType: useCallback((type) => {
      updateQuestion(question.id, { type });
    }, [question.id, updateQuestion]),

    setText: useCallback((text) => {
      updateQuestion(question.id, { text });
    }, [question.id, updateQuestion]),

    setRequired: useCallback((required) => {
      updateQuestion(question.id, { required });
    }, [question.id, updateQuestion]),

    setHelpText: useCallback((helpText) => {
      updateQuestion(question.id, { helpText });
    }, [question.id, updateQuestion]),

    setPlaceholder: useCallback((placeholder) => {
      updateQuestion(question.id, { placeholder });
    }, [question.id, updateQuestion]),

    deleteQuestion: useCallback(() => {
      deleteQuestion(question.id);
    }, [question.id, deleteQuestion]),

    moveUp: useCallback(() => {
      updateQuestion(question.id, { order: (question.order || 0) - 1 });
    }, [question.id, question.order, updateQuestion]),

    moveDown: useCallback(() => {
      updateQuestion(question.id, { order: (question.order || 0) + 1 });
    }, [question.id, question.order, updateQuestion]),

    duplicateQuestion: useCallback(() => {
      const duplicatedQuestion = {
        ...question,
        id: crypto.randomUUID()
      };
      updateQuestion(duplicatedQuestion.id, duplicatedQuestion);
    }, [question, updateQuestion]),

    updateOption: useCallback((optionId, updates) => {
      updateQuestion(question.id, {
        options: question.options.map(option =>
          option.id === optionId ? { ...option, ...updates } : option
        )
      });
    }, [question.id, question.options, updateQuestion])
  };
};