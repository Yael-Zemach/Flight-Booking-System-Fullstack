import { Outlet } from 'react-router-dom';
import '../../style/mainLayout.css';

// המעטפת מקבלת את סוג הנבבר בתור פרמטר (Prop)
export default function MainLayout({ NavbarComponent }) {
  return (
    <div className="app-layout">
      {/* מרנדרים את הנבבר שהועבר אלינו */}
      {NavbarComponent && <NavbarComponent />} 
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
