"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import supabase from "@/lib/supabase";
import LoadingSpinner from "@/components/LoadingSpinner";
import Header from "@/components/Header";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [renderComplete, setRenderComplete] = useState(false);

  useEffect(() => {
    // Mark component as rendered
    setRenderComplete(true);

    // Check for error or message from URL params
    const errorParam = searchParams?.get('error');
    const messageParam = searchParams?.get('message');
    
    if (errorParam) setError(decodeURIComponent(errorParam));
    if (messageParam) setMessage(decodeURIComponent(messageParam));
    
    const checkAuth = async () => {
      console.log("Checking auth status...");
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Auth session error:", sessionError);
          setInitialLoading(false);
          return;
        }
        
        console.log("Session data:", sessionData?.session ? "Session exists" : "No session");
        
        // If session exists and user is authenticated
        if (sessionData?.session?.user) {
          console.log("User authenticated, fetching role...");
          // Get user role and redirect
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("role")
            .eq("id", sessionData.session.user.id)
            .single();

          if (userError) {
            console.error("User data error:", userError);
            setInitialLoading(false);
            return;
          }

          console.log("User role:", userData?.role || "No role found");

          // Redirect based on role
          let redirectPath = "/dashboard"; // Default
          
          switch(userData?.role) {
            case 'super_admin':
              redirectPath = "/super-admin";
              break;
            case 'admin':
              redirectPath = "/admin";
              break;
          }
          
          console.log(`Redirecting to ${redirectPath}...`);
          router.push(redirectPath);
        } else {
          console.log("No authenticated user found");
          setInitialLoading(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setInitialLoading(false);
      }
    };
    
    checkAuth();
  }, [router, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      console.log("Attempting login...");
      // Attempt sign in
      const { error, data } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error("Login error:", error);
        throw error;
      }
      
      console.log("Login successful, user:", data.user?.id || "No user ID");
      
      if (!data.user) throw new Error("Login failed - no user returned");

      // Fetch user role from database
      console.log("Fetching user role...");
      const { data: userData, error: roleError } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (roleError) {
        console.error("Role fetch error:", roleError);
        // If user doesn't exist in users table, create a record
        if (roleError.code === 'PGRST116') {
          console.log("User record not found, creating new user entry...");
          await supabase
            .from("users")
            .insert({ 
              id: data.user.id, 
              email: data.user.email, 
              role: "user",
              created_at: new Date().toISOString(),
              email_verified: true,
              status: 'active'
            });
            
          console.log("Redirecting new user to dashboard...");
          router.push("/dashboard");
          return;
        }
        throw roleError;
      }

      console.log("User role found:", userData?.role);

      // Redirect based on role
      let redirectPath = "/dashboard";
      
      switch(userData?.role) {
        case 'super_admin':
          redirectPath = "/super-admin";
          break;
        case 'admin':
          redirectPath = "/admin";
          break;
      }
      
      console.log(`Redirecting to ${redirectPath}...`);
      router.push(redirectPath);
      
    } catch (err: unknown) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Add debug output to help diagnose rendering issues
  if (!renderComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-gray-600">Component initializing...</p>
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-gray-600">Checking authentication...</p>
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />

      <div className="flex min-h-screen">
        {/* Login form content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Welcome Back</h1>
              <p className="mt-3 text-lg text-gray-600">Sign in to continue to SurveySpan</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {message && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {message}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itg-red focus:border-transparent transition-shadow"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Link href="/auth/reset-password" className="text-sm font-medium text-itg-red hover:text-red-700">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itg-red focus:border-transparent transition-shadow"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-itg-red text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-all transform hover:scale-[1.02] shadow-sm hover:shadow disabled:opacity-50 disabled:hover:scale-100"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="small" />
                    <span className="ml-2">Signing In...</span>
                  </div>
                ) : "Sign In"}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">New to SurveySpan?</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/auth/signup" 
                  className="w-full inline-flex items-center justify-center py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Create an account
                </Link>
                <Link href="/"
                  className="block text-center text-sm text-gray-600 hover:text-itg-red transition-colors"
                >
                  Return to Homepage
                </Link>
              </div>
            </form>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex items-center justify-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-xs text-gray-500">Secure, encrypted connection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Why Login */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-itg-red to-red-700 p-12 items-center justify-center">
          <div className="max-w-md text-white">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Welcome back!</h2>
              <p className="text-white/80 text-lg">
                Sign in to access your surveys, view responses, and get valuable insights from your data.
              </p>
            </div>
            
            <div className="space-y-8">
              {/* Feature highlights */}
              {[
                {
                  title: "Access Your Dashboard",
                  desc: "View all your surveys and responses in one place",
                  icon: (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  )
                },
                {
                  title: "Analyze Results",
                  desc: "Get detailed insights from your survey responses",
                  icon: (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )
                },
                {
                  title: "Manage Your Account",
                  desc: "Update your profile and subscription settings",
                  icon: (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )
                }
              ].map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="bg-white/10 rounded-lg p-3 mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-white/80">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 pt-6 border-t border-white/20">
              <p className="text-white/90">Need help? <Link href="/contact" className="underline hover:text-white">Contact our support team</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}