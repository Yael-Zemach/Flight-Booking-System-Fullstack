import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Hooks/AuthContext.jsx';
import LoginPage from './common/login.jsx'
import RegisterPage from './common/register.jsx';
import './App.css';

// ✈️ עמוד הבית האמיתי שלך - חיפוש טיסות (פתוח לכולם!)
const FlightSearchHome = () => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h1>✈️ ברוכים הבאים ל-FlightFinder</h1>
    <p>כאן כולם יכולים לחפש טיסות באופן חופשי, גם בלי להתחבר!</p>
    <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
      <input type="text" placeholder="מאיפה?" style={{ margin: '5px', padding: '8px' }} />
      <input type="text" placeholder="לאן?" style={{ margin: '5px', padding: '8px' }} />
      <button style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>חפש</button>
    </div>
  </div>
);

// 👑 פאנל ניהול (רק לאדמין מחובר!)
const AdminDashboard = () => (
  <div style={{ padding: '40px', textAlign: 'center', color: '#4f46e5' }}>
    <h1>👑 פאנל ניהול אדמין</h1>
    <p>רק מנהלי מערכת מחוברים יכולים לראות את העמוד הזה.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* 1. עמוד ציבורי - חיפוש טיסות */}
        <Route path="/" element={<FlightSearchHome />} />

        {/* 2. דפי התחברות והרשמה */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 3. עמוד מוגן - ניהול מערכת */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* 4. רשת ביטחון: כתובת שגויה תזרוק את המשתמש לעמוד חיפוש הטיסות (לא ללוגין!) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;