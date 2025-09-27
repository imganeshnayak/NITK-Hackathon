import { Routes, Route } from 'react-router-dom';

// Import Layout and all Page Components
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FarmerDashboard from './pages/FarmerDashboard';
import FarmerProfile from './pages/FarmerProfile';
import AdminDashboard from './pages/AdminDashboard';
import ConsumerPortal from './pages/ConsumerPortal';
import ManufacturerDashboard from './pages/ManufacturerDashboard';
import HerbSelectionPage from './pages/HerbSelectionPage';
import BatchRegistrationPage from './pages/BatchRegistrationPage';

function App() {
  return (
    <div className="min-h-screen font-sans">
      <Routes>
        {/* The Layout component provides the universal Navbar for all pages */}
        <Route element={<Layout />}>
          {/* Public-facing routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes for different user roles */}
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/farmer-profile" element={<FarmerProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Route for QR Code scanning */}
          <Route path="/verify/:batchId" element={<ConsumerPortal />} />
          
          <Route path="/manufacturer" element={<ManufacturerDashboard />} /> 
          
          {/* Batch registration flow */}
          <Route path="/herb-selection" element={<HerbSelectionPage />} />
          <Route path="/batch-registration" element={<BatchRegistrationPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;