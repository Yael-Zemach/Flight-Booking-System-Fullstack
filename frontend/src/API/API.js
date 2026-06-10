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

 //double protection
 if (!res.ok) {
    let errorMessage = "API Error";
    
    try {
      const errorText = await res.text(); 
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
    } catch (readError) {
      console.error("Failed to read response body", readError);
    }

    // ==========================================
    // טיפול אוטומטי בפקיעת טוקן (ללא Promise)
    // ==========================================
    if (
        res.status === 401 || 
        errorMessage === 'הטוקן אינו תקין או שפג תוקפו' || 
        errorMessage === 'גישה נדחתה: נא להתחבר למערכת'
    ) {
        // מוחקים את כל נתוני המשתמש מהדפדפן
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        
        // מעבירים את המשתמש לעמוד התחברות
        window.location.href = "/login";
        
        // זורקים שגיאה רגילה כדי לעצור את המשך הקוד 
        throw new Error("Session expired. Logging out.");
    }
    // ==========================================

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