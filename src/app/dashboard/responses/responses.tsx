"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import supabase from "@/lib/supabase";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Response {
  id: string;
  answers: Record<string, string>;
  created_at: string;
  survey: {
    title: string;
    questions: Array<{
      id: string;
      text: string;
      type: string;
    }>;
  };
  user: {
    email: string;
  };
}

export default function SurveyResponses() {
  const router = useRouter();
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    // Move fetchResponses inside useEffect
    async function fetchResponses() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth/login');
          return;
        }

        const { data, error } = await supabase
          .from("responses")
          .select(`
            *,
            survey:surveys (
              title,
              questions
            ),
            user:users (
              email
            )
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setResponses(data || []);
      } catch (err) {
        console.error('Error fetching responses:', err);
        setError(err instanceof Error ? err.message : "Failed to load responses");
      } finally {
        setLoading(false);
      }
    }

    fetchResponses();
  }, [router]); // Include router in dependencies

  const filteredResponses = responses.filter(response =>
    response.survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    response.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedResponses = [...filteredResponses].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Survey Responses</h1>
        <p className="mt-2 text-gray-600">View and manage all survey responses</p>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search responses..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itg-red focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <span className="mr-2">Sort</span>
            {sortOrder === "desc" ? "↓" : "↑"}
          </button>
        </div>
      </div>

      {/* Results */}
      {sortedResponses.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {sortedResponses.map((response) => (
              <li key={response.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {response.survey.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Submitted by {response.user.email}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(new Date(response.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-4">
                    {response.survey.questions.map((question, index) => (
                      <li key={question.id} className="grid grid-cols-[1fr,2fr] gap-4">
                        <div className="text-sm text-gray-600">
                          Q{index + 1}: {question.text}
                        </div>
                        <div className="text-sm text-gray-900">
                          {response.answers[question.id] || "No answer"}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No responses found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? "Try adjusting your search terms" : "No responses have been submitted yet"}
          </p>
        </div>
      )}
    </div>
  );
}
