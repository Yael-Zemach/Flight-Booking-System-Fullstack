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

 
  const fullUrl = `${API_BASE}${url}`; // תיקון: שימוש ב-Backticks
 //double protection
  if (!res.ok) {
    let errorMessage = "API Error";
    
    try {
    
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
     
      errorMessage = await res.text() || errorMessage;
    }

   
    throw new Error(errorMessage);
  }
  
  // לבדוק אם DELETE או PATCH/PUT מסוימים החזירו 204 No Content
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