import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <select 
      onChange={handleLanguageChange} 
      value={i18n.language}
       className="text-sm p-1 rounded-md border-transparent focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
    >
      <option value="en">English</option>
      <option value="hi">हिन्दी</option>
      <option value="kn">ಕನ್ನಡ</option>
      <option value="ml">മലയാളം</option>
    </select>
  );
}

export default LanguageSwitcher;