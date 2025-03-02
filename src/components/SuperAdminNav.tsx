import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function SuperAdminNav() {
  const [currentView, setCurrentView] = useState('users');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/super-admin') setCurrentView('users');
    else if (pathname === '/super-admin/analytics') setCurrentView('analytics');
  }, [pathname]);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800">Super Admin</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/super-admin"
                className={`${
                  currentView === 'users' 
                    ? 'border-itg-red text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Users
              </Link>
              <Link 
                href="/super-admin/analytics"
                className={`${
                  currentView === 'analytics' 
                    ? 'border-itg-red text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Analytics
              </Link>
              <Link 
                href="/dashboard"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                View User Dashboard
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => router.push('/auth/logout')}
              className="text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}