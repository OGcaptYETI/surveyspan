import type { Question, QuestionType, Option } from "@/components/types/survey";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";

interface QuestionEditorProps {
  question: Question;
  updateQuestion: (updates: Partial<Question>) => void;
  onDelete?: () => void;
  disabled?: boolean;
}

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: "short_text", label: "Short Text" },
  { value: "long_text", label: "Long Text" },
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "checkbox", label: "Checkbox" },
  { value: "dropdown", label: "Dropdown" },
  { value: "date", label: "Date" },
  { value: "number", label: "Number" },
  { value: "file_upload", label: "File Upload" },
  { value: "rating", label: "Rating" },
  { value: "likert_scale", label: "Likert Scale" },
];

export default function QuestionTypeSelector({
  question,
  updateQuestion,
  onDelete,
  disabled = false,
}: QuestionEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localQuestion, setLocalQuestion] = useState(question);

  const handleTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newType = e.target.value as QuestionType;
      setLocalQuestion(prev => ({ ...prev, type: newType }));
    },
    []
  );

  const handleSave = async () => {
    try {
      await updateQuestion(localQuestion);
      setIsEditing(false);
      toast.success("Question updated successfully");
    } catch (error: unknown) {
      console.error('Failed to update question:', error);
      toast.error("Failed to update question");
    }
  };

  const handleAddOption = () => {
    const newOption: Option = {
      id: crypto.randomUUID(),
      text: "",
      value: "",
      order: (localQuestion.options?.length || 0) + 1,
      isValid: true,
      validationType: "none"
    };
    setLocalQuestion(prev => ({
      ...prev,
      options: [...(prev.options || []), newOption]
    }));
  };

  const handleRemoveOption = (optionId: string) => {
    setLocalQuestion(prev => ({
      ...prev,
      options: prev.options?.filter(opt => opt.id !== optionId) || []
    }));
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 space-y-4">
      {/* Question Display/Edit */}
      <div className="space-y-2">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={localQuestion.text}
                onChange={(e) => setLocalQuestion(prev => ({ ...prev, text: e.target.value }))}
                disabled={disabled}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-itg-red focus:border-itg-red disabled:bg-gray-100"
                placeholder="Enter your question"
              />
            ) : (
              <h3 className="text-lg font-medium text-gray-900">{localQuestion.text}</h3>
            )}
            <p className="text-sm text-gray-500 mt-1">Type: {QUESTION_TYPES.find(t => t.value === localQuestion.type)?.label}</p>
          </div>
        </div>

        {/* Question Type Selector - Only show when editing */}
        {isEditing && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Question Type
            </label>
            <select
              value={localQuestion.type}
              onChange={handleTypeChange}
              disabled={disabled}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-itg-red focus:border-itg-red disabled:bg-gray-100"
              aria-label="Question Type"
            >
              {QUESTION_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Options Display/Management */}
        {(localQuestion.type === "multiple_choice" || 
          localQuestion.type === "checkbox" || 
          localQuestion.type === "dropdown") && (
          <div className="space-y-3 mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Options
            </label>
            {isEditing ? (
              // Editing mode
              <>
                {localQuestion.options?.map((option, index) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = [...(localQuestion.options || [])];
                        newOptions[index] = { ...option, text: e.target.value };
                        setLocalQuestion(prev => ({ ...prev, options: newOptions }));
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-itg-red focus:border-itg-red"
                      placeholder={`Option ${index + 1}`}
                    />
                    <button
                      onClick={() => handleRemoveOption(option.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddOption}
                  className="text-sm text-itg-red hover:text-red-700"
                  type="button"
                >
                  + Add Option
                </button>
              </>
            ) : (
              // Display mode
              <div className="space-y-2">
                {localQuestion.options?.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2 text-gray-700">
                    • {option.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Question Settings */}
        <div className="space-y-2 mt-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localQuestion.required}
                onChange={(e) => setLocalQuestion(prev => ({ ...prev, required: e.target.checked }))}
                disabled={disabled || !isEditing}
                className="rounded border-gray-300 text-itg-red focus:ring-itg-red"
              />
              <span className="ml-2 text-sm text-gray-700">Required</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              type="button"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setLocalQuestion(question);
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-itg-red text-white rounded-md hover:bg-red-700"
                type="button"
              >
                Save
              </button>
            </>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              type="button"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
