import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [pendingRegister, setPendingRegister] = useState(null);

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // clear field-level error on change
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setFieldErrors({});

    // client-side validation
    const errors = {};
    if (!formData.email) {
      errors.email = 'Email is required';
    } else {
      // simplified email regex
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
      if (!emailRe.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      await performLogin({ email: formData.email, password: formData.password });
    } finally {
      setLoading(false);
    }
  };

  // Reusable login fetch logic so other flows (like using pendingSignup) can call it
  const performLogin = async ({ email, password }) => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }
      localStorage.setItem('user', JSON.stringify(data.user));
      // If login succeeds and there was a pending registration, clear it
      try {
        const raw = localStorage.getItem('pendingRegister') || localStorage.getItem('pendingSignup');
        if (raw) {
          localStorage.removeItem('pendingRegister');
          localStorage.removeItem('pendingSignup');
        }
      } catch {
        // ignore
      }
      navigate('/');
    } catch (err) {
      const msg = /invalid|failed|password|credentials/i.test(err.message)
        ? 'Invalid email or password'
        : err.message;
      setError(msg);
      throw err;
    }
  };

  // Load pending registration from localStorage if present (migrate old key if needed)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('pendingRegister') || localStorage.getItem('pendingSignup');
      if (raw) setPendingRegister(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const usePendingSignup = async () => {
    if (!pendingRegister) return;
    setFieldErrors({});
    setError('Attempting login with locally saved registration credentials...');
    try {
      await performLogin({ email: pendingRegister.email || '', password: pendingRegister.password || '' });
    } catch {
      // performLogin will set the error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Login to Memeder</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
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
            {fieldErrors.email && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div className="mb-6 relative">
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
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-9 text-gray-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁'}
            </button>
            {fieldErrors.password && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <div className="text-right mb-4">
            <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {pendingRegister && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">A registration attempt was saved locally (offline). You can use those credentials to login:</p>
            <p className="text-xs text-gray-600 mt-1">(Stored locally for convenience — storing plaintext passwords is insecure; consider discarding after use.)</p>
            <div className="mt-2 flex gap-2">
              <button onClick={usePendingSignup} className="text-sm text-blue-500 hover:underline bg-transparent border-0 p-0">Use saved registration</button>
              <button onClick={() => { localStorage.removeItem('pendingRegister'); localStorage.removeItem('pendingSignup'); setPendingRegister(null); }} className="text-sm text-red-500 hover:underline bg-transparent border-0 p-0">Discard</button>
            </div>
          </div>
        )}

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-blue-500 hover:underline bg-transparent border-0 p-0"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;