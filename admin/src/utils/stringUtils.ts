/**
 * Extracts the first letters of up to the first two words in a string.
 */
export function getInitials(title: string | undefined | null): string {
  if (!title) return "C";

  const words = title.trim().split(/\s+/);
  const initials: string[] = [];

  for (const word of words) {
    if (/^[^\w]+$/.test(word)) continue;

    const firstCharMatch = word.match(/[a-zA-Z0-9]/);
    if (firstCharMatch) {
      initials.push(firstCharMatch[0].toUpperCase());
    }

    if (initials.length === 2) break;
  }

  if (initials.length === 0) {
    return title.charAt(0).toUpperCase();
  }

  return initials.join("");
}
