"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';
import Header from '@/components/Header';
import { UserRole } from "@/components/types/auth";
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error) throw error;
        
        if (data?.user) {
          // Get user role
          const { data: userData, error: roleError } = await supabase
            .from("users")
            .select("role")
            .eq("id", data.user.id)
            .single();
            
          if (roleError) throw roleError;
          
          // Redirect based on role
          switch(userData?.role as UserRole) {
            case 'super_admin':
              router.push("/super-admin");
              break;
            case 'admin':
              router.push("/admin");
              break;
            default:
              router.push("/dashboard");
          }
        } else {
          setIsChecking(false);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setIsChecking(false);
      }
    };
    
    checkAuth();
  }, [router]);

  // Auth handler function
  const handleAuth = async (type: "login" | "signup") => {
    // Basic form validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    // Password length validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let authResponse;
      if (type === "login") {
        authResponse = await supabase.auth.signInWithPassword({ email, password });
      } else {
        authResponse = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });
      }

      if (authResponse.error) throw authResponse.error;
      
      // For signup, show confirmation message
      if (type === "signup" && authResponse.data?.user) {
        // Create user record
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: authResponse.data.user.id,
              email: authResponse.data.user.email,
              role: 'user',
              status: 'pending'
            }
          ]);

        if (insertError) {
          console.error("Error creating user record:", insertError);
        }
        
        alert("Please check your email to confirm your account");
        return;
      }

      // For login, check user role and redirect
      if (type === "login" && authResponse.data?.user) {
        const { data: userData, error: roleError } = await supabase
          .from("users")
          .select("role")
          .eq("id", authResponse.data.user.id)
          .single();

        if (roleError) throw roleError;
        
        switch(userData?.role as UserRole) {
          case 'super_admin':
            router.push("/super-admin");
            break;
          case 'admin':
            router.push("/admin");
            break;
          default:
            router.push("/dashboard");
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Column - Hero Content */}
            <div className="mb-12 lg:mb-0">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                <span className="block text-itg-red">Powerful Surveys.</span>
                <span className="block">Meaningful Insights.</span>
              </h1>
              <p className="mt-6 text-xl text-gray-500 max-w-3xl">
                Create professional surveys in minutes. Collect responses, analyze results, and make data-driven decisions with SurveySpan.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Link 
                  href="/auth/signup" 
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-itg-red hover:bg-red-700 transition-all transform hover:scale-105"
                >
                  Get Started
                  <svg className="ml-2 -mr-1 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link 
                  href="/auth/login" 
                  className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-base font-medium rounded-lg text-itg-red bg-white hover:bg-gray-50 hover:border-itg-red transition-all"
                >
                  Sign In
                </Link>
              </div>
              
              {/* Features Highlight */}
              <div className="mt-12 grid grid-cols-2 gap-6">
                {[
                  { title: "Easy to Use", desc: "Intuitive drag-and-drop survey builder" },
                  { title: "Powerful Analytics", desc: "Visualize responses with real-time charts" },
                  { title: "Customizable", desc: "Brand your surveys with your company's look" },
                  { title: "Secure", desc: "Enterprise-grade data protection" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-md bg-red-50 text-itg-red">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Column - Quick Access Form */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="px-8 py-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Access</h2>
                  
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center">
                      <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </div>
                  )}
                  
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-itg-red focus:border-transparent transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-itg-red focus:border-transparent transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                    
                      <button
                        onClick={() => {
                          setType('login');
                          handleAuth("login");
                        }}
                        disabled={loading}
                        className="flex-1 bg-itg-red hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-50 flex items-center justify-center"
                      >
                        {loading && type === "login" ? <LoadingSpinner size="small" /> : "Sign In"}
                      </button>
                      
                      <button
                        onClick={() => {
                          setType('signup');
                          handleAuth("signup");
                        }}
                        disabled={loading}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-50 flex items-center justify-center"
                      >
                        {loading && type === "signup" ? <LoadingSpinner size="small" /> : "Sign Up"}
                      </button>
                    <div className="text-center mt-4">
                      <Link 
                        href="/auth/reset-password" 
                        className="text-sm text-itg-red hover:text-red-700"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </div>
                  
                  {/* Security Badge */}
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Secure, encrypted connection
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="hidden lg:block absolute inset-0 -z-10">
                <div className="absolute -right-20 -top-20">
                  <div className="w-40 h-40 bg-red-100 rounded-full opacity-70"></div>
                </div>
                <div className="absolute -left-20 -bottom-10">
                  <div className="w-24 h-24 bg-red-50 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonial Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Trusted by organizations worldwide
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Join thousands of customers who rely on SurveySpan for better insights
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                quote: "SurveySpan transformed how we gather customer feedback. The insights have been invaluable for our product development.",
                name: "Sarah Johnson",
                role: "Product Manager",
                company: "TechCorp"
              },
              {
                quote: "Creating surveys used to be a painful process until we found SurveySpan. Now we can set up complex surveys in minutes.",
                name: "Michael Chen",
                role: "Research Director",
                company: "Global Research Inc."
              },
              {
                quote: "The analytics capabilities are outstanding. We can now make data-driven decisions with confidence.",
                name: "Emily Rodriguez",
                role: "Marketing Director",
                company: "InnovateCo"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote>
                    <p className="text-gray-800 mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                    <footer className="mt-4">
                      <p className="text-base font-medium text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</p>
                    </footer>
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-itg-red">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block text-white opacity-90">Start your free trial today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-itg-red bg-white hover:bg-gray-100"
              >
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-800 hover:bg-red-900"
              >
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Product</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="/features" className="text-base text-gray-300 hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="text-base text-gray-300 hover:text-white">Pricing</Link></li>
                <li><Link href="/customers" className="text-base text-gray-300 hover:text-white">Customers</Link></li>
                <li><Link href="/resources" className="text-base text-gray-300 hover:text-white">Resources</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="/about" className="text-base text-gray-300 hover:text-white">About</Link></li>
                <li><Link href="/careers" className="text-base text-gray-300 hover:text-white">Careers</Link></li>
                <li><Link href="/blog" className="text-base text-gray-300 hover:text-white">Blog</Link></li>
                <li><Link href="/contact" className="text-base text-gray-300 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="/privacy" className="text-base text-gray-300 hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="text-base text-gray-300 hover:text-white">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Connect</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="https://twitter.com/surveyspan" className="text-base text-gray-300 hover:text-white">Twitter</Link></li>
                <li><Link href="https://linkedin.com/company/surveyspan" className="text-base text-gray-300 hover:text-white">LinkedIn</Link></li>
                <li><Link href="https://facebook.com/surveyspan" className="text-base text-gray-300 hover:text-white">Facebook</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; {new Date().getFullYear()} SurveySpan. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}