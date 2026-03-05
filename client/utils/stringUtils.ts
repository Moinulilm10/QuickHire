/**
 * Extracts the first letters of up to the first two words in a string.
 * It ignores special characters or isolated symbols like "&" and "-".
 *
 * @param title The string (e.g., job title or company name) to get initials from.
 * @returns A string of up to 2 uppercase initials.
 */
export function getInitials(title: string | undefined | null): string {
  if (!title) return "C"; // Fallback character

  // Split the string by spaces, removing empty strings
  const words = title.trim().split(/\s+/);

  const initials: string[] = [];

  for (const word of words) {
    // Check if the word is fully symbols (like "&", "-", or "+")
    // If it is, we skip this word and move to the next.
    if (/^[^\w]+$/.test(word)) {
      continue;
    }

    // Get the first alphanumeric character of the word
    const firstCharMatch = word.match(/[a-zA-Z0-9]/);
    if (firstCharMatch) {
      initials.push(firstCharMatch[0].toUpperCase());
    }

    if (initials.length === 2) {
      break;
    }
  }

  // If after skipping we didn't find anything alphanumeric, fallback.
  if (initials.length === 0) {
    return title.charAt(0).toUpperCase();
  }

  return initials.join("");
}
