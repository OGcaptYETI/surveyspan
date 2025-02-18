import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import QuestionList from "./QuestionList";
import type { Section, Question } from "@/components/types/survey";

interface SectionQuestionsProps {
  section: Section;
  questions: Question[];
  activeQuestion: string | null;
  hoveredQuestion: string | null;
  isDragging: boolean;
  onAddQuestion: (sectionId: string) => void;
  onUpdateQuestion: (questionId: string, updates: Partial<Question>) => void;
  onDeleteQuestion: (id: string) => void; 
  setHoveredQuestion: (id: string | null) => void;
}

export default function SectionQuestions({
  section,
  questions,
  activeQuestion,
  hoveredQuestion,
  isDragging,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion, 
  setHoveredQuestion,
}: SectionQuestionsProps) {
  return (
    <motion.div layout className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{section.title || "Untitled Section"}</h2>
        <button
          onClick={() => onAddQuestion(section.id)}
          className="inline-flex items-center px-4 py-2 bg-itg-red text-white rounded-md hover:bg-red-700 transition-colors duration-200 shadow-sm"
        >
          <Icon icon="mdi:plus" className="mr-2" />
          Add Question
        </button>
      </div>

      <QuestionList
        section={section}
        questions={questions}
        activeQuestion={activeQuestion}
        hoveredQuestion={hoveredQuestion}
        isDragging={isDragging}
        onUpdateQuestion={onUpdateQuestion}
        onDeleteQuestion={onDeleteQuestion} 
        setHoveredQuestion={setHoveredQuestion}
      />
    </motion.div>
  );
}
