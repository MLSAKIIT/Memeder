import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // no separate success message state needed currently
  const navigate = useNavigate();

  // Redirect after successful registration with a brief message
  useEffect(() => {
    let t;
    if (success) {
      t = setTimeout(() => {
        navigate('/login');
      }, 2000); // 2s delay to show success toast
    }
    return () => clearTimeout(t);
  }, [success, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // clear field-level error when user types
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setFieldErrors({});

    // client-side validation
    const errors = {};
    if (!formData.name || formData.name.trim() === '') {
      errors.name = 'Name is required';
    }
    if (!formData.username || formData.username.trim() === '') {
      errors.username = 'Username is required';
    }
    if (!formData.email) {
      errors.email = 'Email is required';
    } else {
      // simplified email regex to avoid eslint no-useless-escape complaints
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
      if (!emailRe.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else {
      // Require at least 8 characters, including uppercase, lowercase, number and symbol
      const passRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
      if (!passRe.test(formData.password)) {
        errors.password = 'Password must be at least 8 characters and include uppercase, lowercase, a number, and a symbol';
      }
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
  const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // ADDED: Allow cookies
        body: JSON.stringify({ name: formData.name, username: formData.username, email: formData.email, password: formData.password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Store only user data (cookie handles auth)
      localStorage.setItem('user', JSON.stringify(data.user));

      // Show success state instead of immediate redirect
      setSuccess(true);
    } catch (err) {
  // If registration fails due to network (e.g., backend unreachable), store the account locally
      const isNetworkError = /failed to fetch/i.test(err.message) || err.name === 'TypeError';
      if (isNetworkError) {
        try {
          const pending = {
            name: formData.name,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            createdAt: new Date().toISOString()
          };
          // WARNING: storing passwords in localStorage is insecure. This is a convenience fallback for offline/demo use only.
          localStorage.setItem('pendingRegister', JSON.stringify(pending));
          setSuccess(true);
        } catch {
          setError('Signup failed and could not be saved locally');
        }
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // helper to test password rules for live UI
  const passwordRules = {
    length: (pw) => pw.length >= 8,
    upper: (pw) => /[A-Z]/.test(pw),
    lower: (pw) => /[a-z]/.test(pw),
    number: (pw) => /\d/.test(pw),
    symbol: (pw) => /[^A-Za-z0-9]/.test(pw)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
  <h2 className="text-3xl font-bold text-center mb-6">Register for Memeder</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          // floating toast
          <div
            className="fixed right-4 top-4 z-50 max-w-sm w-full"
            aria-live="polite"
            role="status"
          >
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border-l-4 border-green-500">
              <div className="flex items-start p-4">
                <div className="flex-shrink-0 mr-3">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-700">✓</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Registration successful, you may log in.</p>
                  <p className="text-xs text-gray-500 mt-1">You will be redirected to the login page shortly.</p>
                </div>
                <div className="ml-3 flex-shrink-0">
                  <button
                    onClick={() => navigate('/login')}
                    className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label="Close notification"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {fieldErrors.name && <p className="text-red-600 text-sm mt-1">{fieldErrors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {fieldErrors.username && <p className="text-red-600 text-sm mt-1">{fieldErrors.username}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-9 text-gray-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁'}
            </button>
            {fieldErrors.password && <p className="text-red-600 text-sm mt-1">{fieldErrors.password}</p>}
            {/* Password rules live checklist */}
            <ul className="mt-2 text-sm">
              <li className={passwordRules.length(formData.password) ? 'text-green-600' : 'text-gray-600'}>
                {passwordRules.length(formData.password) ? '✓' : '○'} At least 8 characters
              </li>
              <li className={passwordRules.upper(formData.password) ? 'text-green-600' : 'text-gray-600'}>
                {passwordRules.upper(formData.password) ? '✓' : '○'} Contains an uppercase letter
              </li>
              <li className={passwordRules.lower(formData.password) ? 'text-green-600' : 'text-gray-600'}>
                {passwordRules.lower(formData.password) ? '✓' : '○'} Contains a lowercase letter
              </li>
              <li className={passwordRules.number(formData.password) ? 'text-green-600' : 'text-gray-600'}>
                {passwordRules.number(formData.password) ? '✓' : '○'} Contains a number
              </li>
              <li className={passwordRules.symbol(formData.password) ? 'text-green-600' : 'text-gray-600'}>
                {passwordRules.symbol(formData.password) ? '✓' : '○'} Contains a symbol
              </li>
            </ul>
          </div>

          <div className="mb-6 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((s) => !s)}
              className="absolute right-3 top-9 text-gray-600"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? '🙈' : '👁'}
            </button>
            {fieldErrors.confirmPassword && <p className="text-red-600 text-sm mt-1">{fieldErrors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-blue-500 hover:underline bg-transparent border-0 p-0"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;