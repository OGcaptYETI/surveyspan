import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/src/components/Button';
import Input from '@/src/components/Input';
import { Question, QuestionType, Survey } from '../types/survey';

interface SurveyCreatorProps {
  onSave: (survey: Omit<Survey, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
}

interface SurveyForm {
  title: string;
  description: string;
}

const SurveyCreator: React.FC<SurveyCreatorProps> = ({ onSave }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<SurveyForm>();
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      type,
      text: '',
      required: false,
      options: type === 'multiple_choice' ? [
        { 
          id: `opt-${Date.now()}-1`, 
          text: '', 
          value: '',
          order: 0,
          isValid: true,
          validationType: 'none',
          onChange: () => {}
        }
      ] : [],
      placeholder: '',
      helpText: '',
      sectionId: '',
      isValid: true,
      order: questions.length,
      isFirst: questions.length === 0,
      isLast: true,
      validationType: 'none',
      onChange: () => {}
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ));
  };

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q => {
          if (q.id !== questionId || !q.options) return q;
          return {
            ...q,
            options: [
              ...q.options,
              { 
                id: `opt-${Date.now()}`, 
                text: '', 
                value: '',
                order: q.options.length,
                isValid: true,
                validationType: 'none',
                onChange: () => {}
              }
            ]
          };
        }));
  };

  const onSubmit = handleSubmit(async (data) => {
    const survey = {
      ...data,
      sections: [{
        id: `section-${Date.now()}`,
        title: 'Default Section',
        description: '', // Add this line
        order: 0,
        questions: questions
      }],
      isPublished: false
    };
    await onSave(survey);
  });

  return (
    <form onSubmit={onSubmit} className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <Input
          {...register("title", { 
            required: "Title is required",
            minLength: { value: 3, message: "Title must be at least 3 characters" }
          })}
          label="Survey Title"
          error={errors.title?.message}
        />
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register("description")}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
            rows={3}
          />
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        <Button 
          text="Add Text Question"
          onClick={() => addQuestion('text')}
        />
        <Button 
          text="Add Multiple Choice"
          onClick={() => addQuestion('multiple_choice')}
        />
        <Button 
          text="Add Checkbox"
          onClick={() => addQuestion('checkbox')}
        />
        <Button 
          text="Add Dropdown"
          onClick={() => addQuestion('dropdown')}
        />
      </div>

      <div className="space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="bg-white p-6 rounded-lg shadow">
            <Input
              label="Question Text"
              value={question.text}
              onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
            />

            {(question.type === 'multiple_choice' || question.type === 'checkbox' || question.type === 'dropdown') && 
              question.options && (
                <div className="mt-4 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Options</label>
                  {question.options.map((option) => (
                    <Input
                      key={option.id}
                      label=""
                      value={option.text}
                      onChange={(e) => {
                        const updatedOptions = question.options?.map(opt =>
                          opt.id === option.id 
                            ? { ...opt, text: e.target.value, value: e.target.value.toLowerCase() }
                            : opt
                        );
                        updateQuestion(question.id, { options: updatedOptions });
                      }}
                    />
                  ))}
                  <Button
                    text="Add Option"
                    onClick={() => addOption(question.id)}
                  />
                </div>
            )}

            <div className="mt-4">
              <Input
                label="Help Text (Optional)"
                value={question.helpText || ''}
                onChange={(e) => updateQuestion(question.id, { helpText: e.target.value })}
              />
            </div>

            <div className="mt-4 flex items-center">
              <input
                type="checkbox"
                aria-label="Required question"
                checked={question.required}
                onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Required</label>
            </div>
          </div>
        ))}
      </div>

      {questions.length > 0 && (
        <div className="mt-8">
          <Button 
            text="Save Survey"
            type="submit"
          />
        </div>
      )}
    </form>
  );
};

export default SurveyCreator;