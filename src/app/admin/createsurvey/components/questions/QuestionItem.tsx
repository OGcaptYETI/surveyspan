import { Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import type { Question } from "@/components/types/survey";
import type { ValidationType } from "@/components/types/common";
import toast from "react-hot-toast";
import QuestionTypeSelector from './QuestionTypeSelector';

// ✅ Import the question types
import ShortText from "../ShortText";
import LongText from "../LongText";
import MultipleChoice from "../MultipleChoice";
import CheckboxGroup from "../CheckboxGroup";
import Dropdown from "../Dropdown";
import Rating from "../Rating";
import DatePicker from "../DatePicker";
import NumberInput from "../NumberInput";
import FileUpload from "../FileUpload";
import LikertScale from "../LikertScale";


interface QuestionItemProps {
  question: Question;
  index: number;
  isActive: boolean;
  isHovered: boolean;
  isDragging: boolean;
  setHovered: (id: string | null) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
}

export default function QuestionItem({
  question,
  index,
  isActive,
  isHovered,
  isDragging,
  setHovered,
  updateQuestion,
  deleteQuestion,
}: QuestionItemProps) {
  const handleQuestionUpdate = (updates: Partial<Question>) => {
    const updatedQuestion = { ...question, ...updates };
    if (validateQuestion(updatedQuestion)) {
      updateQuestion(question.id, updates);
    } else {
      // Handle invalid input
      toast.error('Invalid question configuration');
    }
  };

  const renderQuestionType = () => {
    const handleUpdate = (updates: Partial<Question>) => handleQuestionUpdate(updates);

    switch (question.type) {
      case "short_text":
        return <ShortText question={question} updateQuestion={handleUpdate} />;
      case "long_text":
        return <LongText question={question} updateQuestion={handleUpdate} />;
      case "multiple_choice":
        return <MultipleChoice question={question} updateQuestion={handleUpdate} />;
        case "checkbox":
          return (
            <CheckboxGroup
              question={question}
              options={question.options || []}
              updateQuestion={handleUpdate}
              deleteQuestion={deleteQuestion}
              deleteOption={(optionId: string) => handleUpdate({ options: question.options?.filter((opt) => opt.id !== optionId) })}
              addOption={() => handleUpdate({ options: [...(question.options || []), { id: crypto.randomUUID(), text: '', value: '', order: (question.options?.length || 0) + 1, isValid: true, validationType: 'none', onChange: () => {}}] })}
              moveUp={() => {}}
              moveDown={() => {}}
              updateOption={(optionId: string, value: string) => {
                const updatedOptions = question.options?.map(opt => opt.id === optionId ? { ...opt, text: value } : opt);
                handleUpdate({ options: updatedOptions });
              }}
              moveOption={(optionId: string, direction: "up" | "down") => {
                const options = [...(question.options || [])];
                const currentIndex = options.findIndex(opt => opt.id === optionId);
                if (currentIndex === -1) return;
                const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
                if (newIndex >= 0 && newIndex < options.length) {
                  const [removed] = options.splice(currentIndex, 1);
                  options.splice(newIndex, 0, removed);
                  handleUpdate({ options });
                }
              }}
            />
          );
      case "dropdown":
        return <Dropdown question={question} updateQuestion={handleUpdate} />;
      case "rating":
        return <Rating question={question} updateQuestion={handleUpdate} />;
      case "date":
        return <DatePicker question={question} updateQuestion={handleUpdate} />;
      case "number":
        return <NumberInput question={question} updateQuestion={handleUpdate} />;
      case "file_upload":
        return <FileUpload question={question} updateQuestion={handleUpdate} />;
      case "likert_scale":
        return <LikertScale question={question} updateQuestion={handleUpdate} />;
      default:
        return null;
    }
  };

  const validateQuestion = (question: Question): boolean => {
    const validationType: ValidationType = question.validation?.type || 'none';
    
    switch (validationType) {
      case 'required':
        return !!question.text;
      case 'pattern':
        return new RegExp(question.validation?.pattern || '').test(question.text);
      default:
        return true;
    }
  };

  
  return (
    <Draggable key={question.id} draggableId={question.id} index={index}>
      {(provided) => (
        <motion.div>
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`p-4 bg-white rounded-lg shadow-sm transition-all duration-200 
              ${isDragging ? "shadow-lg ring-2 ring-itg-red" : ""}
              ${isActive ? "ring-2 ring-blue-500" : ""}
              ${isHovered ? "bg-gray-100" : ""}`}
            onMouseEnter={() => setHovered(question.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Drag Handle */}
            <div className="flex justify-between items-center mb-4">
              <div className="cursor-move p-2 hover:bg-gray-200 rounded-md">
                <Icon icon="mdi:drag" className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex space-x-2">
                {/* Duplicate Button */}
                <button
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  title="Duplicate"
                  onClick={() => updateQuestion(question.id, { ...question, id: crypto.randomUUID() })}
                >
                  <Icon icon="mdi:content-copy" className="w-4 h-4 text-gray-600" />
                </button>

                {/* Delete Button */}
                <button
                  className="p-2 hover:bg-red-100 rounded-full text-red-600 transition-colors"
                  title="Delete"
                  onClick={() => deleteQuestion(question.id)}
                >
                  <Icon icon="mdi:trash" className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            {/* Question Type Selector */}
            <QuestionTypeSelector
              disabled={isDragging}
              updateQuestion={(updates: Partial<Question>) => updateQuestion(question.id, updates)}
              question={question}
            />

            {/* Render Question Type */}
            {renderQuestionType()}
          </div>
        </motion.div>
      )}
    </Draggable>
  );
}




