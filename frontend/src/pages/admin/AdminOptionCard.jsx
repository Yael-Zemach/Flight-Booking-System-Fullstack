import React from 'react';

export default function AdminOptionCard({ icon, title, description, onClick, actionText = "כניסה לאזור הניהול ←" }) {
  return (
    <div className="admin-card" onClick={onClick}>
      <div className="admin-card-icon">{icon}</div>
      <div className="admin-card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="admin-card-action">{actionText}</div>
    </div>
  );
}