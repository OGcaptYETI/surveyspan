"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";
interface SurveyStats {
  total: number;
  active: number;
  responses: number;
}

interface RecentResponse {
  id: string;
  surveyTitle: string;
  respondentEmail: string;
  submittedAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<SurveyStats>({
    total: 0,
    active: 0,
    responses: 0,
  });
  const [recentResponses, setRecentResponses] = useState<RecentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/');
          return;
        }

        // Fetch survey stats
        const { data: surveysData } = await supabase
          .from('surveys')
          .select('*')
          .eq('userId', user.id);

        const { data: responsesData } = await supabase
          .from('survey_responses')
          .select('*')
          .eq('userId', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          total: surveysData?.length || 0,
          active: surveysData?.filter(s => s.isActive).length || 0,
          responses: responsesData?.length || 0,
        });

        setRecentResponses(responsesData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-itg-white to-itg-gray/5">
      {/* Header */}
      <header className="bg-white border-b border-itg-gray/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="font-stainless font-bold text-3xl text-itg-black">Dashboard</h1>
            <button
              onClick={() => router.push('/admin/createsurvey')}
              className="btn-primary"
            >
              Create New Survey
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-itg-red mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-itg-gray/10">
                <h3 className="font-stainless text-sm font-bold text-itg-gray uppercase">Total Surveys</h3>
                <p className="font-stainless text-4xl font-bold text-itg-black mt-2">{stats.total}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-itg-gray/10">
                <h3 className="font-stainless text-sm font-bold text-itg-gray uppercase">Active Surveys</h3>
                <p className="font-stainless text-4xl font-bold text-itg-red mt-2">{stats.active}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-itg-gray/10">
                <h3 className="font-stainless text-sm font-bold text-itg-gray uppercase">Total Responses</h3>
                <p className="font-stainless text-4xl font-bold text-itg-black mt-2">{stats.responses}</p>
              </div>
            </div>

            {/* Recent Responses */}
            <div className="bg-white rounded-xl shadow-sm border border-itg-gray/10">
              <div className="p-6 border-b border-itg-gray/10">
                <h2 className="font-stainless font-bold text-xl text-itg-black">Recent Responses</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-itg-gray/10">
                      <th className="px-6 py-3 text-left text-xs font-stainless font-bold text-itg-gray uppercase">Survey</th>
                      <th className="px-6 py-3 text-left text-xs font-stainless font-bold text-itg-gray uppercase">Respondent</th>
                      <th className="px-6 py-3 text-left text-xs font-stainless font-bold text-itg-gray uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-stainless font-bold text-itg-gray uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentResponses.map((response) => (
                      <tr key={response.id} className="border-b border-itg-gray/10 hover:bg-itg-gray/5">
                        <td className="px-6 py-4 font-stainless text-itg-black">{response.surveyTitle}</td>
                        <td className="px-6 py-4 font-stainless text-itg-black">{response.respondentEmail}</td>
                        <td className="px-6 py-4 font-stainless text-itg-gray">
                          {new Date(response.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => router.push(`/survey/${response.id}`)}
                            className="text-itg-red hover:text-itg-red/80 font-stainless font-bold"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                    {recentResponses.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center font-stainless text-itg-gray">
                          No responses yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}