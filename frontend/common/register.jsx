import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Hooks/authContext.jsx"; 


export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ name: "", email: "", password: "", verify: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // וולידציה מהירה בצד הלקוח (חוסכת פניות מיותרות לשרת)
    if (!form.name.trim() || !form.email.trim() || !form.password || !form.verify) {
      setError("please fill in all fields");
      return;
    }
    if (form.password.length < 6) {
      setError("the password must contain at least 6 characters");
      return;
    }
    if (form.password !== form.verify) {
      setError("the passwords you entered do not match");
      return;
    }

    setLoading(true);

    // שליחת הנתונים לקונטקסט
    const result = await register(form.name.trim(), form.email.trim().toLowerCase(), form.password);
    
    if (result.ok) {
      // לקוח חדש מנווט ישירות לעמוד הבית הראשי
      navigate("/", { replace: true }); 
    } else {
      // מציג את השגיאה הברורה שהגיעה מהשרת (למשל: "האימייל כבר קיים במערכת")
      setError(result.msg);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-card wide"></div>
        <h2>Creating a New Account</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <input 
            name="name" 
            type="text"
            value={form.name} 
            onChange={onChange} 
            placeholder="Full Name" 
            required 
          />
          <input 
            name="email" 
            type="email" 
            value={form.email} 
            onChange={onChange} 
            placeholder="Email Address" 
            required 
          />
          <input 
            name="password" 
            type="password" 
            value={form.password} 
            onChange={onChange} 
            placeholder="Password (at least 6 characters)" 
            required 
          />
          <input 
            name="verify" 
            type="password" 
            value={form.verify} 
            onChange={onChange} 
            placeholder="Verify Password" 
            required 
          />

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? "Creating Account..." : "Register"}
          </button>
          
          {error && <p className="error-msg">{error}</p>}
        </form>
        
        <p className="auth-switch-text">
          already have an account? <Link to="/login">sign in here</Link>
        </p>
      </div>
    </div>
  );
}