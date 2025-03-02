"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";
import DashboardCard from "@/components/DashboardCard";
import SearchBar from "@/components/SearchBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { UserRole } from "@/components/types/auth";

interface Survey {
  id: string;
  title: string;
  createdAt: string;
  userId: string;
  response_count?: number;
}

interface UserData {
  role: UserRole;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSurveys = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      if (!session) {
        router.push('/auth/login');
        return;
      }

      // Check admin role with proper typing
      const { data: userData, error: roleError } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single<UserData>();

      if (roleError) throw roleError;
      
      // Use UserRole type for strict role checking
      const userRole = userData?.role as UserRole;
      if (userRole !== 'admin' && userRole !== 'super_admin') {
        router.push("/dashboard");
        return;
      }

      // Fetch surveys with response count
      const { data, error } = await supabase
        .from("surveys")
        .select(`
          id,
          title,
          createdAt,
          userId,
          responses:survey_responses(count)
        `)
        .order("createdAt", { ascending: false });

      if (error) throw error;

      // Transform the data to include response count
      const surveysWithCounts = data.map(survey => ({
        ...survey,
        response_count: survey.responses?.[0]?.count || 0
      }));

      setSurveys(surveysWithCounts);
    } catch (err: unknown) {
      console.error('Error fetching surveys:', err);
      setError(err instanceof Error ? err.message : "Failed to load surveys.");
    } finally {
      setLoading(false);
    }
  };

  // Use useCallback to memoize the function
  const fetchSurveysCallback = useCallback(fetchSurveys, [router]);

  useEffect(() => {
    fetchSurveysCallback();
  }, [fetchSurveysCallback]);

  const refreshSurveys = async () => {
    setLoading(true);
    await fetchSurveysCallback();
  };

  const filteredSurveys = surveys.filter((survey) =>
    survey.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Survey Dashboard</h1>
        <button
          onClick={refreshSurveys}
          className="px-4 py-2 bg-itg-red text-white rounded-md hover:bg-red-700 transition-colors"
          disabled={loading}
        >
          {loading ? <LoadingSpinner size="small" /> : 'Refresh'}
        </button>
      </div>

      <SearchBar 
        value={search} 
        onSearch={setSearch} 
        onChange={(e) => setSearch(e.target.value)}
      />

      {error ? (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button
            onClick={refreshSurveys}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Try again
          </button>
        </div>
      ) : filteredSurveys.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredSurveys.map((survey) => (
            <DashboardCard
              key={survey.id}
              title={survey.title}
              content={`
                Created on: ${new Date(survey.createdAt).toLocaleDateString()}
                Responses: ${survey.response_count}
              `}
              footer={
                <button
                  onClick={() => router.push(`/admin/surveys/${survey.id}/responses`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  View Responses
                </button>
              }
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-4">No surveys found.</p>
      )}
    </div>
  );
}
