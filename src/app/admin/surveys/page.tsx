'use client';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { SurveysList } from './components/SurveysList';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import SearchBar from '@/components/SearchBar';

export default function AdminSurveysPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'closed'>('all');

  const handleCreateSurvey = () => {
    router.push('/admin/createsurvey');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Surveys</h1>
          <p className="text-gray-600 mt-1">Manage your surveys and view responses</p>
        </div>
        <button 
          onClick={handleCreateSurvey}
          className="flex items-center gap-2 bg-itg-red hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Icon icon="material-symbols:add" className="w-5 h-5" />
          Create New Survey
        </button>
      </div>

      {/* Filters and Search Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search surveys..."
            className="w-full"
            onSearch={(query) => setSearchQuery(query)}
          />
        </div>
        <div className="flex gap-2">
          <select
            aria-label="Filter surveys by status"
            value={statusFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as 'all' | 'active' | 'draft' | 'closed')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itg-red focus:border-transparent"
          >
            <option value="all">All Surveys</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
            className="px-3 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            aria-label="Clear filters"
          >
            <Icon icon="material-symbols:refresh" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Surveys List with Loading State */}
      <Suspense fallback={<LoadingSkeleton />}>
        <SurveysList 
          searchQuery={searchQuery}
          statusFilter={statusFilter}
        />
      </Suspense>

      {/* Empty State */}
      <div className="hidden">
        <div className="text-center py-12">
          <Icon icon="material-symbols:description-outline" className="w-16 h-16 mx-auto text-gray-400" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">No surveys found</h2>
          <p className="mt-2 text-gray-600">Get started by creating your first survey</p>
          <button
            onClick={handleCreateSurvey}
            className="mt-4 px-4 py-2 bg-itg-red text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Create Survey
          </button>
        </div>
      </div>
    </div>
  );
}