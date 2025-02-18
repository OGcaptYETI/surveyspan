"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";
import { toast } from "react-hot-toast";
import type { Section as SectionType } from "@/components/types/survey";
import type { Question } from "@/components/types/survey";
import { createSection, fetchSections } from "@/app/api/sections";
import PreviewModal from '../admin/createsurvey/components/PreviewModal';
import Section from './createsurvey/components/Sections';

export default function CreateSurvey() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sections, setSections] = useState<SectionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    // Fetch sections dynamically if a survey exists
    if (title) {
      const loadSections = async () => {
        const sectionsData = await fetchSections(title);
        setSections(sectionsData);
      };
      loadSections();
    }
  }, [title]);

  const addSection = async () => {
    try {
      const newSection = await createSection(title, "New Section", "");
      setSections([...sections, { ...newSection, questions: [] }]);
    } catch (error) {
      console.error("Error creating section:", error);
      toast.error("Failed to create section.");
    }
  };

  const createSurvey = async () => {
    if (!title.trim()) {
      toast.error("Survey title is required.");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Create survey first
      const { data: survey, error: surveyError } = await supabase
        .from("surveys")
        .insert([{ title, description, user_id: user.id, is_published: false }])
        .select()
        .single();

      if (surveyError) throw surveyError;

      // Create sections in batch
      const { error: sectionsError } = await supabase
        .from("sections")
        .insert(sections.map((s) => ({ ...s, survey_id: survey.id })));

      if (sectionsError) throw sectionsError;

      // Insert questions with their associated sections
      if (questions.length > 0) {
        const { error: questionsError } = await supabase
          .from("questions")
          .insert(questions.map((q, index) => ({
            survey_id: survey.id,
            section_id: q.sectionId, // New association
            text: q.text,
            type: q.type,
            required: q.required,
            help_text: q.helpText,
            options: q.options,
            order: index
          })));

        if (questionsError) throw questionsError;
      }

      toast.success("Survey created successfully!");
      router.push("/admin/surveys");
    } catch (error) {
      console.error("Error creating survey:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create survey.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Survey Title & Description */}
      <div className="mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700">Survey Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-itg-red focus:border-itg-red"
            placeholder="Enter survey title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-itg-red focus:border-itg-red"
            placeholder="Enter survey description"
          />
        </div>
      </div>

      {/* Survey Sections */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <Section
            key={section.id}
            section={section}
            sections={sections}
            questions={questions.filter(q => q.sectionId === section.id)}
            setQuestions={setQuestions}
            addQuestion={(question) => {
              setQuestions([...questions, question]);
            }}
            updateSection={async (updates) => {
              setSections(sections.map(s => 
                s.id === section.id ? { ...s, ...updates } : s
              ));
            }}
            deleteSection={() => {
              setSections(sections.filter(s => s.id !== section.id));
              setQuestions(questions.filter(q => q.sectionId !== section.id));
            }}
            order={index}
            index={index}
            survey_id={section.survey_id || ''}
          />
        ))}

        <button
          onClick={addSection}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg 
                   text-gray-500 hover:border-gray-400 hover:text-gray-600"
        >
          + Add Section
        </button>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          onClick={() => setIsPreviewOpen(true)}
          disabled={sections.length === 0}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Preview Survey
        </button>
        <button
          onClick={createSurvey}
          disabled={loading}
          className="px-6 py-2 bg-itg-red text-white rounded-md hover:bg-red-700 
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Survey'}
        </button>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={title}
        description={description}
        sections={sections}
        questions={questions}
      />

    </div>
  );
}