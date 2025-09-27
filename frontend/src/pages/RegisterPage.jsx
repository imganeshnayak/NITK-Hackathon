import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';
import api from '../api';

// --- SVG Icons for password toggle ---
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 dark:text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 dark:text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);


function RegisterPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'farmer' });
    const [otp, setOtp] = useState('');
    const [error, setError] = useState(''); // Changed back to setError from alert
    const [message, setMessage] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);

    // --- New state for password visibility ---
    const [showPassword, setShowPassword] = useState(false);

    // This logic now runs silently in the background to check password strength
    const [isPasswordStrong, setIsPasswordStrong] = useState(false);

    const { name, email, password, role } = formData;

    useEffect(() => {
        const isValid =
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /\d/.test(password) &&
            /[@$!%*?&]/.test(password);
        setIsPasswordStrong(isValid);
    }, [password]);

    const onChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

    // in RegisterPage.jsx
const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage('');

    // Check if password is strong on the frontend first
    if (!isPasswordStrong) {
        alert('Password does not meet all requirements.\n\n- At least 8 characters\n- One uppercase letter\n- One lowercase letter\n- One number\n- One special character (@$!%*?&)');
        return;
    }

    try {
        const res = await api.post('/auth/send-otp', { name, email, password, role });
        setMessage(res.data.msg);
        setIsOtpSent(true);
    } catch (err) {
        // This will now log the detailed error and show it in an alert
        console.error("API Error:", err.response); 
        alert(err.response?.data?.msg || 'An unknown error occurred.');
    }
};

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/verify-otp', { email, otp });
            localStorage.setItem('token', res.data.token);
           const decoded = jwtDecode(res.data.token);
if (decoded.user.role === 'admin') {
  navigate('/admin');
} else if (decoded.user.role === 'manufacturer') {
  navigate('/manufacturer'); 
} else {
  navigate('/farmer');
}
        } catch (err) {
            setError(err.response?.data?.msg || 'Verification failed.');
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
            <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-green-800 to-gray-900 p-12 text-white">
                <h1 className="text-5xl font-bold mb-4">VibeChain</h1>
                <p className="text-xl text-green-200">Authenticity, from farm to future.</p>
            </div>

            <div className="flex flex-col justify-center items-center p-8 overflow-y-auto">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">{t('createAccount')}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{t('createAccountTitle')}</p>

                    {error && <div className="p-3 my-4 text-center text-sm text-red-800 bg-red-200 dark:bg-red-500/20 dark:text-red-300 rounded-md">{error}</div>}
                    {message && <div className="p-3 my-4 text-center text-sm text-green-800 bg-green-200 dark:bg-green-500/20 dark:text-green-300 rounded-md">{message}</div>}

                    {!isOtpSent ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <input id="name" type="text" placeholder={t('nameLabel')} required value={name} onChange={onChange} className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:border-green-500 focus:ring-green-500"/>
                            <input id="email" type="email" placeholder={t('emailLabel')} required value={email} onChange={onChange} className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:border-green-500 focus:ring-green-500"/>
                            
                            {/* --- Password Input with Eye Icon --- */}
                            <div className="relative">
                                <input 
                                    id="password" 
                                    type={showPassword ? 'text' : 'password'} 
                                    placeholder={t('passwordLabel')} 
                                    required value={password} 
                                    onChange={onChange} 
                                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:border-green-500 focus:ring-green-500"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)} 
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            
                            <select id="role" value={role} onChange={onChange} className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:border-green-500 focus:ring-green-500">
                                 <option value="farmer">{t('farmer')}</option>
                                 <option value="manufacturer">I am a Manufacturer</option>
                                 <option value="admin">{t('admin')}</option>
                            </select>
                            <button type="submit" className="w-full py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                                Send Verification Code
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <input id="otp" type="text" placeholder="Enter 6-Digit OTP" required value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:border-green-500 focus:ring-green-500"/>
                            <button type="submit" className="w-full py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                                Verify & Create Account
                            </button>
                        </form>
                    )}

                    <div className="text-center my-6">
                        <span className="text-gray-500 dark:text-gray-400 text-sm">{t('haveAccount')}</span>
                        <Link to="/" className="font-semibold text-green-600 dark:text-green-400 hover:underline ml-1">{t('signIn')}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;