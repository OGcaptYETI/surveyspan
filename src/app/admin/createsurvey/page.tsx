"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";
import { toast } from "react-hot-toast";
import Section from "./components/Sections";
import type { Question } from "@/components/types/survey";
import * as Accordion from "@radix-ui/react-accordion";
import PreviewModal from "./components/PreviewModal";


interface Section {
  id: string;
  title: string;
  description: string;
  order: number;
  questions?: Question[];
  survey_id: string;
}


export default function CreateSurvey() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sections, setSections] = useState<Section[]>([
    { 
      id: crypto.randomUUID(), 
      title: 'Section 1', 
      description: '',
      order: 0,
      survey_id: ''
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [survey, setSurvey] = useState<{ id: string } | null>(null);

  const addSection = () => {
    const newSection = {
      id: crypto.randomUUID(),
      title: 'New Section',
      description: '',
      order: sections.length,
      survey_id: ''
    };
    setSections([...sections, newSection]);
  };

  const handleAddQuestion = async (sectionId: string) => {
    try {
      const newQuestion = {
        section_id: sectionId,
        survey_id: survey?.id,
        type: 'short_text',
        text: 'New Question',
        required: false,
        order: sections.find(s => s.id === sectionId)?.questions?.length || 0
      };
  
      const { data: questionData, error } = await supabase
        .from('questions')
        .insert(newQuestion)
        .select()
        .single();
  
      if (error) throw error;
  
      setSections(prevSections => 
        prevSections.map(section => {
          if (section.id === sectionId) {
            return {
              ...section,
              questions: [...(section.questions || []), questionData]
            };
          }
          return section;
        })
      );
  
      toast.success('Question added successfully');
    } catch (error) {
      console.error('Error adding question:', error);
      toast.error('Failed to add question');
    }
  };

  const createSurvey = async () => {
    if (!title.trim()) {
      toast.error("Survey title is required.");
      return;
    }

    setLoading(true);
    try {
      // Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw new Error(`Authentication error: ${authError.message}`);
      if (!user) throw new Error("User not authenticated");

      // Create survey
      const { data: survey, error: surveyError } = await supabase
        .from("surveys")
        .insert([{ 
          title, 
          description, 
          user_id: user.id, 
          is_published: false,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (surveyError) {
        throw new Error(`Failed to create survey: ${surveyError.message}`);
      }
      
      if (!survey) {
        throw new Error("Survey was not created properly");
      }

      setSurvey(survey);

      // Add questions if any exist
      if (questions.length > 0) {
        const { error: questionsError } = await supabase
          .from("questions")
          .insert(
            questions.map((q, index) => ({
              survey_id: survey.id,
              text: q.text,
              type: q.type,
              required: q.required,
              help_text: q.helpText,
              options: q.options,
              order: index,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }))
          );

        if (questionsError) {
          // If questions fail to insert, delete the survey to maintain consistency
          await supabase.from("surveys").delete().eq("id", survey.id);
          throw new Error(`Failed to create questions: ${questionsError.message}`);
        }
      }

      // Add sections if any exist
      if (sections.length > 0) {
        const { error: sectionsError } = await supabase
          .from("sections")
          .insert(
            sections.map((section, index) => ({
              survey_id: survey.id,
              title: section.title,
              description: section.description,
              order: index,
              created_at: new Date().toISOString()
            }))
          );

        if (sectionsError) {
          // Cleanup if section creation fails
          await supabase.from("surveys").delete().eq("id", survey.id);
          throw new Error(`Failed to create sections: ${sectionsError.message}`);
        }
      }

      toast.success("Survey created successfully!");
      router.push("/admin/surveys");
    } catch (error) {
      console.error("Error creating survey:", error);
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred while creating the survey");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSurvey = async () => {
    if (questions.some(q => !q.text.trim())) {
      toast.error("All questions must have a question text.");
      return;
    }
  
    try {
      await createSurvey();
      toast.success("Survey created successfully");
    } catch (error) {
      console.error("Failed to create survey:", error);
      toast.error("Survey creation failed.");
    }
  };
  
  
  return (
    <><div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Navigation */}
      <div className="flex items-center space-x-2 text-gray-600">
        <button onClick={() => router.push("/admin")} className="hover:underline">Dashboard</button>
        <span>/</span>
        <span className="text-itg-black font-bold">Create Survey</span>
      </div>

      {/* Survey Creation Panel */}
      <div className="bg-white rounded-lg shadow-md mt-6">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Create a New Survey</h1>
          <p className="text-gray-600">Fill in the details below to create a new survey.</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Survey Title & Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Survey Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-itg-red focus:border-itg-red"
              placeholder="Enter survey title" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-itg-red focus:border-itg-red"
              placeholder="Enter survey description" />
          </div>

          {/* Survey Sections */}
          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-xl font-bold text-gray-900">Survey Sections</h2>
            <button
  onClick={addSection}
  className="mt-2 bg-itg-red text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
>
  Add Section
</button>

            <Accordion.Root type="single" collapsible className="mt-4 space-y-4">
            {sections.map((section, index) => (
  <Accordion.Item key={section.id} value={section.id} className="border rounded-md p-4">
    <Section
      section={{
        ...section,
        questions: questions.filter(q => q.sectionId === section.id)
      }}
      order={index}
      index={index}
      survey_id={survey?.id || ''}
      sections={sections.map(s => ({
        ...s,
        questions: questions.filter(q => q.sectionId === s.id)
      }))}
      questions={questions.filter(q => q.sectionId === section.id)}
      setQuestions={setQuestions}
      addQuestion={() => handleAddQuestion(section.id)}
      updateSection={async (updates) => {
        const updatedSections = sections.map((s, i) => 
          i === index 
            ? { ...s, ...updates, questions: questions.filter(q => q.sectionId === s.id) }
            : s
        );
        setSections(updatedSections);
      }}
      deleteSection={() => {
        setQuestions(prev => prev.filter(q => q.sectionId !== section.id));
        setSections(sections.filter((_, i) => i !== index));
      }}
    />
  </Accordion.Item>
))}
            </Accordion.Root>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          {/* Preview Button */}
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-6 py-2 border border-itg-red text-itg-red font-medium rounded-md hover:bg-red-100"
          >
            Preview Survey
          </button>
          
          {/* Create Button */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={handleCreateSurvey}
              disabled={loading}
              className={`px-6 py-2 text-white font-medium rounded-md ${loading ? "bg-gray-400" : "bg-itg-red hover:bg-red-700"}`}
            >
              {loading ? "Creating..." : "Create Survey"}
            </button>
          </div>
        </div>
      </div>
      
      <PreviewModal
  isOpen={isPreviewOpen}
  onClose={() => setIsPreviewOpen(false)}
  title={title}
  description={description}
  sections={sections.map(s => ({...s, questions: questions.filter(q => q.sectionId === s.id) }))}
  questions={questions}
/>
    </div>
    </>
  );
}
  
