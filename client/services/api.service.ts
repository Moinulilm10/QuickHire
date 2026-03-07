const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api";

interface ApiOptions extends RequestInit {
  requireAuth?: boolean;
}

const handleResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  let data;
  if (isJson) {
    data = await response.json().catch(() => null);
  }

  if (!response.ok) {
    let errorMsg = (data && data.message) || response.statusText;

    if (!isJson) {
      const text = await response.text();
      console.error(
        `API Error (${response.status}): Expected JSON but got ${contentType}. Response starts with: ${text.substring(0, 100)}`,
      );
      errorMsg = `Server error: ${response.status}`;
    }

    return Promise.reject({ status: response.status, message: errorMsg });
  }

  if (!isJson && response.status !== 204) {
    const text = await response.text();
    console.warn(
      `API Warning: Expected JSON but got ${contentType}. Response starts with: ${text.substring(0, 100)}`,
    );
  }

  return data || {};
};

export const apiService = {
  get: async (endpoint: string, options: ApiOptions = {}) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (options.requireAuth) {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
    return handleResponse(response);
  },

  post: async (endpoint: string, body: any, options: ApiOptions = {}) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (options.requireAuth) {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  put: async (endpoint: string, body: any, options: ApiOptions = {}) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (options.requireAuth) {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  delete: async (endpoint: string, options: ApiOptions = {}) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (options.requireAuth) {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method: "DELETE",
      headers,
    });
    return handleResponse(response);
  },
};
