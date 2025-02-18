import supabase from "@/lib/supabase";



interface SurveyResponse {
  survey_id: string;
  answers: Record<string, string | number | boolean | string[]>;
  completed: boolean;
  duration: number;
  metadata: {
    userAgent: string;
    language: string;
    timestamp: string;
    timezone: string;
    screenSize?: {
      width: number;
      height: number;
    };
  };
}

export async function submitSurveyResponse(
  surveyId: string, 
  answers: Record<string, string | number | boolean | string[]>
): Promise<SurveyResponse> {
  try {
    if (!surveyId) throw new Error('Survey ID is required');
    if (!answers || Object.keys(answers).length === 0) {
      throw new Error('Answers are required');
    }

    const startTime = Date.now();
    
    const response: SurveyResponse = {
      survey_id: surveyId,
      answers,
      completed: true,
      duration: Math.floor((Date.now() - startTime) / 1000),
      metadata: {
        userAgent: window.navigator.userAgent,
        language: window.navigator.language,
        timestamp: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screenSize: typeof window !== 'undefined' ? {
          width: window.innerWidth,
          height: window.innerHeight
        } : undefined
      }
    };

    const { data, error } = await supabase
      .from('survey_responses')
      .insert(response)
      .select()
      .single();

    if (error) throw error;
    return data;

  } catch (error) {
    console.error('Error submitting survey response:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Failed to submit survey response');
  }
}