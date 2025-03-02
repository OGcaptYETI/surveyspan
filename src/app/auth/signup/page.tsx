"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import supabase from "@/lib/supabase";
import LoadingSpinner from "@/components/LoadingSpinner";
import Header from "@/components/Header";

interface SignupState {
  step: 'form' | 'confirmation';
  email: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupState, setSignupState] = useState<SignupState>({
    step: 'form',
    email: ''
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        router.push("/dashboard");
      }
    };
    checkAuth();
  }, [router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      // Form validation
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError("All fields are required");
        setLoading(false);
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      // Password validation
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
  
      // Check if the user already exists
      const { data: existingUser, error: existingUserError } = await supabase
        .from("users")
        .select("id")
        .eq("email", formData.email)
        .maybeSingle();
    
      if (existingUserError) {
        console.error("❌ Error checking existing user:", existingUserError);
        throw new Error("Error checking existing user.");
      }
    
      if (existingUser) {
        throw new Error("A user with this email already exists.");
      }
  
      // Create user with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
  
      if (signUpError) throw signUpError;
      
      if (data?.user) {
        // Create user record in users table with default role
        const { error: insertError } = await supabase
          .from("users")
          .insert({
            id: data.user.id,
            email: data.user.email,
            role: "user",
            status: "pending",
            email_verified: false
          });

        if (insertError) {
          console.error("Failed to create user record:", insertError);
          // Continue anyway since the auth record is created
        }
        
        // Show confirmation screen
        setSignupState({
          step: 'confirmation',
          email: formData.email
        });
      }
    } catch (err) {
      console.error("❌ Signup process failed:", err);
      setError(
        err instanceof Error 
          ? err.message 
          : "Failed to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  
  if (signupState.step === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />

        {/* Confirmation Content */}
        <div className="flex min-h-screen items-center justify-center pt-16">
          <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md mx-4 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-itg-red to-red-300"></div>
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-red-50 rounded-full opacity-20"></div>
            <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-red-50 rounded-full opacity-20"></div>
            
            {/* Content */}
            <div className="mb-8 relative">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Almost there!</h2>
              <p className="text-center text-gray-600">Please check your email to complete your registration</p>
            </div>
            
            <div className="bg-gray-50 p-5 rounded-lg mb-8 border border-gray-100">
              <p className="text-sm text-gray-600">
                <span className="block text-center mb-1 text-gray-500">We&apos;ve sent a verification link to:</span>
                <span className="block font-medium text-gray-900 text-lg text-center break-all">{signupState.email}</span>
              </p>
              
              <div className="text-xs text-gray-500 mt-4 flex items-center">
                <svg className="w-4 h-4 mr-1 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Don&apos;t see it? Check your spam folder or make sure the email is correct.</span>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full bg-itg-red text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-sm hover:shadow"
              >
                Go to Login
              </button>
              <button
                onClick={() => setSignupState({ step: 'form', email: '' })}
                className="w-full bg-white text-gray-700 py-3 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                Use Different Email
              </button>
              <Link 
                href="/"
                className="block text-center text-sm text-gray-600 hover:text-itg-red transition-colors mt-4"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />

      <div className="flex min-h-screen">
        {/* Left Panel - Signup Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Create Account</h1>
              <p className="mt-3 text-lg text-gray-600">Join thousands of survey creators</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-6">
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
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
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
                      minLength={6}
                      placeholder="Create a secure password"
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itg-red focus:border-transparent transition-shadow"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Must be at least 6 characters
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      required
                      minLength={6}
                      placeholder="Confirm your password"
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itg-red focus:border-transparent transition-shadow"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-itg-red text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:hover:bg-itg-red"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="small" />
                    <span className="ml-2">Creating Account...</span>
                  </div>
                ) : "Create Account"}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">Already registered?</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/auth/login" 
                  className="w-full inline-flex items-center justify-center py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Sign in to your account
                </Link>
                <Link href="/"
                  className="block text-center text-sm text-gray-600 hover:text-itg-red transition-colors"
                >
                  Return to Homepage
                </Link>
              </div>
            </form>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <p className="text-center text-sm text-gray-500">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-itg-red hover:text-red-700">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-itg-red hover:text-red-700">
                  Privacy Policy
                </Link>
              </p>
              
              <div className="flex items-center justify-center mt-4">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-xs text-gray-500">Your data is securely encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Feature Highlights */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-itg-red to-red-700 p-12 items-center justify-center">
          <div className="max-w-md text-white">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Why SurveySpan?</h2>
              <p className="text-white/80 text-lg">
                Join thousands of professionals who use SurveySpan to collect actionable data and make better decisions.
              </p>
            </div>
            
            <ul className="space-y-6">
              {[
                {
                  title: "Easy Survey Creation",
                  desc: "Create professional surveys in minutes with our intuitive design tools",
                  icon: (
                    <li key="creation">
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </li>
                  )
                },
                {
                  title: "Powerful Analytics",
                  desc: "Get real-time insights with advanced charts and data visualization",
                  icon: (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )
                },
                {
                  title: "Team Collaboration",
                  desc: "Work together with colleagues to design surveys and analyze results",
                  icon: (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )
                },
              ].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="bg-white/10 rounded-lg p-3 mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-white/80">{feature.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            
            {/* Testimonial */}
            <div className="mt-12 bg-white/10 rounded-lg p-5 relative">
              <svg className="absolute -top-3 left-5 w-8 h-8 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-white mt-2">
                &ldquo;SurveySpan has completely transformed how we collect customer feedback. The insights have been invaluable.&rdquo;
              </p>
              <div className="mt-3 flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">JD</span>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-sm">Jane Doe</p>
                  <p className="text-white/70 text-xs">Product Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}