import { useState } from 'react';
import { UserRole } from '@/components/types/auth';

interface AddUserModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (userData: { email: string; role: UserRole }) => Promise<void>;
  isLoading: boolean;
  onUserAdded: () => void;
}

export default function AddUserModal({ show, onClose, onSubmit, isLoading }: AddUserModalProps) {
  const [userData, setUserData] = useState({
    email: '',
    role: 'user' as UserRole,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(userData);
    // Reset form data after submission
    setUserData({
      email: '',
      role: 'user' as UserRole,
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Add New User</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close modal"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="user@example.com"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-itg-red focus:border-itg-red"
              value={userData.email}
              onChange={(e) => setUserData({...userData, email: e.target.value})}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              User Role
            </label>
            <select
              id="role"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-itg-red focus:border-itg-red"
              value={userData.role}
              onChange={(e) => setUserData({...userData, role: e.target.value as UserRole})}
            >
              <option value="user">Regular User</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-itg-red hover:bg-red-700 disabled:bg-red-300"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}