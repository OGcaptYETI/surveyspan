'use client';

import { useEffect, useState, useMemo } from 'react';
import type { Survey } from '@/components/types/survey';
import supabase from "@/lib/supabase";
import { SurveyCard } from './SurveyCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Icon } from '@iconify/react';

interface SurveysListProps {
  searchQuery: string;
  statusFilter: 'all' | 'active' | 'draft' | 'closed';
}

export function SurveysList({ searchQuery, statusFilter }: SurveysListProps) {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSurveys() {
      try {
        setLoading(true);
        setError(null);

        // Fetch surveys without responses first
        const { data: surveysData, error: surveysError } = await supabase
          .from('surveys')
          .select('*')
          .order('created_at', { ascending: false });

        if (surveysError) throw surveysError;
        if (!surveysData) throw new Error('No surveys found');

        // Apply status filter
        const filteredData = statusFilter === 'all' 
          ? surveysData 
          : surveysData.filter(survey => survey.status === statusFilter);

        // Set initial data
        setSurveys(filteredData.map(survey => ({
          ...survey,
          responses: [{ count: 0 }]
        })));

        // Try to fetch response counts
        try {
            interface ResponseCount {
                survey_id: string;
                count: number;
              }
              
              // Change the query to use countQuery
              const { data: responseCounts, error: countError } = await supabase
                .from('responses')
                .select('survey_id, count')
                .select('survey_id, count');

          if (!countError && responseCounts) {
            setSurveys(prevSurveys => 
              prevSurveys.map(survey => ({
                ...survey,
                responses: [{ 
                  count: (responseCounts as ResponseCount[]).find(r => r.survey_id === survey.id)?.count || 0 
                }]
              }))
            );
          }
        } catch (countError) {
          // Silently handle missing responses table
          console.warn('Could not fetch response counts:', countError);
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error('Error details:', err);
        setError(`Failed to load surveys: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }

    fetchSurveys();
  }, [statusFilter]);

  // Filter surveys based on search query
  const filteredSurveys = useMemo(() => {
    if (!searchQuery) return surveys;

    const query = searchQuery.toLowerCase();
    return surveys.filter(survey => 
      survey.title.toLowerCase().includes(query) ||
      survey.description?.toLowerCase().includes(query)
    );
  }, [surveys, searchQuery]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <LoadingSkeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Icon icon="material-symbols:error-outline" className="w-12 h-12 mx-auto text-red-500" />
        <p className="mt-4 text-gray-900">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (filteredSurveys.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon icon="material-symbols:search-off-outline" className="w-12 h-12 mx-auto text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No surveys found</h3>
        <p className="mt-2 text-gray-600">
          {searchQuery 
            ? "Try adjusting your search or filters"
            : "Get started by creating your first survey"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredSurveys.map((survey) => (
        <SurveyCard 
          key={survey.id} 
          survey={survey}
          responsesCount={survey.responses?.[0]?.count ?? 0}
        />
      ))}
    </div>
  );
}