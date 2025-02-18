"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";
import DashboardCard from "@/components/DashboardCard";
import SearchBar from "@/components/SearchBar";

interface Survey {
  id: string;
  title: string;
  createdAt: string;
  userId: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
          router.push("/"); // Redirect to login if not authenticated
          return;
        }

        const { data: adminData } = await supabase
          .from("users")
          .select("role")
          .eq("id", userData.user.id)
          .single();

        if (!adminData || adminData.role !== "admin") {
          router.push("/dashboard"); // Redirect non-admins to user dashboard
          return;
        }

        const { data, error } = await supabase
          .from("surveys")
          .select("id, title, createdAt, userId")
          .order("createdAt", { ascending: false });

        if (error) throw error;
        setSurveys(data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load surveys.");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [router]);

  const filteredSurveys = surveys.filter((survey) =>
    survey.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Admin Survey Dashboard</h1>
      <SearchBar 
        value={search} 
        onSearch={setSearch} 
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="text-gray-500 mt-4">Loading surveys...</p>
      ) : error ? (
        <p className="text-red-500 mt-4">{error}</p>
      ) : filteredSurveys.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredSurveys.map((survey) => (
            <DashboardCard
              key={survey.id}
              title={survey.title}
              content={`Created on: ${new Date(survey.createdAt).toLocaleDateString()}`}
              footer={
                <button
                  onClick={() => router.push(`/dashboard/responses?id=${survey.id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  View Responses
                </button>
              }
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-4">No surveys found.</p>
      )}
    </div>
  );
}
