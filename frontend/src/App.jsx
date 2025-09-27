import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Import
import FarmerDashboard from './pages/FarmerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ConsumerPortal from './pages/ConsumerPortal';

function App() {
  return (
    <div className="min-h-screen font-sans">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> {/* Add this route */}
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/verify/:batchId" element={<ConsumerPortal />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;