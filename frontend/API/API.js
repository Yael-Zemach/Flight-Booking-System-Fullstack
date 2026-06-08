const API_BASE = "http://localhost:3000";

async function request(url, options = {}) {
  // 1. שליפת הטוקן בצורה מאובטחת מה-localStorage
  const token = localStorage.getItem("token"); 

  // 2. יצירת אובייקט הדרים בסיסי
  const headers = {
    "Content-Type": "application/json",
  };

  // 3. אם קיים טוקן, נדחף אותו להדרים בפורמט Bearer הסטנדרטי
  if (token) {
    // תיקון: שימוש ב-Backticks כדי ששילוב המשתנה יעבוד
    headers["Authorization"] = `Bearer ${token}`;
  }

  // מיזוג ההדרים שאנחנו יצרנו עם הדרים נוספים אם הגיעו מבחוץ בתוך options
  // תיקון: שימוש ב-Backticks עבור ה-URL
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  // תיקון: הוספת גרשיים והפיכה ל-Template Literal
 
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

  // ✨ האופציה החדשה של PATCH שביקשת ✨
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