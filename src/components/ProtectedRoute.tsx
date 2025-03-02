"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";
import { UserRole } from "@/components/types/auth";
import LoadingSpinner from "@/components/LoadingSpinner";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole | undefined; // undefined means any authenticated user
  redirectTo?: string; // custom redirect path
}

export default function ProtectedRoute({ 
  children, 
  requiredRole,
  redirectTo = "/auth/login"
}: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        const { data, error } = await supabase.auth.getUser();
        
        if (error || !data.user) {
          // Not authenticated, redirect to login
          console.log("User not authenticated, redirecting to login");
          router.push(redirectTo);
          return;
        }

        // If specific role is required
        if (requiredRole) {
          // Fetch user role
          const { data: userData, error: roleError } = await supabase
            .from("users")
            .select("role")
            .eq("id", data.user.id)
            .single();
          
          if (roleError) {
            console.error("Error fetching user role:", roleError);
            router.push("/dashboard"); // Redirect to default dashboard
            return;
          }
          
          if (userData?.role !== requiredRole) {
            // Unauthorized role
            console.error(`Access denied: Required role '${requiredRole}' not matched, user has role '${userData?.role}'`);
            
            // Redirect based on user's actual role
            switch(userData?.role) {
              case 'super_admin':
                router.push("/super-admin");
                break;
              case 'admin':
                router.push("/admin");
                break;
              default:
                router.push("/dashboard");
            }
            return;
          }
        }

        // User is authenticated and has correct role if required
        setAuthorized(true);
      } catch (err) {
        console.error("Auth check error:", err);
        router.push(redirectTo);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, requiredRole, redirectTo]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-500">Verifying access...</p>
      </div>
    );
  }

  // Only render children if authorized
  return authorized ? <>{children}</> : null;
}