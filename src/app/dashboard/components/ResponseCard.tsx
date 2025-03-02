"use client";

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

interface ResponseCardProps {
  response: {
    id: string;
    survey_id: string;
    survey_title: string;
    completed_at: string;
    status: 'completed' | 'partial';
    question_count: number;
    time_taken: number; // in minutes
  };
}

export default function ResponseCard({ response }: ResponseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    return status === 'completed' 
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {response.survey_title}
            </h3>
            <p className="text-sm text-gray-500">
              Completed {format(new Date(response.completed_at), 'MMM d, yyyy')}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(response.status)}`}>
            {response.status.charAt(0).toUpperCase() + response.status.slice(1)}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Questions</p>
            <p className="text-lg font-semibold text-gray-900">{response.question_count}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Time Taken</p>
            <p className="text-lg font-semibold text-gray-900">{response.time_taken} min</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-gray-600 hover:text-itg-red transition-colors flex items-center"
          >
            <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
            <svg
              className={`w-4 h-4 ml-1 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <Link
            href={`/survey/${response.survey_id}/response/${response.id}`}
            className="text-sm font-medium text-itg-red hover:text-red-700 transition-colors"
          >
            View Details
          </Link>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600">Started: {format(new Date(response.completed_at), 'h:mm a')}</span>
              </div>
              <div className="flex items-center text-sm">
                <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600">Response ID: {response.id.slice(0, 8)}...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}