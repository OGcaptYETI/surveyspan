'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import type { Survey, Question } from '@/components/types/survey';
import { submitSurveyResponse } from '@/utils/surveyUtils';
import QuestionRenderer from '@/components/QuestionRenderer'; 

interface EmbeddedSurveyProps {
  survey: Survey;
  onComplete?: () => void;
}

export default function EmbeddedSurvey({ survey, onComplete }: EmbeddedSurveyProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[] | undefined>>({});
  const [currentStep, setCurrentStep] = useState(0);

  const handleAnswerChange = (questionId: string, value: string | string[] | undefined) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validAnswers = Object.fromEntries(
        Object.entries(answers).filter(([,value]) => value !== undefined)
      ) as Record<string, string | number | boolean | string[]>;
      await submitSurveyResponse(survey.id, validAnswers);
      toast.success('Thank you for your response!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to submit survey');
      console.error(error);
    }
  };

  const currentSection = survey.sections[currentStep];

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">{survey.title}</h2>
      {survey.description && (
        <p className="text-gray-600 mb-6">{survey.description}</p>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {currentSection?.questions?.map((question: Question) => (
            <QuestionRenderer
              key={question.id}
              question={question}
              value={answers[question.id]}
              onChange={(value) => handleAnswerChange(question.id, value)}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-between space-x-4">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Previous
            </button>
          )}
          
          {currentStep < survey.sections.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="px-4 py-2 bg-itg-red text-white rounded hover:bg-red-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-itg-red text-white rounded hover:bg-red-700"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}