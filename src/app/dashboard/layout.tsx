"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import DashboardNav from "./components/DashboardNav";
import DashboardHeader from "./components/DashboardHeader";
import supabase from "@/lib/supabase";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProtectedRoute from "@/components/ProtectedRoute";

type UserRole = 'user' | 'admin' | 'super_admin';

interface UserData {
  id: string;
  role: UserRole;
  email: string;
  organization?: {
    name: string;
    role: string;
  };
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setError(null);
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        if (!user) {
          return; // Protected route will handle redirect
        }

        // Get user data including role and organization
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select(`
            id,
            role,
            email,
            organization
          `)
          .eq('id', user.id)
          .single();

        if (userError) throw userError;

        setUserData(userData);
      } catch (error) {
        console.error('User data fetch failed:', error);
        setError(error instanceof Error ? error.message : 'Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Content to render after authentication
  const dashboardContent = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <LoadingSpinner size="large" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Error Loading Dashboard</h3>
              <p className="mt-2 text-sm text-gray-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-itg-red text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader 
          userData={userData} 
          userRole={userData?.role || 'user'} 
          pathname={pathname || ''} 
          onLogout={handleLogout}
          toggleSidebar={toggleSidebar}
        />
        <div className="flex">
          <DashboardNav
            userData={userData}
            pathname={pathname || ''}
            userRole={userData?.role || 'user'}
            onLogout={handleLogout}
            isOpen={isSidebarOpen}
          />
          <main className={`transition-all duration-300 flex-1 p-6 overflow-auto ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  };

  // Wrap everything in the ProtectedRoute component
  return (
    <ProtectedRoute>
      {dashboardContent()}
    </ProtectedRoute>
  );
}
