"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import supabase from "@/lib/supabase";
import Header from "@/components/Header";

interface FormData {
  name: string;
  email: string;
  company: string;
  employees: string;
  message: string;
}

export default function Contact() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    employees: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Submit to Supabase
      const { error: submissionError } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            company: formData.company,
            employees: formData.employees,
            message: formData.message,
            status: 'new'
          }
        ]);

      if (submissionError) throw submissionError;

      // Optional: Send notification email using Supabase Edge Functions
      const { error: notificationError } = await supabase.functions.invoke('notify-sales', {
        body: {
          name: formData.name,
          email: formData.email,
          company: formData.company
        }
      });

      if (notificationError) {
        console.error('Notification error:', notificationError);
        // Don't throw here, as the submission was successful
      }

      // Show success toast and redirect
      toast.success('Thank you for your interest. We will contact you soon.');
      router.push('/');
      
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit form');
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-itg-red text-white pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Let&apos;s Talk Business
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Get in touch with our sales team to learn how SurveySpan can transform your organization&apos;s feedback process.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form Card */}
          <div className="bg-white p-8 md:p-10 rounded-xl shadow-xl">
            <div className="max-w-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Contact Our Sales Team
              </h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we&apos;ll get back to you in a jiffy.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-itg-red focus:ring-itg-red"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Work Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-itg-red focus:ring-itg-red"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    id="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-itg-red focus:ring-itg-red"
                  />
                </div>

                <div>
                  <label htmlFor="employees" className="block text-sm font-medium text-gray-700">
                    Company Size
                  </label>
                  <select
                    name="employees"
                    id="employees"
                    required
                    value={formData.employees}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-itg-red focus:ring-itg-red"
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501+">501+ employees</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-itg-red focus:ring-itg-red"
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm">{error}</div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-itg-red text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Contact Sales"}
                </button>
              </form>
            </div>
          </div>

          {/* Right Side Content */}
          <div className="lg:sticky lg:top-8 space-y-8 pt-8 lg:pt-0">
            {/* Benefits Card */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Why Choose SurveySpan Enterprise?
              </h2>
              <ul className="space-y-5">
                {[
                  {
                    title: "Advanced Survey Logic",
                    description: "Create complex, branching surveys with conditional logic"
                  },
                  {
                    title: "White-Label Solutions",
                    description: "Fully customizable branding and domain options"
                  },
                  {
                    title: "Enterprise Security",
                    description: "SOC 2 Type II certified with advanced encryption"
                  },
                  {
                    title: "Dedicated Support",
                    description: "24/7 priority support with dedicated success manager"
                  },
                  {
                    title: "Advanced Analytics",
                    description: "Real-time insights with custom reporting tools"
                  },
                  {
                    title: "Global Compliance",
                    description: "GDPR, CCPA, and HIPAA compliant solutions"
                  }
                ].map((feature) => (
                  <li key={feature.title} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-itg-red flex-shrink-0 mr-4 mt-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-xl text-white shadow-lg">
              <h3 className="text-xl font-bold mb-4">
                Need Immediate Assistance?
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:sales@surveyspan.com" className="hover:text-itg-red transition-colors">
                    sales@surveyspan.com
                  </a>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm">Available Mon-Fri, 9am-5pm EST</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="mt-24 bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Trusted by Industry Leaders
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-50">
            {/* Add company logos here */}
          </div>
        </div>
      </div>
    </div>
  );
}