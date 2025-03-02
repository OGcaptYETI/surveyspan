"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import supabase from "@/lib/supabase";
import LoadingSpinner from "@/components/LoadingSpinner";
import { UserRole } from "@/components/types/auth";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        if (!session?.user) throw new Error("No user found");

        // Check for error in URL params
        const errorMessage = searchParams.get("error_description");
        if (errorMessage) throw new Error(errorMessage);

        // Fetch user data with role and verification status
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, email, role, email_verified")
          .eq("id", session.user.id)
          .single();

        // If user doesn't exist in the users table yet, create entry
        if (userError && userError.code === 'PGRST116') {
          // Create new user record with default role
          const { error: insertError } = await supabase
            .from("users")
            .insert({ 
              id: session.user.id, 
              email: session.user.email, 
              role: "user", 
              email_verified: true,
              status: "active"
            });
          
          if (insertError) throw insertError;
          
          // Redirect to dashboard for new users
          router.push("/dashboard");
          return;
        } else if (userError) {
          throw userError;
        }

        // Update user's verification status
        if (!userData.email_verified) {
          const { error: updateError } = await supabase
            .from("users")
            .update({ 
              email_verified: true,
              status: "active" 
            })
            .eq("id", session.user.id);

          if (updateError) throw updateError;
        }

        // Handle role-based routing
        switch (userData.role as UserRole) {
          case 'super_admin':
            router.push("/super-admin");
            break;
          case 'admin':
            router.push("/admin");
            break;
          default:
            router.push("/dashboard");
        }

      } catch (err) {
        console.error("Verification error:", err);
        setError(err instanceof Error ? err.message : "Verification failed");
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [router, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-600">Verifying your account...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
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
            <h3 className="mt-4 text-lg font-medium text-gray-900">Verification Error</h3>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}