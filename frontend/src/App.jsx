import { Routes, Route, Navigate ,BrowserRouter} from 'react-router-dom';
import { AuthProvider } from './Hooks/authContext.jsx';
import LoginPage from './common/login.jsx'
import RegisterPage from './common/register.jsx';
import './App.css';


// עמודי בדיקה זמניים
const FlightSearchHome = () => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h1>✈️ ברוכים הבאים ל-FlightFinder</h1>
    <p>עמוד חיפוש טיסות ציבורי לחלוטין!</p>
  </div>
);

const AdminDashboard = () => (
  <div style={{ padding: '40px', textAlign: 'center', color: '#4f46e5' }}>
    <h1>👑 פאנל ניהול אדמין</h1>
    <p>רק מנהלים מחוברים רואים את זה.</p>
  </div>
);

function App() {
  return (
    // 2. עטפנו את הכל בתוך BrowserRouter - זה פותר את השגיאה לחלוטין!
   
      <AuthProvider>
        <Routes>
          {/* עמוד הבית הציבורי */}
          <Route path="/" element={<FlightSearchHome />} />

          {/* דפי האימות */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* עמוד המנהל המוגן */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* כל נתיב אחר זורק לעמוד הבית */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    
  );
}

export default App;