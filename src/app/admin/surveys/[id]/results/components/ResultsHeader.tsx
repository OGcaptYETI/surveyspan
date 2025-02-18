interface ResultsHeaderProps {
  survey: {
    title: string;
    description?: string;
    created_at: string;
  };
  responseCount: number;
}

export function ResultsHeader({ survey, responseCount }: ResultsHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{survey.title}</h1>
        <a 
          href="/admin/surveys" 
          className="text-itg-red hover:text-red-700"
        >
          Back to Surveys
        </a>
      </div>
      {survey.description && (
        <p className="text-gray-600 mt-2">{survey.description}</p>
      )}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-lg">
          Total Responses: <span className="font-semibold">{responseCount}</span>
        </div>
        <div className="text-sm text-gray-500">
          Created: {new Date(survey.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}