export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;

  // If it's already a full URL or DataURL
  if (path.startsWith("data:") || path.startsWith("http")) {
    return path;
  }

  // Handle relative paths. NEXT_PUBLIC_API_URL is likely http://localhost:5001/api
  // We need http://localhost:5001
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
  const baseUrl = apiUrl.replace(/\/api\/?$/, "");

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
