// import React from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import AdminOptionCard from '../../components/admin/AdminOptionCard.jsx'; // שימוש בקומפוננטה הקיימת שלך
// import '../../style/AdminDashboardPage.css';

// export default function AdminUserActionsDashboard() {
//   const { userId } = useParams();
//   const navigate = useNavigate();

//   // מציגים אך ורק את אופציית ניהול ההזמנות הקיימות (עריכה וביטול)
//   const userOptions = [
//     {
//       id: 'user-bookings',
//       icon: '📝',
//       title: 'ניהול, עריכה וביטול הזמנות',
//       description: 'צפייה בהזמנות הקיימות של המשתמש, ביטול טיסות למקרי חירום, ועדכון מלא של שמות ופרטי הנוסעים.',
//       path: `/admin/users-service/${userId}/bookings`
//     }
//   ];

//   return (
//     <div className="admin-dashboard-container">
//       <header className="admin-dashboard-header">
//         <h1>ניהול משתמש מספר: {userId}</h1>
//         <p className="admin-dashboard-subtitle">פעולות מורשות למקרי חירום בלבד עבור משתמש זה</p>
//         <button 
//           onClick={() => navigate('/admin/users-service')}
//           style={{ marginTop: '10px', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}
//         >
//           ↩️ חזרה לחיפוש משתמש אחר
//         </button>
//         <hr className="admin-dashboard-divider" />
//       </header>

//       <main className="admin-cards-grid">
//         {userOptions.map(option => (
//           <AdminOptionCard
//             key={option.id}
//             icon={option.icon}
//             title={option.title}
//             description={option.description}
//             onClick={() => navigate(option.path)}
//           />
//         ))}
//       </main>
//     </div>
//   );
// }