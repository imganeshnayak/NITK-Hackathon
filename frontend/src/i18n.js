import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          // English translations
          "welcome": "Welcome Back",
          "signInTitle": "Sign in to access your dashboard.",
          "emailLabel": "Email Address",
          "passwordLabel": "Password",
          "signInButton": "Sign In",
          "orContinueWith": "Or continue with",
          "noAccount": "Don't have an account?",
          "signUp": "Sign Up",
          "createAccount": "Create an Account",
          "createAccountTitle": "Join the future of transparent supply chains.",
          "nameLabel": "Full Name",
          "roleLabel": "I am a",
          "farmer": "Farmer",
          "admin": "Admin",
          "signUpButton": "Create Account",
          "haveAccount": "Already have an account?",
          "signIn": "Sign In"
        }
      },
      hi: {
        translation: {
          // Hindi translations
          "welcome": "वापसी पर स्वागत है",
          "signInTitle": "अपने डैशबोर्ड तक पहुंचने के लिए साइन इन करें।",
          "emailLabel": "ईमेल पता",
          "passwordLabel": "पासवर्ड",
          "signInButton": "साइन इन करें",
          "orContinueWith": "या इसके साथ जारी रखें",
          "noAccount": "खाता नहीं है?",
          "signUp": "साइन अप करें",
          "createAccount": "खाता बनाएं",
          "createAccountTitle": "पारदर्शी आपूर्ति श्रृंखलाओं के भविष्य में शामिल हों।",
          "nameLabel": "पूरा नाम",
          "roleLabel": "मैं एक हूँ",
          "farmer": "किसान",
          "admin": "व्यवस्थापक",
          "signUpButton": "खाता बनाएं",
          "haveAccount": "पहले से ही एक खाता है?",
          "signIn": "साइन इन करें"
        }
      },
      kn: {
        translation: {
          "welcome": "ಮರಳಿ ಸ್ವಾಗತ",
          "signInTitle": "ನಿಮ್ಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಪ್ರವೇಶಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ.",
          "emailLabel": "ಇಮೇಲ್ ವಿಳಾಸ",
          "passwordLabel": "ಪಾಸ್ವರ್ಡ್",
          "signInButton": "ಸೈನ್ ಇನ್ ಮಾಡಿ",
          "noAccount": "ಖಾತೆ ಇಲ್ಲವೇ?",
          "signUp": "ಸೈನ್ ಅಪ್ ಮಾಡಿ",
          "createAccount": "ಖಾತೆ ತೆರೆಯಿರಿ",
          "createAccountTitle": "ಪಾರದರ್ಶಕ ಪೂರೈಕೆ ಸರಪಳಿಗಳ ಭವಿಷ್ಯಕ್ಕೆ ಸೇರಿ.",
          "nameLabel": "ಪೂರ್ಣ ಹೆಸರು",
          "farmer": "ರೈತ",
          "admin": "ನಿರ್ವಾಹಕ",
          "signUpButton": "ಖಾತೆ ತೆರೆಯಿರಿ",
          "haveAccount": "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?",
          "signIn": "ಸೈನ್ ಇನ್ ಮಾಡಿ"
        }
      },
      // Add the new Malayalam translations
      ml: {
        translation: {
          "welcome": "വീണ്ടും സ്വാഗതം",
          "signInTitle": "നിങ്ങളുടെ ഡാഷ്‌ബോർഡ് ആക്‌സസ് ചെയ്യാൻ സൈൻ ഇൻ ചെയ്യുക.",
          "emailLabel": "ഇമെയിൽ വിലാസം",
          "passwordLabel": "പാസ്‌വേഡ്",
          "signInButton": "സൈൻ ഇൻ ചെയ്യുക",
          "noAccount": "അക്കൗണ്ട് ഇല്ലേ?",
          "signUp": "സൈൻ അപ്പ് ചെയ്യുക",
          "createAccount": "അക്കൗണ്ട് ഉണ്ടാക്കുക",
          "createAccountTitle": "സുതാര്യമായ വിതരണ ശൃംഖലകളുടെ ഭാവിയിൽ ചേരുക.",
          "nameLabel": "മുഴുവൻ പേര്",
          "farmer": "കർഷകൻ",
          "admin": "അഡ്മിൻ",
          "signUpButton": "അക്കൗണ്ട് ഉണ്ടാക്കുക",
          "haveAccount": "ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ?",
          "signIn": "സൈൻ ഇൻ ചെയ്യുക"
        }
      }
    },
    lng: "en", // Default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;