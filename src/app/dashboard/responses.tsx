import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import supabase from "@/lib/supabase";

interface Response {
  id: string;
  answers: Record<string, string>;
  createdAt: string;
}

export default function SurveyResponses() {
  const router = useRouter();
  const { id } = router.query;
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchResponses = async () => {
      try {
        const { data, error } = await supabase
          .from("responses")
          .select("*")
          .eq("survey_id", id)
          .order("createdAt", { ascending: false });

        if (error) throw error;
        setResponses(data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load responses.");
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [id]);

  if (loading) return <p className="p-6">Loading responses...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Survey Responses</h1>
      {responses.length > 0 ? (
        <ul className="space-y-4">
          {responses.map((response) => (
            <li key={response.id} className="border p-4 rounded-lg shadow-md">
              <p className="text-sm text-gray-500">Submitted: {new Date(response.createdAt).toLocaleString()}</p>
              <ul className="mt-2 space-y-2">
                {Object.entries(response.answers).map(([questionId, answer]) => (
                  <li key={questionId} className="border-b pb-2">
                    <strong>Q{questionId}:</strong> {answer}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No responses yet.</p>
      )}
    </div>
  );
}
