import { useState } from 'react';
import type { Question } from "@/components/types/survey";

interface QuestionRendererProps {
  question: Question;
  value: string | string[] | undefined;
  onChange: (value: string | string[] | undefined) => void;
  disabled?: boolean;
}

export default function QuestionRenderer({ 
  question, 
  value, 
  onChange, 
  disabled = false 
}: QuestionRendererProps) {
  const [touched, setTouched] = useState(false);

  const handleChange = (newValue: string | string[] | undefined) => {
    setTouched(true);
    onChange(newValue);
  };

  const renderQuestionInput = () => {
    switch (question.type) {
      case 'short_text':
      case 'email':
      case 'url':
        return (
          <input
            type={question.type === 'email' ? 'email' : question.type === 'url' ? 'url' : 'text'}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={question.placeholder}
            disabled={disabled}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-itg-red focus:border-transparent"
            aria-describedby={question.helpText ? `${question.id}-help` : undefined}
          />
        );

      case 'long_text':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={question.placeholder}
            disabled={disabled}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-itg-red focus:border-transparent"
            aria-describedby={question.helpText ? `${question.id}-help` : undefined}
          />
        );

      case 'multiple_choice':
      case 'radio':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option.id} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name={question.id}
                  value={option.text}
                  checked={value === option.text}
                  onChange={(e) => handleChange(e.target.value)}
                  disabled={disabled}
                  className="h-4 w-4 text-itg-red focus:ring-itg-red border-gray-300"
                />
                <span className="text-gray-700">{option.text}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  value={option.text}
                  checked={Array.isArray(value) ? value.includes(option.text) : false}
                  onChange={(e) => {
                    const newValue = Array.isArray(value) ? [...value] : [];
                    if (e.target.checked) {
                      newValue.push(option.text);
                    } else {
                      const index = newValue.indexOf(option.text);
                      if (index > -1) {
                        newValue.splice(index, 1);
                      }
                    }
                    handleChange(newValue);
                  }}
                  disabled={disabled}
                  className="h-4 w-4 text-itg-red focus:ring-itg-red border-gray-300 rounded"
                />
                <span className="text-gray-700">{option.text}</span>
              </label>
            ))}
          </div>
        );

      default:
        return <p className="text-red-500">Unsupported question type: {question.type}</p>;
    }
  };

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="text-gray-700 text-lg font-medium">
          {question.text}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </span>
      </label>
      
      {question.helpText && (
        <p 
          id={`${question.id}-help`} 
          className="text-sm text-gray-500 mt-1"
        >
          {question.helpText}
        </p>
      )}

      {renderQuestionInput()}

      {touched && question.required && !value && (
        <p className="text-red-500 text-sm mt-1">This field is required</p>
      )}

      {touched && question.validation?.message && !question.isValid && (
        <p className="text-red-500 text-sm mt-1">{question.validation.message}</p>
      )}
    </div>
  );
}