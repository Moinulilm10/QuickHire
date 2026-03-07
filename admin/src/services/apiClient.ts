const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, auth = true } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(auth ? getAuthHeaders() : {}),
  };

  const config: RequestInit = {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const url = `${API_URL}${endpoint}`;
  const res = await fetch(url, config);

  if (!res.ok) {
    let errorMsg = `API Error: ${res.status} ${res.statusText}`;
    try {
      const errorData = await res.json();
      errorMsg = errorData.message || errorMsg;
    } catch (e) {
      // Not JSON
    }
    console.error(`Fetch failed for ${url}:`, errorMsg);
    throw new Error(errorMsg);
  }

  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await res.text();
    console.error(
      `Expected JSON but got ${contentType} for ${url}. Response starts with: ${text.substring(0, 100)}`,
    );
    throw new Error(`Unexpected response format from ${endpoint}`);
  }

  return res.json();
}

export { API_URL, getAuthHeaders };
