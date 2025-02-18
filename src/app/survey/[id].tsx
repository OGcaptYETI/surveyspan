import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import supabase from "@/lib/supabase";

interface Question {
  id: string;
  survey_id: string;
  question_text: string;
}

interface Survey {
  id: string;
  title: string;
  description?: string;
}

export default function SurveyPage() {
  const router = useRouter();
  const { id } = router.query;
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchSurvey = async () => {
      try {
        const { data: surveyData, error: surveyError } = await supabase
          .from("surveys")
          .select("*")
          .eq("id", id)
          .single();

        if (surveyError) throw surveyError;
        setSurvey(surveyData);

        const { data: questionData, error: questionError } = await supabase
          .from("questions")
          .select("*")
          .eq("survey_id", id);

        if (questionError) throw questionError;
        setQuestions(questionData || []);
      } catch (error) {
        console.error("Error fetching survey:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [id]);

  const submitSurvey = async () => {
    if (Object.keys(responses).length !== questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("responses").insert([{ survey_id: id, answers: responses }]);

      if (error) throw error;

      alert("Survey Submitted!");
      router.push("/thank-you"); // Redirect to a thank you page (optional)
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("Failed to submit survey. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="p-6">Loading survey...</p>;
  }

  if (!survey) {
    return <p className="p-6 text-red-500">Survey not found.</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{survey.title}</h1>
      {survey.description && <p className="text-gray-600 mb-6">{survey.description}</p>}

      {questions.map((q) => (
        <div key={q.id} className="mb-4">
          <label className="block font-semibold">{q.question_text}</label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            onChange={(e) => setResponses((prev) => ({ ...prev, [q.id]: e.target.value }))}
            placeholder={q.question_text}
            title={q.question_text}
          />
        </div>
      ))}

      <button
        onClick={submitSurvey}
        className={`mt-4 w-full p-2 rounded text-white ${submitting ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"}`}
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}

