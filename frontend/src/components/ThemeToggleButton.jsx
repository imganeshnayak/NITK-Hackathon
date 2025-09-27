import { useState, useEffect } from 'react';

function ThemeToggleButton() {
  // 1. State to hold the current theme
  // We check localStorage and the user's OS preference
  const [theme, setTheme] = useState(() => {
    if (localStorage.theme === 'dark') {
      return 'dark';
    }
    if (localStorage.theme === 'light') {
      return 'light';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // 2. Effect to apply the theme class to the <html> element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [theme]);

  // 3. The function to toggle the theme
  const handleThemeSwitch = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button onClick={handleThemeSwitch} className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500">
      {theme === 'dark' ? (
        // Sun Icon for Light Mode
        <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
      ) : (
        // Moon Icon for Dark Mode
        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
      )}
    </button>
  );
}

export default ThemeToggleButton;