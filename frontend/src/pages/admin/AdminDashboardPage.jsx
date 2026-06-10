import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminOptionCard from './AdminOptionCard'; // ודאי שהנתיב לקומפוננטה הגנרית החדשה נכון
import '../../style/AdminDashboardPage.css';

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  // 🌟 מערך האופציות של המנהל - פשוט, נקי וקל להרחבה בעתיד!
  const adminOptions = [
    {
      id: 'flights',
      icon: '🛫',
      title: 'ניהול טיסות',
      description: 'הוספת טיסות חדשות, עדכון זמני המראות ונחיתות, שינוי מחירי כרטיסים וניהול מלאי המושבים בזמן אמת.',
      path: '/admin/flights'
    },
    {
      id: 'users-service',
      icon: '👥',
      title: 'שירות למשתמש',
      description: 'צפייה בהזמנות של משתמשי המערכת, עדכון ידני של פרטי נוסעים, שינוי סטטוס הזמנה (אישור/ביטול) ומתן תמיכה.',
      path: '/admin/users-service'
    }
  ];

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <h1>🔐 לוח בקרה למנהל</h1>
        <p className="admin-dashboard-subtitle">שלום מנהל, בחר את אזור העבודה הרצוי כדי להתחיל בניהול המערכת.</p>
        <hr className="admin-dashboard-divider" />
      </header>

      <main className="admin-cards-grid">
        {/* 🌟 רצח בעיינים ללולאות קופי פסט - מרנדרים דינמית את הכרטיסים */}
        {adminOptions.map(option => (
          <AdminOptionCard
            key={option.id}
            icon={option.icon}
            title={option.title}
            description={option.description}
            onClick={() => navigate(option.path)}
          />
        ))}
      </main>
    </div>
  );
}