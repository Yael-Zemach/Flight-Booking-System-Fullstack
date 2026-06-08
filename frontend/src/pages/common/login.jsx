import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../Hooks/authContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true); // חוסם את הכפתור ללחיצות כפולות

    // קריאה לקונטקסט - הוא כבר מטפל בשגיאות רשת ומחזיר אובייקט מסודר
    const result = await login(email.trim().toLowerCase(), password);
    
    if (result.ok) {
      // ניווט מבוסס תפקיד (Role-Based) עם החלפת הדף בהיסטוריה כדי למנוע חזרה לאחור
      if (result.userType === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } else {
      // השרת או הקונטקסט החזירו שגיאה מוגדרת - מציגים אותה למשתמש
      setError(result.msg);
      setLoading(false); // משחרר את הכפתור רק במקרה של כישלון
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-card"></div>
        <h2>כניסה למערכת</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? "signing in..." : "sign in"}
          </button>
          
          {error && <p className="error-msg">{error}</p>}
        </form>

        <p className="auth-switch-text">
           Don't have an account? <Link to="/register">sign up here</Link>
        </p>
      </div>
    </div>
  );
}