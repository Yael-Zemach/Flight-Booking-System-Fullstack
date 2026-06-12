// src/components/common/mainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import useSocketNotifications from '../../Hooks/useSocketNotifications.jsx'; // 🌟 ייבוא ההוק החדש
import '../../style/mainLayout.css';
import '../../style/AdminDashboardPage.css';

export default function MainLayout({ NavbarComponent, isAdminLayout }) {
  // 🌟 שולפים את הנתונים והפונקציות בלחיצת כפתור אחת מההוק שלנו
  const { notifications, removeNotification } = useSocketNotifications(isAdminLayout);

  return (
    <div className="app-layout">
      {/* מרנדרים את הנבבר שהועבר אלינו */}
      {NavbarComponent && <NavbarComponent />} 
      
      <main className="main-content">
        <Outlet />
      </main>

      {/* מיכל הבלונים הגלובלי של האדמין */}
      {isAdminLayout && notifications.length > 0 && (
        <div className="admin-toast-fixed-holder">
          {notifications.map(notif => (
            <div key={notif.id} className={`custom-toast-balloon ${notif.type}`}>
              <span className="toast-balloon-icon">
                {notif.type === 'success' ? '✅' : '❌'}
              </span>
              <div className="toast-balloon-text-side">
                <h5>{notif.title}</h5>
                <p>{notif.text}</p>
              </div>
              <button className="toast-balloon-x-btn" onClick={() => removeNotification(notif.id)}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}