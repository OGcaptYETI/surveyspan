"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import supabase from "@/lib/supabase";


interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
      } else {
        setUserName(user.email || "");
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="h-full px-3 py-4 overflow-y-auto bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center mb-8 px-2">
            <span className="font-stainless text-2xl font-bold text-itg-red">SurveySpan</span>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <Link 
              href="/dashboard"
              className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 font-stainless"
            >
              <span className="ml-3">Dashboard</span>
            </Link>
            <Link 
              href="/dashboard/surveys"
              className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 font-stainless"
            >
              <span className="ml-3">My Surveys</span>
            </Link>
            <Link 
              href="/dashboard/responses"
              className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 font-stainless"
            >
              <span className="ml-3">Responses</span>
            </Link>
            <Link 
              href="/dashboard/settings"
              className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 font-stainless"
            >
              <span className="ml-3">Settings</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${isSidebarOpen ? "ml-64" : "ml-0"} transition-margin duration-300`}>
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <button
              title="Toggle sidebar"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* User Menu */}
            <div className="flex items-center">
              <div className="mr-4">
                <span className="font-stainless text-sm text-gray-700">{userName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-stainless text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
