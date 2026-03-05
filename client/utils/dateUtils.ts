/**
 * Formats a date string into "MMM DD, YYYY" format (e.g., "Mar 5, 2026")
 *
 * @param dateString The date string or timestamp to format
 * @returns Formatted date string or empty string if invalid
 */
export function formatDate(
  dateString: string | Date | undefined | null,
): string {
  if (!dateString) return "";

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  } catch (error) {
    console.error("Invalid date provided to formatDate:", dateString);
    return "";
  }
}
