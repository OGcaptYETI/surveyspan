import { useState, useEffect, useCallback, useMemo } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import type { Question, Section } from "@/components/types/survey";
import type { ValidationRules } from "@/components/types/common";
import SectionQuestions from "./questions/SectionQuestions";
import useQuestionValidation from "@/hooks/useQuestionValidation";
import { DEFAULT_VALIDATION_RULES } from "@/constants/validation";

interface QuestionFormProps {
  questions: Question[];
  sections: Section[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  deleteQuestion: (id: string) => void;
}

export default function QuestionForm({ sections, questions, setQuestions }: QuestionFormProps) {
  // State management with proper typing
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [hoveredQuestion, setHoveredQuestion] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Custom hook for validation
  const { validateQuestion } = useQuestionValidation();

  // Memoized default validation rules
  const defaultValidation = useMemo<ValidationRules>(
    () => DEFAULT_VALIDATION_RULES,
    []
  );

  // Memoized section-question mapping
  const sectionQuestionsMap = useMemo(() => {
    return sections.reduce((acc, section) => {
      acc[section.id] = questions.filter((q) => q.sectionId === section.id)
        .sort((a, b) => a.order - b.order);
      return acc;
    }, {} as Record<string, Question[]>);
  }, [questions, sections]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (activeQuestion && !target.closest(".question-editor")) {
        setActiveQuestion(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeQuestion]);

  // Question position management
  const updateQuestionPositions = useCallback(
    (questions: Question[]) => {
      return sections.reduce((updatedQuestions, section) => {
        const sectionQuestions = updatedQuestions
          .filter((q) => q.sectionId === section.id)
          .sort((a, b) => a.order - b.order);

        return updatedQuestions.map((q) => {
          if (q.sectionId !== section.id) return q;
          const index = sectionQuestions.findIndex((sq) => sq.id === q.id);
          return {
            ...q,
            order: index,
            isFirst: index === 0,
            isLast: index === sectionQuestions.length - 1,
            isValid: validateQuestion(q),
          };
        });
      }, questions);
    },
    [sections, validateQuestion]
  );

  // Question CRUD operations
  const handleDeleteQuestion = useCallback((questionId: string) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.filter((q) => q.id !== questionId);
      return updateQuestionPositions(updatedQuestions);
    });
    toast.success("Question deleted successfully");
  }, [setQuestions, updateQuestionPositions]);

  // Drag and drop handlers
  const handleDragStart = useCallback(() => {
    setActiveQuestion(null);
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      setIsDragging(false);
      if (!result.destination) return;

      try {
        const updatedQuestions = [...questions];
        const [movedQuestion] = updatedQuestions.splice(result.source.index, 1);

        const targetSection = sections.find(
          (s) => s.id === result.destination?.droppableId
        );
        if (!targetSection) throw new Error("Invalid destination section");

        movedQuestion.sectionId = result.destination.droppableId;
        updatedQuestions.splice(result.destination.index, 0, movedQuestion);

        const finalQuestions = updateQuestionPositions(updatedQuestions);
        setQuestions(finalQuestions);
        toast.success("Question reordered successfully");
      } catch (error) {
        console.error("Error reordering question:", error);
        toast.error("Failed to reorder question");
      }
    },
    [questions, sections, setQuestions, updateQuestionPositions]
  );

  // Add question handler
  const addQuestion = useCallback(
    (sectionId: string) => {
      const sectionQuestions = sectionQuestionsMap[sectionId] || [];
      const newQuestion: Question = {
        id: crypto.randomUUID(),
        survey_id: "", // Add this required property
        sectionId,
        type: "short_text",
        text: "",
        required: false,
        helpText: "",
        placeholder: "",
        options: [],
        order: sectionQuestions.length,
        isFirst: sectionQuestions.length === 0,
        isLast: true,
        isValid: true, // Add missing required property
        validation: { ...defaultValidation },
        validationType: "none",
        validationError: "",
        disabled: false,
        // Add optional properties with default values
        minRange: 0,
        maxRange: 100,
        step: 1,
        fileTypesAllowed: [],
        maxFileSize: 10, // 10MB default
        mediaUrl: "",
        signatureRequired: false,
        legalAgreementText: "",
        netPromoterScoreScale: 10,
        form: {
          label: "",
          name: "",
          value: "",
          type: "",
        },
        onChange: () => {}
      };

      setQuestions((prev) => {
        const updatedQuestions = updateQuestionPositions([...prev, newQuestion]);
        return updatedQuestions;
      });
      setActiveQuestion(newQuestion.id);
      toast.success("Question added successfully");
    },
    [defaultValidation, sectionQuestionsMap, setQuestions, updateQuestionPositions]
  );

  // Update question handler
  const handleUpdateQuestion = useCallback(
    (questionId: string, updates: Partial<Question>) => {
      setQuestions((prevQuestions: Question[]) =>
        prevQuestions.map((q) => {
          if (q.id !== questionId) return q;

          const validation: ValidationRules = {
            ...defaultValidation,
            ...(q.validation ?? {}),
            ...(updates.validation ?? {}),
            message:
              updates.validation?.message ||
              q.validation?.message ||
              defaultValidation.message,
            maxLength:
              updates.validation?.maxLength ??
              q.validation?.maxLength ??
              defaultValidation.maxLength,
            minLength:
              updates.validation?.minLength ??
              q.validation?.minLength ??
              defaultValidation.minLength,
            min: updates.validation?.min ?? q.validation?.min ?? defaultValidation.min,
            max: updates.validation?.max ?? q.validation?.max ?? defaultValidation.max,
            pattern:
              updates.validation?.pattern ||
              q.validation?.pattern ||
              defaultValidation.pattern,
            options:
              updates.validation?.options ??
              q.validation?.options ??
              defaultValidation.options,
          };

          const updatedQuestion = {
            ...q,
            ...updates,
            validation,
          } as Question;

          return validateQuestion(updatedQuestion) ? updatedQuestion : q;
        })
      );
    },
    [defaultValidation, validateQuestion, setQuestions]
  );

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-6"
        >
          {sections.map((section) => (
            <SectionQuestions
              key={section.id}
              section={section}
              questions={sectionQuestionsMap[section.id] || []}
              activeQuestion={activeQuestion}
              hoveredQuestion={hoveredQuestion}
              isDragging={isDragging}
              onAddQuestion={addQuestion}
              onUpdateQuestion={handleUpdateQuestion}
              onDeleteQuestion={handleDeleteQuestion}
              setHoveredQuestion={setHoveredQuestion}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </DragDropContext>
  );
}

