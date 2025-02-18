import { useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import * as Accordion from "@radix-ui/react-accordion";
import toast from "react-hot-toast";
import type { Question } from "@/components/types/survey";
import type { Section } from "@/components/types/survey";
import QuestionForm from "@/app/admin/createsurvey/components/QuestionForm";

interface SectionProps {
  section: Section;
  sections: Section[];
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  addQuestion: (question: Question) => void;
  updateSection: (updates: Partial<Section>) => void;
  deleteSection: () => void;
  index?: number;
}

export default function Section({
  section,
  sections,
  questions,
  setQuestions,
  addQuestion,
  updateSection,
  deleteSection,
}: SectionProps) {
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  /** ✅ Ensuring Unique IDs */
  const titleId = `section-title-${section.id}`;
  const descriptionId = `section-desc-${section.id}`;
  const inputUniqueId = `input-${section.id}-${crypto.randomUUID()}`;

  /** ✅ Handle Adding a Question */
  const handleAddQuestion = useCallback(async () => {
    setIsAddingQuestion(true);
    try {
      const newQuestion: Question = {
        id: crypto.randomUUID(),
        sectionId: section.id,
        survey_id: section.survey_id,
        type: "short_text",
        text: "New Question",
        required: false,
        options: [],
        order: questions.length,
        isFirst: questions.length === 0,
        isLast: true,
        helpText: "",
        placeholder: "",
        validation: { message: "", type: "none" },
        validationType: "none",
        isValid: true,
        onChange: () => {},
      };

      addQuestion(newQuestion);
      toast.success("Question added successfully");
    } catch (error) {
      console.error("Failed to add question:", error);
      toast.error("Failed to add question");
    } finally {
      setIsAddingQuestion(false);
    }
  }, [addQuestion, questions.length, section.id, section.survey_id]);

  /** ✅ Handle Deleting a Question */
  const deleteQuestion = useCallback(
    (id: string) => {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      toast.success("Question deleted");
    },
    [setQuestions]
  );

  return (
    <div className="border border-gray-300 rounded-md bg-gray-50 shadow-sm">
      <Accordion.Root type="single" collapsible>
        <Accordion.Item value={section.id} className="border-none">
          <div className="flex justify-between items-center px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-t-md">
            <Accordion.Trigger className="flex-1 text-left hover:opacity-80">
              <div className="flex items-center">
                {isEditing ? (
                  <input
                    id={inputUniqueId} // ✅ Unique input ID
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSection({ title: e.target.value })}
                    onBlur={() => setIsEditing(false)}
                    autoFocus
                    placeholder="Enter section title"
                    aria-label={`Edit title for section: ${section.title || "Untitled Section"}`}
                    className="text-lg font-bold text-itg-black bg-white px-2 py-1 rounded-md focus:ring-2 focus:ring-itg-red focus:border-transparent w-full"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <h3
                    id={titleId}
                    className="text-lg font-bold text-itg-black cursor-pointer hover:text-itg-red"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Edit section title: ${section.title || "Untitled Section"}`}
                  >
                    {section.title || "Untitled Section"}
                  </h3>
                )}
              </div>
            </Accordion.Trigger>

            {/* ✅ Section Controls */}
            <div className="flex items-center space-x-2">
              {/* Add Question */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddQuestion();
                }}
                disabled={isAddingQuestion}
                className="p-2 hover:bg-green-100 rounded-full text-green-600 disabled:opacity-50"
                aria-label="Add question"
              >
                <Icon icon={isAddingQuestion ? "mdi:loading" : "mdi:plus"} className={isAddingQuestion ? "animate-spin" : ""} />
              </button>

              {/* Delete Section */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteSection();
                }}
                className="p-2 hover:bg-red-100 rounded-full text-red-600"
                aria-label="Delete section"
              >
                <Icon icon="mdi:trash" />
              </button>
            </div>
          </div>

          <Accordion.Content className="p-4">
            {/* ✅ Section Description */}
            <div className="space-y-4">
              <textarea
                id={descriptionId}
                value={section.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateSection({ description: e.target.value })}
                placeholder="Enter section description"
                rows={3}
                aria-label={`Description for section: ${section.title || "Untitled Section"}`}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-itg-red focus:border-itg-red"
              />
            </div>

            {/* ✅ Questions in the Section */}
            <div className="mt-6">
              <QuestionForm
                key={section.id}
                questions={questions}
                sections={sections}
                setQuestions={setQuestions}
                deleteQuestion={deleteQuestion}
              />
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}



