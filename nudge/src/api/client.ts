const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

function getToken() {
  return localStorage.getItem("nudge-token");
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    const refreshToken = localStorage.getItem("nudge-refresh");
    if (refreshToken) {
      const r = await fetch(`${BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: refreshToken }),
      });
      if (r.ok) {
        const data = await r.json();
        localStorage.setItem("nudge-token", data.accessToken);
        localStorage.setItem("nudge-refresh", data.refreshToken);
        return request<T>(path, options);
      }
    }
    localStorage.removeItem("nudge-token");
    localStorage.removeItem("nudge-refresh");
    window.location.href = "/login";
  }

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  auth: {
    register: (name: string, email: string, password: string) =>
      request<{ accessToken: string; refreshToken: string; user: { id: string; name: string; email: string } }>(
        "/auth/register",
        { method: "POST", body: JSON.stringify({ name, email, password }) }
      ),
    login: (email: string, password: string) =>
      request<{ accessToken: string; refreshToken: string; user: { id: string; name: string; email: string } }>(
        "/auth/login",
        { method: "POST", body: JSON.stringify({ email, password }) }
      ),
    me: () =>
      request<{ id: string; name: string; email: string }>("/auth/me"),
    logout: () => {
      const token = localStorage.getItem("nudge-refresh");
      localStorage.removeItem("nudge-token");
      localStorage.removeItem("nudge-refresh");
      return request("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
    },
  },

  reminders: {
    list: () => request<any[]>("/reminders"),
    create: (data: object) =>
      request<any>("/reminders", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: object) =>
      request<any>(`/reminders/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<any>(`/reminders/${id}`, { method: "DELETE" }),
    markDone: (id: string) =>
      request<any>(`/reminders/${id}/done`, { method: "POST" }),
  },

  circle: {
    list: () => request<any[]>("/circle"),
    add: (data: object) =>
      request<any>("/circle", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: object) =>
      request<any>(`/circle/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<any>(`/circle/${id}`, { method: "DELETE" }),
  },
};