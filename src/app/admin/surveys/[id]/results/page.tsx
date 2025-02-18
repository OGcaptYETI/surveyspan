"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import supabase from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import type { Question } from "@/components/types/survey";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import QuestionTypeSelector from "@/app/admin/surveys/[id]/results/components/QuestionTypeSelector";

interface Survey {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  created_at: string;
}

export default function EditSurveyPage() {
  const params = useParams();
  const router = useRouter();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSurvey() {
      try {
        if (!params.id) throw new Error("Survey ID is required");

        const { data, error } = await supabase
          .from("surveys")
          .select("*, questions(*)")
          .eq("id", params.id)
          .single();

        if (error) throw new Error(`Failed to fetch survey: ${error.message}`);
        setSurvey(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error occurred";
        console.error("Error fetching survey:", message);
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    fetchSurvey();
  }, [params.id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSurvey((prev) => prev ? { ...prev, title: e.target.value } : prev);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSurvey((prev) => prev ? { ...prev, description: e.target.value } : prev);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reorderedQuestions = Array.from(survey?.questions || []);
    const [movedQuestion] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, movedQuestion);
    setSurvey((prev) => prev ? { ...prev, questions: reorderedQuestions } : prev);
  };

  const handleUpdateQuestion = (questionId: string, updates: Partial<Question>) => {
    setSurvey((prev) =>
      prev
        ? {
            ...prev,
            questions: prev.questions.map((q) =>
              q.id === questionId ? { ...q, ...updates } : q
            ),
          }
        : prev
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!survey) throw new Error("No survey data available");

      // Update survey details
      const { error: surveyError } = await supabase
        .from("surveys")
        .update({
          title: survey.title,
          description: survey.description,
        })
        .eq("id", survey.id);

      if (surveyError) throw new Error(`Failed to update survey: ${surveyError.message}`);

      // Update questions
      for (const question of survey.questions) {
        await supabase
          .from("questions")
          .update({
            text: question.text,
            type: question.type,
            options: question.options,
          })
          .eq("id", question.id);
      }

      toast.success("Survey updated successfully!");
      router.push(`/admin/surveys/${survey.id}/results`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error saving survey:", message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Edit Survey</h2>

        {/* Survey Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Survey Title</label>
          <input
            type="text"
            value={survey?.title || ""}
            onChange={handleTitleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-itg-red focus:border-itg-red"
            title="Survey Title"
            placeholder="Enter survey title"
            aria-label="Survey Title"
          />
        </div>

        {/* Survey Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={survey?.description || ""}
            onChange={handleDescriptionChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-itg-red focus:border-itg-red"
            rows={3}
            title="Survey Description"
            placeholder="Enter survey description"
            aria-label="Survey Description"
          />
        </div>

        {/* Question List with Drag and Drop */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="survey-questions">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                {survey?.questions.map((question, index) => (
                  <Draggable key={question.id} draggableId={question.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <motion.div
                          className={`p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm cursor-pointer ${
                            activeQuestion === question.id ? "ring-2 ring-itg-red" : ""
                          }`}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setActiveQuestion(question.id)}
                        >
                          {/* Question Text Input */}
                          <input
                            type="text"
                            value={question.text}
                            onChange={(e) => handleUpdateQuestion(question.id, { text: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-itg-red focus:border-itg-red"
                            title="Question Text"
                            placeholder="Enter your question"
                            aria-label="Question Text"
                          />

                          {/* Question Type Selector */}
                          <QuestionTypeSelector
                            question={question}
                            updateQuestion={(updates) => handleUpdateQuestion(question.id, updates)}
                          />
                        </motion.div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className={`w-full py-3 text-white font-semibold rounded-md transition-colors ${saving ? "bg-gray-400" : "bg-itg-red hover:bg-red-700"}`}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
