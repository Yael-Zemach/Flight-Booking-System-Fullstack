import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../Hooks/authContext.jsx';
import { UI_MESSAGES } from '../../constants/messages.js';
import '../../style/LoginAndRegister.css';
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
    if (!email.trim() || !password) {
      setError(UI_MESSAGES.validation.fillAllFields);
      return;
    }
    setLoading(true);

    const result = await login(email.trim().toLowerCase(), password);

    if (result.ok) {
      if (result.userType === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } else {
      setError(result.msg);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-card"></div>
        <h2>{UI_MESSAGES.auth.loginTitle}</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              type="email"
              placeholder={UI_MESSAGES.auth.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder={UI_MESSAGES.auth.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? UI_MESSAGES.auth.signingInButton : UI_MESSAGES.auth.signInButton}
          </button>

          {error && <p className="error-msg">{error}</p>}
        </form>

        <p className="auth-switch-text">
          {UI_MESSAGES.auth.noAccountText} <Link to="/register">{UI_MESSAGES.auth.signUpLink}</Link>
        </p>
      </div>
    </div>
  );
}