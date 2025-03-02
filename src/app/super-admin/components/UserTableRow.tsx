import { UserData } from '@/components/types/auth';

interface UserTableRowProps {
  user: UserData;
  onAction: (userId: string, action: string) => void;
  isProtected: boolean;
  lastSignInAt?: string;
  emailVerified?: boolean;
}

export default function UserTableRow({ user, onAction, isProtected }: UserTableRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-500">{user.email.charAt(0).toUpperCase()}</span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.email}</div>
            <div className="text-sm text-gray-500">{user.email_verified ? 'Verified' : 'Not verified'}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${user.role === 'super_admin' 
              ? 'bg-purple-100 text-purple-800' 
              : user.role === 'admin'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-green-100 text-green-800'
            }`}
        >
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${user.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : user.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
            }`}
        >
          {user.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(user.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <div className="relative inline-block text-left">
            <div>
              <select
                aria-label="User actions"
                className="mt-1 block py-1.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-itg-red focus:border-itg-red text-sm"
                value=""
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    onAction(user.id, value);
                    e.target.value = '';
                  }
                }}
                disabled={isProtected}
              >
                <option value="">Actions</option>
                <optgroup label="Change Role">
                  <option value="make_user" disabled={user.role === 'user'}>Make Regular User</option>
                  <option value="make_admin" disabled={user.role === 'admin'}>Make Admin</option>
                  <option value="make_super_admin" disabled={user.role === 'super_admin'}>Make Super Admin</option>
                </optgroup>
                <optgroup label="User Status">
                  <option value="activate" disabled={user.status === 'active'}>Activate</option>
                  <option value="suspend" disabled={user.status === 'suspended'}>Suspend</option>
                </optgroup>
                <option value="impersonate">Impersonate</option>
                <option value="delete" className="text-red-500">Delete</option>
              </select>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}