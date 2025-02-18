import { Question, QuestionType } from '@/src/components/types/survey';
import { useCallback, useMemo } from 'react';
import { Icon } from '@iconify/react';

export interface QuestionTypeSelectorProps {
  disabled: boolean;
  updateQuestion: (updates: Partial<Question>) => void;
  question: Question;
}

export interface QuestionTypeSelector {
  value: QuestionType;
  label: string;
  hasOptions: boolean;
}

type QuestionTypeOption = {
  value: QuestionType;
  label: string;
  hasOptions: boolean;
};

const QUESTION_TYPES: QuestionTypeOption[] = [
  { value: 'short_text', label: 'Short Text', hasOptions: false },
  { value: 'long_text', label: 'Long Text', hasOptions: false },
  { value: 'multiple_choice', label: 'Multiple Choice', hasOptions: true },
  { value: 'checkbox', label: 'Checkboxes', hasOptions: true },
  { value: 'dropdown', label: 'Dropdown', hasOptions: true },
  { value: 'date', label: 'Date Picker', hasOptions: false },
  { value: 'number', label: 'Number', hasOptions: false },
  { value: 'file_upload', label: 'File Upload', hasOptions: false },
  { value: 'rating', label: 'Rating', hasOptions: false },
  { value: 'likert_scale', label: 'Likert Scale', hasOptions: true },
] as const;

export default function QuestionTypeSelector({
  disabled,
  updateQuestion,
  question
}: QuestionTypeSelectorProps) {
  const createDefaultOption = useCallback(() => ({
    id: crypto.randomUUID(),
    text: '',
    value: '',
    order: 0,
    isValid: true,
    validationType: 'none' as const,
    onChange: () => {}
  }), []);

  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as QuestionType;
    const typeConfig = QUESTION_TYPES.find(type => type.value === newType);

    if (!typeConfig) {
      console.error(`Invalid question type: ${newType}`);
      return;
    }

    try {
      updateQuestion({
        type: newType,
        options: typeConfig.hasOptions ? [createDefaultOption()] : []
      });
    } catch (error) {
      console.error('Error updating question type:', error);
    }
  }, [updateQuestion, createDefaultOption]);

  const selectId = useMemo(() => `question-type-${question.id}`, [question.id]);

  // ✅ Ensure question.type is never undefined (fix for uncontrolled component issue)
  const currentType = question.type ?? 'short_text';

  return (
    <div className="form-group space-y-2">
      <label
        htmlFor={selectId}
        className="block text-base font-semibold text-gray-900"
      >
        Question Type
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={currentType}
          onChange={handleTypeChange}
          className="appearance-none block w-full px-4 py-3 text-base rounded-lg border border-gray-300 
            bg-white shadow-sm focus:border-itg-red focus:ring-2 focus:ring-itg-red focus:ring-opacity-50
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            font-medium text-gray-900"
          disabled={disabled}
        >
          {QUESTION_TYPES.map(({ value, label }) => (
            <option
              key={value}
              value={value}
              className="py-2 text-base"
            >
              {label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-600">
          <Icon
            icon="heroicons:chevron-down-20-solid"
            className={`h-5 w-5 transition-transform duration-200 ${disabled ? 'text-gray-400' : ''}`}
          />
        </div>
      </div>
      {disabled && (
        <p className="text-sm text-gray-500 mt-1">
          Question type cannot be changed while editing
        </p>
      )}
    </div>
  );
}




