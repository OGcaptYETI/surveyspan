"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import supabase from "@/lib/supabase";
import SurveyList from './components/SurveyList';
import LoadingSpinner from "@/components/LoadingSpinner";
import { UserRole } from "@/components/types/auth";

interface SurveyStats {
  total: number;
  active: number;
  responses: number;
}

interface RecentResponse {
  id: string;
  survey_title: string;
  respondent_email: string;
  submitted_at: string;
}

interface DashboardData {
  surveys: Array<{
    id: string;
    title: string;
    is_active: boolean;
    user_id: string;
  }>;
  responses: Array<{
    id: string;
    submitted_at: string;
    user_id: string;
    survey: {
      id: string;
      title: string;
      is_active: boolean;
    };
    user: {
      email: string;
    };
  }>;
}

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<SurveyStats>({
    total: 0,
    active: 0,
    responses: 0,
  });
  const [recentResponses, setRecentResponses] = useState<RecentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshDashboard = () => setRefreshTrigger(prev => prev + 1);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get session instead of user
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        if (!session) {
          router.push('/auth/login');
          return;
        }

        // Check user role
        const { data: userData, error: roleError } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (roleError) throw roleError;

        // Route based on role
        switch (userData?.role as UserRole) {
          case 'super_admin':
            router.push("/super-admin");
            return;
          case 'admin':
            router.push("/admin");
            return;
        }

        // Fetch dashboard data only for regular users
        const [surveysResponse, responsesResponse] = await Promise.all([
          supabase
            .from('surveys')
            .select('id, title, is_active, user_id')
            .eq('user_id', session.user.id),
          
          supabase
            .from('survey_responses')
            .select(`
              id,
              submitted_at,
              user_id,
              survey_id,
              survey:surveys (
                id,
                title,
                is_active
              ),
              user:users (
                email
              )
            `)
            .eq('user_id', session.user.id)
            .order('submitted_at', { ascending: false })
            .limit(5)
        ]);

        if (surveysResponse.error) throw surveysResponse.error;
        if (responsesResponse.error) throw responsesResponse.error;

        const dashboardData: DashboardData = {
          surveys: surveysResponse.data || [],
          responses: (responsesResponse.data?.map(item => ({
            ...item,
            survey: item.survey[0],
            user: item.user[0]
          })) as DashboardData['responses']) || []
        };

        // Calculate stats using dashboard data
        setStats({
          total: dashboardData.surveys.length,
          active: dashboardData.surveys.filter(s => s.is_active).length,
          responses: dashboardData.responses.length,
        });

        // Format recent responses
        const recent = dashboardData.responses.map(response => ({
          id: response.id,
          survey_title: response.survey.title || 'Untitled Survey',
          respondent_email: response.user.email || 'Unknown User',
          submitted_at: response.submitted_at,
        }));

        setRecentResponses(recent);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router, refreshTrigger]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
              <p className="mt-1 text-sm text-red-600">{error}</p>
              <button
                onClick={refreshDashboard}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            title: 'Total Surveys',
            value: stats.total,
            color: 'bg-blue-500',
            icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
          },
          {
            title: 'Active Surveys',
            value: stats.active,
            color: 'bg-green-500',
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
          },
          {
            title: 'Total Responses',
            value: stats.responses,
            color: 'bg-purple-500',
            icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
          },
        ].map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-500">{stat.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Responses */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Responses</h2>
            <button
              onClick={refreshDashboard}
              className="text-sm text-itg-red hover:text-red-700"
            >
              Refresh
            </button>
          </div>
          {recentResponses.length > 0 ? (
            <div className="space-y-4">
              {recentResponses.map((response) => (
                <div key={response.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{response.survey_title}</h3>
                    <p className="text-sm text-gray-500">{response.respondent_email}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(new Date(response.submitted_at), 'MMM d, yyyy')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No recent responses</p>
          )}
        </div>
      </div>

      {/* Survey List Component */}
      <SurveyList onRefresh={refreshDashboard} />
    </div>
  );
}