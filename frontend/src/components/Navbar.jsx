import { Link, useNavigate } from 'react-router-dom';
import ThemeToggleButton from './ThemeToggleButton';
import LanguageSwitcher from './LanguageSwitcher';

function Navbar() {
  const navigate = useNavigate();

  // Check for the token directly from localStorage on every render.
  const token = localStorage.getItem('token');

  // Define the logout handler function.
  const handleLogout = () => {
    // Remove the token from storage.
    localStorage.removeItem('token');

    // Navigate the user back to the login page.
    navigate('/');
  };

  return (
    <nav className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            {/* SVG Icon */}
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1014.12 11.88a3 3 0 00-4.242 4.242z" /></svg>
            <span className="text-xl font-bold text-green-600 dark:text-green-400">VibeChain</span>
          </Link>

          <div className="flex items-center space-x-2 md:space-x-4">
            <LanguageSwitcher />
            <ThemeToggleButton />

            {/* --- This is the new conditional logic --- */}
            {token && (
              <button 
                onClick={handleLogout} 
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;