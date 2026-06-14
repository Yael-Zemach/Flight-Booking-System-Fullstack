import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminOptionCard from '../../components/admin/AdminOptionCard.jsx'
import { UI_MESSAGES } from '../../constants/messages.js';
import '../../style/AdminDashboardPage.css';

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  // 🌟 מערך האופציות של המנהל - פשוט, נקי וקל להרחבה בעתיד!
  const adminOptions = [
    {
      id: 'flights',
      icon: '🛫',
      title: UI_MESSAGES.admin.flightsTitle,
      description: UI_MESSAGES.admin.flightsDescription,
      path: '/admin/flights'
    },
    {
      id: 'users-service',
      icon: '👥',
      title: UI_MESSAGES.admin.usersTitle,
      description: UI_MESSAGES.admin.usersDescription,
      path: '/admin/users-service'
    }
  ];

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <h1>{UI_MESSAGES.admin.dashboardTitle}</h1>
        <p className="admin-dashboard-subtitle">{UI_MESSAGES.admin.dashboardSubtitle}</p>
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