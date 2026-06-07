const API_BASE = "http://localhost:3000";

async function request(url, options = {}) {
  const token = localStorage.getItem("token"); 
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  }); 
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "API Error");
  }
  if (res.status === 204) return true;
  return res.json();
}

export const api = {
  get: (url) => request(url),
  post: (url, data) =>
    request(url, {
      method: "POST",
      body: JSON.stringify(data),
    }), 
  put: (url, data) =>
    request(url, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  patch: (url, data) =>
    request(url, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (url) =>
    request(url, {
      method: "DELETE",
    }),
};