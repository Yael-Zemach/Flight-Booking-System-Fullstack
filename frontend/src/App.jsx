// import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
// import { AuthProvider } from './Hooks/authContext.jsx';
// import LoginPage from './pages/common/login.jsx';
// import RegisterPage from './pages/common/register.jsx';
// import ProtectedRoute from './components/common/ProtectedRoute.jsx';
// import MainLayout from './components/client/mainLayout.jsx'; 
// import FlightSearchPage from './pages/common/FlightSearchPage.jsx';
// import MyBookingsPage from './pages/customer/bookings/MyBookingsPage.jsx';
// import BookingDetailsPage from './pages/customer/Bookings/BookingDetailsPage.jsx';
// import BookingProcessPage from './pages/customer/Bookings/BookingProcessPage.jsx';
// import DestinationPage from './pages/customer/DestinationPage.jsx';

// // דפי האדמין החדשים והמעודכנים
// import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
// import AdminFlightsPage from './pages/admin/AdminFlightsPage.jsx';
// // import AdminAirportsPage from './pages/admin/AdminAirportsPage.jsx';

// import './App.css';

// function App() {
//   return (
//     <AuthProvider>
//       <Routes>
//         {/* Auth pages */}
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />

//         {/* Layout wrapper route */}
//         <Route element={<MainLayout />}>
//           {/* ראוטים ציבוריים */}
//           <Route path="/" element={<FlightSearchPage />} />
//           <Route path="/destinations" element={<DestinationPage />} />
          
//           {/* ראוטים מוגנים ללקוחות */}
//           <Route element={<ProtectedRoute element={<Outlet />} />}>
//             <Route path="/book" element={<BookingProcessPage />} />
//             <Route path="/my-bookings" element={<MyBookingsPage />} />
//             <Route path="/my-bookings/:bookingId" element={<BookingDetailsPage />} />
//           </Route>
          
//           {/* 🌟 ראוטים מוגנים לאדמין בלבד */}
//           <Route element={<ProtectedRoute element={<Outlet />} requiredRole="admin" />}>
//             <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
//             <Route path="/admin/flights" element={<AdminFlightsPage />} />
//             {/* <Route path="/admin/airports" element={<AdminAirportsPage />} /> */}
//           </Route>
//         </Route>

//         {/* Any undefined route redirects back to home */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </AuthProvider>
//   );
// }

// export default App;

import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Hooks/authContext.jsx';
import LoginPage from './pages/common/login.jsx';
import RegisterPage from './pages/common/register.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import MainLayout from './components/common/mainLayout.jsx';

// אל תשכחי לייבא את הנבברים כדי שתוכלי להעביר אותם ל-MainLayout!
import ClientNavbar from './components/client/navbar.jsx';
import AdminNavbar from './components/admin/navbarAdmin.jsx';

import FlightSearchPage from './pages/common/FlightSearchPage.jsx';
import MyBookingsPage from './pages/customer/Bookings/MyBookingsPage.jsx';
import BookingDetailsPage from './pages/customer/Bookings/BookingDetailsPage.jsx';
import BookingProcessPage from './pages/customer/Bookings/BookingProcessPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import DestinationPage from './pages/customer/DestinationPage.jsx';
import AdminFlightsPage from './pages/admin/AdminFlightsPage.jsx';
import AdminAirportsPage from './pages/admin/AdminAirportsPage.jsx';
import AdminUsersSearchPage from './pages/admin/AdminUsersSearchPage.jsx';
// import AdminUserActionsDashboard from './pages/admin/AdminUserActionsDashboard.jsx';
import AdminUserBookingsPage from './pages/admin/AdminUserBookingsPage.jsx';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* עמודי התחברות והרשמה - ללא נבבר בכלל */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 🔌 בלוק 1: אזור הלקוחות (מקבל את הנבבר של הלקוח) */}
        <Route element={<MainLayout NavbarComponent={ClientNavbar} />}>
          <Route path="/" element={<FlightSearchPage />} />
          <Route path="/destinations" element={<DestinationPage />} />

          {/* עמודים מוגנים נקודתית - רק ללקוחות מחוברים */}
          <Route path="/book" element={<ProtectedRoute element={<BookingProcessPage />} />} />
          <Route path="/my-bookings" element={<ProtectedRoute element={<MyBookingsPage />} />} />
          <Route path="/my-bookings/:bookingId" element={<ProtectedRoute element={<BookingDetailsPage />} />} />
        </Route>
        
<Route element={<MainLayout NavbarComponent={AdminNavbar} isAdminLayout={true} />}>
          <Route
            path="/admin/dashboard"
            element={<ProtectedRoute element={<AdminDashboardPage />} requiredRole="admin" />}
          />
          <Route
            path="/admin/flights"
            element={<ProtectedRoute element={<AdminFlightsPage />} requiredRole="admin" />}
          />
          <Route
            path="/admin/airports"
            element={<ProtectedRoute element={<AdminAirportsPage />} requiredRole="admin" />}
          />


          {/* הפלו המעודכן: חיפוש משתמש לפי מייל -> מעבר לעמוד הפעולות המוגבלות */}
          <Route
            path="/admin/users-service"
            element={<ProtectedRoute element={<AdminUsersSearchPage />} requiredRole="admin" />}
          />
          {/* <Route
            path="/admin/users-service/:userId"
            element={<ProtectedRoute element={<AdminUserActionsDashboard />} requiredRole="admin" />}
          /> */}

          {/* הראוטים הגנריים היחידים שנשארים עבור האדמין: צפייה, עריכה וביטול הזמנות קיימות */}
          <Route
            path="/admin/users-service/:userId/bookings"
            element={<ProtectedRoute element={<AdminUserBookingsPage />} requiredRole="admin" />}
          />

          <Route
            path="/admin/users-service/:userId/bookings/:bookingId"
            element={<ProtectedRoute element={<BookingDetailsPage />} requiredRole="admin" />}
          />
        </Route>
        {/* כל כתובת לא חוקית תחזיר לעמוד הבית */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;