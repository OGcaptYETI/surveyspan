import { BarChart } from './charts/BarChart';
import { PieChart } from './charts/PieChart';

interface QuestionData {
  question: string; // Changed from question_text to match the type in page.tsx
  type: string;
  responses: number;
  data: Array<{
    label: string;
    value: number;
  }>;
}

interface QuestionResultsProps {
  results: Record<string, QuestionData>;
}

export function QuestionResults({ results }: QuestionResultsProps) {
  return (
    <div className="space-y-8">
      {Object.entries(results).map(([questionId, data]) => (
        <div 
          key={questionId}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">{data.question}</h3>
          
          {data.type === 'multiple_choice' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[300px]">
                <BarChart data={data.data.reduce((acc, item) => ({
                  ...acc,
                  [item.label]: item.value
                }), {})} />
              </div>
              <div className="h-[300px]">
                <PieChart data={data.data.reduce((acc, item) => ({
                  ...acc,
                  [item.label]: item.value
                }), {})} />
              </div>
            </div>
          )}

          {data.type === 'short_text' && (
            <div className="space-y-2">
              {data.data.map((item, index) => (
                <div 
                  key={`${questionId}-${index}`}
                  className="p-3 bg-gray-50 rounded"
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 text-sm text-gray-500">
            Total responses: {data.responses}
          </div>
        </div>
      ))}
    </div>
  );
}