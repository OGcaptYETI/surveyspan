import { Droppable } from "@hello-pangea/dnd";
import { AnimatePresence } from "framer-motion";
import QuestionItem from "./QuestionItem";
import type { Question, Section } from "@/components/types/survey";

interface QuestionListProps {
  section: Section;
  questions: Question[];
  activeQuestion: string | null;
  hoveredQuestion: string | null;
  isDragging: boolean;
  onUpdateQuestion: (questionId: string, updates: Partial<Question>) => void;
  setHoveredQuestion: (id: string | null) => void;
  onDeleteQuestion: (id: string) => void;
}

export default function QuestionList({ 
  section, 
  questions, 
  activeQuestion, 
  hoveredQuestion, 
  isDragging, 
  onUpdateQuestion, 
  setHoveredQuestion, 
  onDeleteQuestion 
}: QuestionListProps) { 

  return (
    <Droppable droppableId={section.id} type="QUESTION">
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps} className={`space-y-4 ${isDragging ? 'bg-gray-50' : ''}`}>
          <AnimatePresence mode="popLayout">
            {questions.map((question, index) => (
              <QuestionItem 
                key={question.id}
                question={question}
                index={index}
                isActive={activeQuestion === question.id}
                isHovered={hoveredQuestion === question.id}
                isDragging={isDragging}
                setHovered={setHoveredQuestion}
                updateQuestion={onUpdateQuestion}
                deleteQuestion={onDeleteQuestion}
              />
            ))}
          </AnimatePresence>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
