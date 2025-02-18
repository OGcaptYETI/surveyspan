import { useState, useEffect } from "react";
import supabase from "@/lib/supabase";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data, error } = await supabase.from("email_templates").select("*");

        if (error) throw error;
        setTemplates(data || []);
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Email Templates</h1>
      {loading ? (
        <p>Loading templates...</p>
      ) : templates.length > 0 ? (
        <ul className="space-y-4">
          {templates.map((template) => (
            <li key={template.id} className="border p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold">{template.name}</h2>
              <p className="text-sm text-gray-500">{template.subject}</p>
              <pre className="text-gray-700 whitespace-pre-wrap">{template.body}</pre>
            </li>
          ))}
        </ul>
      ) : (
        <p>No templates found.</p>
      )}
    </div>
  );
}
