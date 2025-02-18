"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";
import styles from '@/styles/page.module.css';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: session } = await supabase.auth.getUser();
      if (session?.user) {
        const { data } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (data?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    };
    checkAuth();
  }, [router]);

  const handleAuth = async (type: "login" | "signup") => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let authResponse;
      if (type === "login") {
        authResponse = await supabase.auth.signInWithPassword({ email, password });
      } else {
        authResponse = await supabase.auth.signUp({ email, password });
      }

      if (authResponse.error) throw authResponse.error;

      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", authResponse.data?.user?.id)
        .single();

      router.push(userData?.role === "admin" ? "/admin" : "/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-itg-red items-center justify-center relative overflow-hidden">
        <div className="relative z-10 text-white p-12 max-w-lg">
          <h2 className="font-stainless text-4xl font-bold mb-6">
            Create Better Surveys
          </h2>
          <p className="font-stainless text-xl mb-8 text-white/90">
            Design, distribute, and analyze surveys with powerful tools and real-time insights.
          </p>
          <div className="space-y-4 font-stainless">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                </svg>
              </div>
              <span>Customizable survey templates</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                </svg>
              </div>
              <span>Real-time analytics</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd"/>
                </svg>
              </div>
              <span>Export results instantly</span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-itg-red/20 to-itg-red" />
        <div className={`absolute inset-0 bg-gradient-to-br from-itg-red/20 to-itg-red ${styles.patternBackground}`} />
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="font-stainless font-bold text-4xl text-itg-black mb-2">
              Welcome to SurveySpan
            </h1>
            <p className="font-stainless text-itg-gray">
              {mode === "login" ? "Sign in to your account" : "Create your account"}
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 font-stainless text-sm">
                {error}
              </div>
            )}

            <form onSubmit={(e) => {
              e.preventDefault();
              handleAuth(mode);
            }} className="space-y-6">
              <div>
                <label className="block font-stainless text-sm font-bold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-itg-red/20 focus:border-itg-red font-stainless"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-stainless text-sm font-bold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-itg-red/20 focus:border-itg-red font-stainless"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-itg-red text-white py-3 rounded-lg font-stainless font-bold hover:bg-itg-red/90 transition-colors disabled:opacity-50"
              >
                {loading 
                  ? mode === "login" ? "Signing in..." : "Creating account..." 
                  : mode === "login" ? "Sign In" : "Create Account"
                }
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="font-stainless text-itg-red hover:text-itg-red/80"
              >
                {mode === "login" 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}