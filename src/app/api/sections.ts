import supabase from "@/lib/supabase";

// ✅ Create a new section
export const createSection = async (surveyId: string, title: string, description: string) => {
  const { data, error } = await supabase
    .from("sections")
    .insert([{ survey_id: surveyId, title, description }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ✅ Fetch all sections for a survey
export const fetchSections = async (surveyId: string) => {
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("survey_id", surveyId);
  if (error) throw error;
  return data;
};

// ✅ Update a section
export const updateSection = async (sectionId: string, updates: Partial<{ title: string; description: string }>) => {
  const { error } = await supabase
    .from("sections")
    .update(updates)
    .eq("id", sectionId);
  if (error) throw error;
};

// ✅ Delete a section
export const deleteSection = async (sectionId: string) => {
  const { error } = await supabase
    .from("sections")
    .delete()
    .eq("id", sectionId);
  if (error) throw error;
};
