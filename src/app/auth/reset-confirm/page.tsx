"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import supabase from "@/lib/supabase";
import { validatePassword } from "@/utils/validation";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ResetConfirm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Extract hash parameters and check for a valid session
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    
    const checkResetToken = async () => {
      // If we have tokens in hash, set them
      if (accessToken) {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: hashParams.get('refresh_token') || '',
        });
      }
      
      // Verify we have a valid session either way
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        console.error("No valid session for password reset:", error);
        setError("Invalid or expired password reset link. Please request a new one.");
      }
    };
    
    checkResetToken();
  }, [router]);

  const handleResetConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Validate password
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    // Use password validation utility if available
    if (typeof validatePassword === 'function') {
      const passwordError = validatePassword(password);
      if (passwordError) {
        setError(passwordError);
        setLoading(false);
        return;
      }
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;
      
      setMessage("Password updated successfully! Redirecting to login...");
      setTimeout(() => router.push("/auth/login"), 3000);
    } catch (err: unknown) {
      console.error("Password reset error:", err);
      setError(err instanceof Error ? err.message : "Error resetting password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />

      <div className="flex min-h-screen">
        {/* Left Panel - Password Reset Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Set New Password</h1>
              <p className="mt-2 text-gray-600">
                Choose a strong password for your account
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

            <form onSubmit={handleResetConfirm} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  placeholder="Enter new password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itg-red focus:border-transparent transition-shadow"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters long with a mix of letters and numbers
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  placeholder="Confirm new password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itg-red focus:border-transparent transition-shadow"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-itg-red text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                disabled={loading || !password || !confirmPassword}
              >
                {loading ? <LoadingSpinner size="small" /> : "Update Password"}
              </button>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-600 hover:text-itg-red transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Panel - Password Tips */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-itg-red to-red-700 p-12 items-center justify-center">
          <div className="max-w-md text-white">
            <h2 className="text-3xl font-bold mb-6">Password Tips</h2>
            <ul className="space-y-4">
              {[
                "Use a mix of letters, numbers, and symbols",
                "Make it at least 8 characters long",
                "Avoid using personal information",
                "Don't reuse passwords from other accounts"
              ].map((tip, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-white/90">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}