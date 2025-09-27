import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div>
      <Navbar />
      <main>
        {/* The Outlet is where the current page (Login, Farmer, etc.) will be rendered */}
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;