import type { Survey } from '@/components/types/survey';
import { formatDate } from '@/utils/dateUtils';

interface SurveyCardProps {
    survey: Survey;
    responsesCount: number;
  }

export function SurveyCard({ survey }: SurveyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{survey.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{survey.description}</p>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Created: {formatDate(survey.createdAt)}</span>
        <span>{survey.responses_count || 0} responses</span>
      </div>
      
      <div className="mt-4 flex space-x-2">
        <a
          href={`/admin/surveys/${survey.id}/edit`}
          className="flex-1 text-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
        >
          Edit
        </a>
        <a
          href={`/admin/surveys/${survey.id}/results`}
          className="flex-1 text-center px-4 py-2 bg-itg-red hover:bg-red-700 text-white rounded-md transition-colors"
        >
          View Results
        </a>
      </div>
    </div>
  );
}