"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyUser = async () => {
      const { data: session, error } = await supabase.auth.getSession();

      if (error || !session) {
        setError("Email confirmation failed. Please try again.");
        return;
      }

      const user = session.user;
      if (!user) {
        setError("No user found.");
        return;
      }

      // Fetch user role from database
      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (userData?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    };

    verifyUser();
  }, [router]);

  if (loading) return <div>Verifying your email...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return <div>Redirecting...</div>;
}
