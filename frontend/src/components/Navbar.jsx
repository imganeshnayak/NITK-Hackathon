import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next'; // 1. Import the hook
import ThemeToggleButton from './ThemeToggleButton';
import LanguageSwitcher from './LanguageSwitcher';

function Navbar() {
  const { t } = useTranslation('navbar'); // 2. Use the 'navbar' namespace
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- Smart Link Logic (no changes here) ---
  let dashboardPath = '/'; 
    let showFarmerProfile = false;
    let showAdminProfile = false;
    let showManufacturerProfile = false;
  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.user.role === 'farmer') {
        dashboardPath = '/farmer';
        showFarmerProfile = true;
      }
      if (decoded.user.role === 'admin') {
        dashboardPath = '/admin';
        showAdminProfile = true;
      }
      if (decoded.user.role === 'manufacturer') {
        dashboardPath = '/manufacturer';
        showManufacturerProfile = true;
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem('token'); 
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to={dashboardPath} className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1014.12 11.88a3 3 0 00-4.242 4.242z" />
            </svg>
            <span className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">VibeChain</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center space-x-2 md:space-x-4">
            <LanguageSwitcher />
            <ThemeToggleButton />
            {token ? (
              <>
                {showFarmerProfile && (
                  <Link to="/farmer-profile" className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                    {t('profile')}
                  </Link>
                )}
                {showAdminProfile && (
                  <Link to="/admin-profile" className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                    {t('profile')}
                  </Link>
                )}
                {showManufacturerProfile && (
                  <Link to="/manufacturer-profile" className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                    {t('profile')}
                  </Link>
                )}
                <button onClick={handleLogout} className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  {t('logout')}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  {t('login')}
                </Link>
                <Link to="/register" className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium">
                  {t('signUp')}
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Controls */}
          <div className="sm:hidden flex items-center">
            <div className="flex items-center space-x-1 mr-1">
              <LanguageSwitcher />
              <ThemeToggleButton />
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="sm:hidden absolute top-16 left-0 w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg px-2 pt-2 pb-3 space-y-1">
          {token ? (
            <>
              {showFarmerProfile && (
                <Link to="/farmer-profile" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                  {t('profile')}
                </Link>
              )}
              {showAdminProfile && (
                <Link to="/admin-profile" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                  {t('profile')}
                </Link>
              )}
              {showManufacturerProfile && (
                <Link to="/manufacturer-profile" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                  {t('profile')}
                </Link>
              )}
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                {t('logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                {t('login')}
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white bg-green-600 hover:bg-green-700">
                {t('signUp')}
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;

