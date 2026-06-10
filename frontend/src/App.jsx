import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Hooks/authContext.jsx';
import LoginPage from './pages/common/login.jsx';
import RegisterPage from './pages/common/register.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import MainLayout from './components/client/mainLayout.jsx'; 
import FlightSearchPage from './pages/common/FlightSearchPage.jsx';
import MyBookingsPage from './pages/customer/bookings/MyBookingsPage.jsx';
import BookingDetailsPage from './pages/customer/Bookings/BookingDetailsPage.jsx';
import BookingProcessPage from './pages/customer/Bookings/BookingProcessPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import DestinationPage from './pages/customer/DestinationPage.jsx';
import './App.css';


function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Auth pages - Rendered directly WITHOUT the Navbar or MainLayout wrapper */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Layout wrapper route - Contains Navbar and Outlet */}
        <Route element={<MainLayout />}>
          {/* All routes inside here will automatically render the Navbar when a user is logged in */}
          <Route path="/" element={<FlightSearchPage />} />
          <Route path="/destinations" element={<DestinationPage />} />
          <Route path="/book"
            element={<ProtectedRoute element={<BookingProcessPage />} />}
          />
          
          {/* ראוטים ייעודיים עבור אזור ההזמנות האישי של הלקוח */}
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/my-bookings/:bookingId" element={<BookingDetailsPage />} />
          
          <Route 
            path="/admin/dashboard" 
            element={<ProtectedRoute element={<AdminDashboardPage />} requiredRole="admin" />} 
          />
        </Route>

        {/* Any undefined route redirects back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
// function App() {
//   return (
//     <AuthProvider>
//       <Routes>
//         {/* Auth pages - Rendered directly WITHOUT the Navbar or MainLayout wrapper */}
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />

//         {/* Layout wrapper route - Contains Navbar and Outlet */}
//         <Route element={<MainLayout />}>
//           {/* ראוטים ציבוריים - כולם יכולים לראות, גם מי שלא מחובר */}
//           <Route path="/" element={<FlightSearchPage />} />
//           <Route path="/destinations" element={<DestinationPage />} />
          
//           {/* ----------------- כאן השינוי עבור הלקוח ----------------- */}
//           {/* שער הגנה ללקוח: כל מה שנכנס בפנים דורש התחברות אוטומטית */}
//           <Route element={<ProtectedRoute element={<Outlet />} />}>
//             <Route path="/book" element={<BookingProcessPage />} />
//             <Route path="/my-bookings" element={<MyBookingsPage />} />
//             <Route path="/my-bookings/:bookingId" element={<BookingDetailsPage />} />
//           </Route>
//           {/* -------------------------------------------------------- */}
          
//           {/* ראוט אדמין מוגן */}
//           <Route 
//             path="/admin/dashboard" 
//             element={<ProtectedRoute element={<AdminDashboardPage />} requiredRole="admin" />} 
//           />
//         </Route>

//         {/* Any undefined route redirects back to home */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </AuthProvider>
//   );
// }