import UserTableRow from './UserTableRow';
import type { UserData } from '@/components/types/auth';
import LoadingSpinner from '@/components/LoadingSpinner';

interface UserTableProps {
  users: UserData[];
  loading: boolean;
  onAction: (userId: string, action: string) => void;
  createdAt?: string;
  lastSignInAt?: string;
  emailVerified?: boolean;
onUpdateRole: (userId: string, role: string) => Promise<void>;
    onUpdateStatus: (userId: string, status: 'active' | 'pending' | 'suspended') => Promise<void>;
    onDeleteUser: (userId: string) => Promise<void>;
    showEmpty: string;
  }

export default function UserTable({ users, loading, onAction }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filter
        </p>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <LoadingSpinner size="medium" />
        </div>
      )}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Login
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <UserTableRow 
              key={user.id} 
              user={user} 
              onAction={onAction}
              isProtected={user.role === 'super_admin' && user.email === 'me@bentindal.com'}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}