import { Outlet } from 'react-router-dom';
import Navbar from './navbar.jsx';
import { useAuth } from '../../Hooks/authContext.jsx'; // הוספנו את הקונטקסט
import '../../style/mainLayout.css';

export default function MainLayout() {
  const { user } = useAuth(); // שולפים את המשתמש

  return (
    <div className="app-layout">
      {/* הנאב-בר ירונדר אך ורק אם user קיים (כלומר, מישהו מחובר) */}
      {user && <Navbar />}
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}