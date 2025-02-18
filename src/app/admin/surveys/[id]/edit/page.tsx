"use client";

import { useEffect, useState } from "react";
import type { SetStateAction } from "react";
import { useParams } from "next/navigation";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import supabase from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import type { Section as SectionType, Question, Survey } from "@/components/types/survey";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import Section from "@/components/Section";

export default function EditSurveyPage() {
  const params = useParams();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [sections, setSections] = useState<SectionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSurvey() {
      try {
        if (!params.id) throw new Error("Survey ID is required");

        const { data, error } = await supabase
          .from("surveys")
          .select(`
            *,
            sections (
              *,
              questions (*)
            )
          `)
          .eq("id", params.id)
          .single();

        if (error) throw new Error(`Failed to fetch survey: ${error.message}`);
        setSurvey(data);
        setSections(data.sections || []);
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

  /** ✅ Handle Section Update */
  const handleUpdateSection = async (sectionId: string, updates: Partial<SectionType>) => {
    try {
      const { error } = await supabase
        .from("sections")
        .update(updates)
        .eq("id", sectionId);

      if (error) throw error;

      setSections(prev => prev.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      ));

      toast.success("Section updated successfully");
    } catch (error) {
      console.error("Error updating section:", error);
      toast.error("Failed to update section");
    }
  };

  /** ✅ Handle Section Drag and Drop */
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reorderedSections = Array.from(sections);
    const [movedSection] = reorderedSections.splice(result.source.index, 1);
    reorderedSections.splice(result.destination.index, 0, movedSection);

    setSections(reorderedSections);
  };

  const handleAddSection = async () => {
    try {
      const newSection: Partial<SectionType> = {
        title: "New Section",
        description: "",
        order: sections.length,
        survey_id: survey?.id
      };

      const { data, error } = await supabase
        .from("sections")
        .insert(newSection)
        .select()
        .single();

      if (error) throw error;

      setSections([...sections, { ...data, questions: [] }]);
      toast.success("Section added successfully");
    } catch (error) {
      console.error("Error adding section:", error);
      toast.error("Failed to add section");
    }
  };

  const handleAddQuestion = async (sectionId: string) => {
    try {
      const section = sections.find(s => s.id === sectionId);
      if (!section) throw new Error("Section not found");

      const newQuestion = {
        text: "New Question",
        type: "text",
        order: section.questions?.length || 0,
        section_id: sectionId
      };

      const { data, error } = await supabase
        .from("questions")
        .insert(newQuestion)
        .select()
        .single();

      if (error) throw error;

      setSections(prev => prev.map(section => 
        section.id === sectionId 
          ? { ...section, questions: [...(section.questions || []), data] }
          : section
      ));

      toast.success("Question added successfully");
    } catch (error) {
      console.error("Error adding question:", error);
      toast.error("Failed to add question");
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!survey) return <div>Survey not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Edit Survey</h1>
          <button
            onClick={handleAddSection}
            className="px-4 py-2 bg-itg-red text-white rounded-md hover:bg-red-700"
          >
            Add Section
          </button>
        </div>

        {/* Survey Title */}
        <input
          type="text"
          value={survey.title}
          onChange={(e) => setSurvey(prev => ({ ...prev!, title: e.target.value }))}
          className="mt-4 w-full px-4 py-2 text-xl font-bold border border-gray-300 rounded-md focus:ring-itg-red focus:border-itg-red"
          placeholder="Survey Title"
        />

        {/* Survey Description */}
        <textarea
          value={survey.description || ""}
          onChange={(e) => setSurvey(prev => ({ ...prev!, description: e.target.value }))}
          className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-itg-red focus:border-itg-red"
          placeholder="Survey Description"
          rows={3}
        />
      </div>

      {/* 🔹 Drag and Drop Sections */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="survey-sections">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  className="mb-6 p-4 border border-gray-300 rounded-md bg-gray-50 shadow-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  <Section
                    section={section}
                    index={index}
                    sections={sections}
                    questions={section.questions || []}
                    setQuestions={(value: SetStateAction<Question[]>) => {
                      setSections((prevSections) =>
                        prevSections.map((sec) =>
                          sec.id === section.id ? { ...sec, questions: typeof value === 'function' ? value(sec.questions || []) : value } : sec
                        )
                      );
                    }}
                    updateSection={(updates) => handleUpdateSection(section.id, updates)}
                    deleteSection={() => {
                      setSections(prevSections => prevSections.filter(sec => sec.id !== section.id));
                    }}
                    addQuestion={() => handleAddQuestion(section.id)} 
                  />
                </motion.div>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Save Button */}
      <button
        onClick={() => toast.success("Changes saved successfully!")}
        className="w-full py-3 mt-6 text-white font-semibold rounded-md bg-itg-red hover:bg-red-700"
      >
        Save Changes
      </button>
    </div>
  );
}



