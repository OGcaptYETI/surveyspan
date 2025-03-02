"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ResponseCard from './ResponseCard';
import supabase from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';

interface SurveyResponse {
  id: string;
  survey_id: string;
  survey_title: string;
  completed_at: string;
  status: 'completed' | 'partial';
  question_count: number;
  time_taken: number;
}

type SortOption = 'newest' | 'oldest' | 'title';

interface SurveyListProps {
  onRefresh?: () => void;
}

export default function SurveyList({ onRefresh }: SurveyListProps) {
  const router = useRouter();
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'partial'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchResponses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data, error } = await supabase
        .from('survey_responses')
        .select(`
          id,
          submitted_at,
          user_id,
          survey_id,
          status,
          question_count,
          time_taken,
          survey:surveys (
            id,
            title,
            is_active
          )
        `)
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      const formattedResponses: SurveyResponse[] = data.map(response => ({
        id: response.id,
        survey_id: response.survey_id,
        survey_title: response.survey[0].title,
        completed_at: response.submitted_at,
        status: response.status,
        question_count: response.question_count,
        time_taken: response.time_taken
      }));

      setResponses(formattedResponses);
      onRefresh?.();
    } catch (err) {
      console.error('Error fetching responses:', err);
      setError(err instanceof Error ? err.message : 'Failed to load responses');
    } finally {
      setLoading(false);
    }
  }, [router, onRefresh]);

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    fetchResponses();
  }, [fetchResponses]);

  const sortedAndFilteredResponses = responses
    .filter(response => {
      if (filter !== 'all' && response.status !== filter) return false;
      if (searchTerm && !response.survey_title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime();
        case 'oldest':
          return new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime();
        case 'title':
          return a.survey_title.localeCompare(b.survey_title);
        default:
          return 0;
      }
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
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search surveys..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itg-red focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <select
              aria-label="Sort responses"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itg-red focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              aria-label="Refresh responses"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {(['all', 'completed', 'partial'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-itg-red text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Your Responses ({sortedAndFilteredResponses.length})
        </h2>
        {responses.length > 0 && searchTerm && (
          <p className="text-sm text-gray-500">
            Showing {sortedAndFilteredResponses.length} of {responses.length} responses
          </p>
        )}
      </div>

      {/* Empty State */}
      {responses.length === 0 ? (
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No responses yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven&apos;t completed any surveys yet.
          </p>
        </div>
      ) : sortedAndFilteredResponses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">No matching responses found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedAndFilteredResponses.map((response) => (
            <ResponseCard key={response.id} response={response} />
          ))}
        </div>
      )}
    </div>
  );
}