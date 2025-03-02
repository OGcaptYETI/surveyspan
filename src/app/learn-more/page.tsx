"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";

const features = [
  {
    title: "Intuitive Survey Builder",
    description: "Drag-and-drop interface makes creating surveys effortless. Choose from multiple question types and customization options.",
    details: [
      "Multiple question types including multiple choice, rating scales, and open text",
      "Easy reordering and organization of questions",
      "Custom branding and themes",
      "Mobile-responsive design"
    ]
  },
  {
    title: "Advanced Analytics",
    description: "Get detailed insights with real-time analytics and visualization tools.",
    details: [
      "Real-time response tracking",
      "Custom reports and dashboards",
      "Export data in multiple formats",
      "Trend analysis and comparison tools"
    ]
  },
  {
    title: "Enterprise Security",
    description: "Industry-leading security measures to protect your data and respondents.",
    details: [
      "End-to-end encryption",
      "GDPR compliance",
      "Data backup and recovery",
      "Role-based access control"
    ]
  }
];

export default function LearnMore() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-itg-red to-red-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block px-4 py-1 bg-white/10 rounded-full text-sm font-medium mb-6">
            Trusted by 10,000+ Organizations
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text">
            Transform Your Survey Experience
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12">
            Discover how SurveySpan&apos;s enterprise-grade platform helps organizations create impactful surveys and gather meaningful insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-block bg-white text-itg-red px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl"
            >
              Start Free Trial
            </Link>
            <Link
              href="#features"
              className="inline-block bg-transparent text-white border-2 border-white/50 px-8 py-4 rounded-lg font-bold text-lg hover:border-white transition-colors"
            >
              Explore Features
            </Link>
          </div>
          <div className="relative mt-8 w-full max-w-4xl mx-auto">
            <Image
              src="/hero-platform.png"
              alt="SurveySpan Platform Overview"
              width={1200}
              height={675}
              priority
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Active Users" },
              { number: "1M+", label: "Surveys Created" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Support" }
            ].map((stat) => (
              <div key={stat.label} className="p-6 bg-white rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-itg-red mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Features */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From simple surveys to complex research projects, SurveySpan provides all the tools you need.
            </p>
          </div>
          <div className="grid gap-16">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="space-y-6">
                  <div className="inline-block px-4 py-1 bg-itg-red/10 rounded-full text-itg-red text-sm font-medium">
                    Feature {index + 1}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">{feature.title}</h2>
                  <p className="text-xl text-gray-600">{feature.description}</p>
                  <ul className="space-y-4">
                    {feature.details.map((detail) => (
                      <li key={detail} className="flex items-start bg-gray-50 p-4 rounded-lg">
                        <svg
                          className="w-6 h-6 text-itg-red flex-shrink-0 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-8 shadow-lg">
                  <Image
                    src={`/feature-${index + 1}.png`}
                    alt={feature.title}
                    width={800}
                    height={600}
                    className="rounded-lg shadow-inner"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "SurveySpan transformed how we gather customer feedback.",
                author: "Sarah Johnson",
                role: "Product Manager",
                company: "TechCorp"
              },
              {
                quote: "The analytics capabilities are game-changing for our research.",
                author: "Michael Chen",
                role: "Research Director",
                company: "DataInsights"
              },
              {
                quote: "Best survey platform we've used. Period.",
                author: "Lisa Rodriguez",
                role: "Customer Success",
                company: "GrowthCo"
              }
            ].map((testimonial) => (
              <div key={testimonial.author} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-itg-red mb-4">
                  {/* Add quote icon */}
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-gray-800 mb-4">{testimonial.quote}</p>
                <div className="border-t pt-4">
                  <p className="font-medium text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                </div>
                <div className="flex items-center mb-4">
                  <Image
                    src={`/company-${testimonial.company.toLowerCase()}.png`}
                    alt={testimonial.company}
                    width={120}
                    height={40}
                    className="opacity-75"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-br from-itg-red to-red-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Surveys?
          </h2>
          <p className="text-xl mb-12 text-white/90">
            Join thousands of organizations worldwide who trust SurveySpan for their feedback and research needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-block bg-white text-itg-red px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="inline-block bg-transparent text-white border-2 border-white/50 px-8 py-4 rounded-lg font-bold text-lg hover:border-white transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}