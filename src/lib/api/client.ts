const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/v1";

class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, data: unknown) {
    super(`API Error: ${status}`);
    this.status = status;
    this.data = data;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const { useAuthStore } = require("@/lib/stores/auth-store");
  return useAuthStore.getState().accessToken;
}

function handleUnauthorized() {
  if (typeof window === "undefined") return;
  const { useAuthStore } = require("@/lib/stores/auth-store");
  useAuthStore.getState().logout();
  window.location.href = "/login";
}

function buildQuery(params?: Record<string, unknown>): string {
  if (!params) return "";
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      query.set(key, String(value));
    }
  }
  const str = query.toString();
  return str ? `?${str}` : "";
}

async function request<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    params?: Record<string, unknown>;
  } = {}
): Promise<T> {
  const { method = "GET", body, params } = options;
  const url = `${BASE_URL}${path}${buildQuery(params)}`;

  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  if (method !== "GET" && method !== "DELETE") {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    handleUnauthorized();
    throw new ApiError(401, { message: "Unauthorized" });
  }

  const data = res.headers.get("content-type")?.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    throw new ApiError(res.status, data);
  }

  return data as T;
}

const apiClient = {
  get: <T = unknown>(path: string, params?: Record<string, unknown>) =>
    request<T>(path, { params }),

  post: <T = unknown>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ?? {} }),

  patch: <T = unknown>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ?? {} }),

  put: <T = unknown>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body ?? {} }),

  delete: <T = unknown>(path: string) =>
    request<T>(path, { method: "DELETE" }),
};

export default apiClient;
export { ApiError };
