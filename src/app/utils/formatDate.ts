// 📂 utils/formatDate.ts
export function formatDate(dateString: string | Date): string {
  if (!dateString) {
    console.error("Invalid date input provided to formatDate.");
    return "Invalid date";
  }

  try {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;

    if (isNaN(date.getTime())) {
      console.error("Invalid date format:", dateString);
      return "Invalid date";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}