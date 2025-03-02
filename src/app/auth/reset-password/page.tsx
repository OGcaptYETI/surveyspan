"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import supabase from "@/lib/supabase";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        router.push("/dashboard");
      }
    };
    checkAuth();
  }, [router]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-confirm`,
      });

      if (error) throw error;
      
      setMessage("Password reset link sent! Check your email.");
      setResetSent(true);
      
      // Redirect after 5 seconds - increased for better user experience
      setTimeout(() => {
        router.push('/auth/login?message=Reset+link+sent+to+your+email');
      }, 5000);
    } catch (err: unknown) {
      console.error("Reset password error:", err);
      setError(err instanceof Error ? err.message : "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show success state after reset link is sent
  if (resetSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        
        <div className="flex min-h-screen items-center justify-center pt-16">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-4 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-itg-red to-red-300"></div>
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-red-50 rounded-full opacity-20"></div>
            <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-red-50 rounded-full opacity-20"></div>
            
            <div className="mb-8 relative">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Check Your Email</h2>
              <p className="text-center text-gray-600">We&apos;ve sent a password reset link to your email address</p>
            </div>
            
            <div className="bg-gray-50 p-5 rounded-lg mb-8 border border-gray-100">
              <p className="text-sm text-gray-600">
                <span className="block text-center mb-1 text-gray-500">Reset link sent to:</span>
                <span className="block font-medium text-gray-900 text-lg text-center break-all">{email}</span>
              </p>
              
              <div className="text-xs text-gray-500 mt-4 flex items-center">
                <svg className="w-4 h-4 mr-1 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>The link will expire after 24 hours. Check your spam folder if you don&apos;t see it.</span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-center text-sm text-gray-600">
                You&apos;ll be redirected to the login page in a few seconds.
              </p>
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full bg-itg-red text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-sm hover:shadow flex items-center justify-center"
              >
                Return to Login
              </button>
              <button
                onClick={() => setResetSent(false)}
                className="w-full bg-white text-gray-700 py-3 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                Try Different Email
              </button>
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
        {/* Left Panel - Reset Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Reset Your Password</h1>
              <p className="mt-2 text-gray-600">
                Enter your email and we&apos;ll send you instructions to reset your password
              </p>
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

            <form onSubmit={handleReset} className="space-y-6">
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
                    placeholder="Enter your email"
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itg-red focus:border-transparent transition-shadow"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Enter the email address associated with your account
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-itg-red text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
                disabled={loading || !email}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="small" />
                    <span className="ml-2">Sending...</span>
                  </div>
                ) : "Send Reset Link"}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <div className="space-y-4">
                <Link
                  href="/auth/login"
                  className="w-full inline-flex items-center justify-center py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back to Login
                </Link>
                <Link
                  href="/"
                  className="block text-center text-sm text-gray-600 hover:text-itg-red transition-colors"
                >
                  Return to Homepage
                </Link>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Need help? <Link href="/contact" className="text-itg-red hover:text-red-700">Contact Support</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Help Section */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-itg-red to-red-700 p-12 items-center justify-center">
          <div className="max-w-md text-white">
            <h2 className="text-3xl font-bold mb-6">Password Reset Help</h2>
            <ul className="space-y-6">
              {[
                {
                  title: "Check Your Email",
                  desc: "Look for an email with the subject 'Reset Your Password'",
                  icon: (
                    <li>
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </li>
                  )
                },
                {
                  title: "Check Spam Folder",
                  desc: "If you don't see the email in your inbox, check your spam folder",
                  icon: (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: "Limited Time Offer",
                  desc: "The reset link will expire after 24 hours",
                  icon: (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: "Still Can't Access?",
                  desc: "Contact our support team for further assistance",
                  icon: (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M12 12h.01M12 15h.01M12 18h.01M12 21h.01" />
                    </svg>
                  )
                }
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="bg-white/10 rounded-lg p-3 mr-4">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-white/80">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-12 pt-6 border-t border-white/20">
              <p className="text-white/90">
                Remember your password? <Link href="/auth/login" className="underline hover:text-white">Sign in here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}