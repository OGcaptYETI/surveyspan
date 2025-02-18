import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
}

if (!SUPABASE_ANON_KEY) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;

/**
 * Uploads a file to Supabase Storage.
 * @param bucket - The storage bucket name.
 * @param path - The file path in the storage bucket.
 * @param file - The file as a Buffer.
 * @param options - Optional parameters (content type, cache control).
 * @returns The uploaded file data.
 */
export const uploadFile = async (
  bucket: string,
  path: string,
  file: Buffer,
  options?: { contentType?: string; cacheControl?: string }
): Promise<string> => {
  if (!bucket || !path || !file) {
    throw new Error("Missing required parameters for file upload.");
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType: options?.contentType || "application/octet-stream",
      cacheControl: options?.cacheControl || "3600",
      upsert: true,
    });

  if (error) {
    console.error("Error uploading file:", error.message);
    throw new Error("Failed to upload file.");
  }

  return data?.path || "";
};

/**
 * Retrieves the public URL of a file from Supabase Storage.
 * @param bucket - The storage bucket name.
 * @param path - The file path in the storage bucket.
 * @returns The public URL of the file.
 */
export const getPublicUrl = (bucket: string, path: string): string => {
  if (!bucket || !path) {
    throw new Error("Missing bucket or file path for public URL retrieval.");
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

/**
 * Deletes a file from Supabase Storage.
 * @param bucket - The storage bucket name.
 * @param path - The file path in the storage bucket.
 * @returns Success message or error.
 */
export const deleteFile = async (bucket: string, path: string): Promise<string> => {
  if (!bucket || !path) {
    throw new Error("Missing bucket or file path for file deletion.");
  }

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    console.error("Error deleting file:", error.message);
    throw new Error("Failed to delete file.");
  }

  return "File deleted successfully.";
};
