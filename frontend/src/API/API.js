// src/API/API.js - הגרסה הסופית, הקלה והנקייה

const API_BASE = "http://localhost:3000"; 

async function request(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {};
  const isFormData = options.body instanceof FormData;

  // 1. הגדרת סוג המידע כברירת מחדל
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // 2. הוספת טוקן האבטחה במידה וקיים
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions = {
    ...options,
    headers: { ...headers, ...options.headers },
  };

  // 3. הפיכת אובייקט לטקסט JSON באופן אוטומטי, או ניקוי עבור מולטר
  if (isFormData) {
    delete fetchOptions.headers["Content-Type"];
  } else if (options.body && typeof options.body === "object") {
    fetchOptions.body = JSON.stringify(options.body);
  }

  // 4. ביצוע בקשת הרשת בפועל
  const res = await fetch(`${API_BASE}${url}`, fetchOptions);

  // 5. טיפול בסיסי בשגיאות - אם השרת מחזיר שגיאה, זורקים אותה החוצה
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Request failed");
  }

  // 6. החזרת נתונים במידה ויש, או סיום מוצלח
  return res.status !== 204 ? await res.json() : null;
}

export const api = {
  get: (url, options) => request(url, { ...options, method: "GET" }),
  post: (url, body, options) => request(url, { ...options, method: "POST", body }),
  put: (url, body, options) => request(url, { ...options, method: "PUT", body }),
  patch: (url, body, options) => request(url, { ...options, method: "PATCH", body }),
  delete: (url, options) => request(url, { ...options, method: "DELETE" }),
};