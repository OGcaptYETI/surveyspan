import { Dialog } from '@headlessui/react';
import type { Question, Section } from '@/components/types/survey';
import { useState } from 'react';

export interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  sections: Section[];
  questions: Question[];
}

export default function PreviewModal({
  isOpen,
  onClose,
  title = '',
  description = '',
  sections = [],
  questions = []
}: PreviewModalProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});

  // Guard clause for empty sections
  if (!sections || sections.length === 0) {
    return (
      <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded-lg max-w-3xl w-full mx-4 p-6 shadow-xl">
            <div className="text-center">
              <p>No sections available</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-itg-red text-white rounded-md hover:bg-red-700"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'short_text':
        return (
          <input
            type="text"
            value={answers[question.id] || ''}
            onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
            placeholder={question.placeholder || 'Enter your answer'}
            className="w-full p-2 border rounded-md"
          />
        );
      case 'long_text':
        return (
          <textarea
            value={answers[question.id] || ''}
            onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
            placeholder={question.placeholder || 'Enter your answer'}
            rows={4}
            className="w-full p-2 border rounded-md"
          />
        );
      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {question.options.map((option) => (
              <label key={option.id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={answers[question.id] === option.value}
                  onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                />
                <span>{option.text}</span>
              </label>
            ))}
          </div>
        );
      // Add more question types as needed
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg max-w-3xl w-full mx-4 p-6 shadow-xl">
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="text-gray-600 mt-2">{description}</p>
            </div>

            {/* Section Progress */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Section {currentSection + 1} of {sections.length}
              </span>
              <div className="h-2 w-64 bg-gray-200 rounded-full">
                <div 
                  className={`h-2 bg-itg-red rounded-full transition-all w-[${((currentSection + 1) / sections.length) * 100}%]`}
                />
              </div>
            </div>

            {/* Current Section */}
            {sections[currentSection] && (
              <div className="py-4">
                <h3 className="text-xl font-semibold mb-2">
                  {sections[currentSection].title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {sections[currentSection].description}
                </p>

                {/* Section Questions */}
                <div className="space-y-6">
                  {questions
                    .filter(q => q.sectionId === sections[currentSection].id)
                    .map(question => (
                      <div key={question.id} className="space-y-2">
                        <label className="block font-medium">
                          {question.text}
                          {question.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {question.helpText && (
                          <p className="text-sm text-gray-500">{question.helpText}</p>
                        )}
                        {renderQuestion(question)}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4 border-t">
              <button
                onClick={handlePrevious}
                disabled={currentSection === 0}
                className="px-4 py-2 text-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={currentSection === sections.length - 1 ? onClose : handleNext}
                className="px-4 py-2 bg-itg-red text-white rounded-md hover:bg-red-700"
              >
                {currentSection === sections.length - 1 ? 'Close Preview' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}