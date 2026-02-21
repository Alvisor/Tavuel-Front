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

function handleUnauthorized() {
  if (typeof window === "undefined") return;
  // Call admin-logout to clear HttpOnly cookies server-side
  fetch(`${BASE_URL}/auth/admin-logout`, {
    method: "POST",
    credentials: "include",
  }).catch(() => {});
  // Clear frontend session cookie
  document.cookie = "tavuel_session=; path=/; max-age=0";
  const { useAuthStore } = require("@/lib/stores/auth-store");
  useAuthStore.getState().logout();
  window.location.href = "/login";
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function attemptTokenRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/admin-refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        // Renew frontend session cookie
        document.cookie = "tavuel_session=1; path=/; max-age=900; SameSite=Lax";
      }
      return res.ok;
    } catch {
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
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

  if (method !== "GET" && method !== "DELETE") {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    method,
    headers,
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    // Attempt cookie-based refresh before giving up
    const refreshed = await attemptTokenRefresh();
    if (refreshed) {
      const retryRes = await fetch(url, {
        method,
        headers,
        credentials: "include",
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });

      if (retryRes.ok) {
        const data = retryRes.headers.get("content-type")?.includes("application/json")
          ? await retryRes.json()
          : await retryRes.text();
        return data as T;
      }
    }

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
