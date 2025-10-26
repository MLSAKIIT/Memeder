import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPasswordReq, setShowPasswordReq] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.errors?.map(err => err.message).join(', ') || data.message || 'Signup failed';
        throw new Error(msg);
      }
      login(data.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-4 text-white">Sign Up for Memeder</h2>
        {error && <div className="bg-red-900/20 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <div className="mt-1 text-xs text-gray-400">3-20 characters, letters, numbers, underscores</div>
              <Button type="button" className="mt-3 w-full" onClick={() => setStep(2)}>Next</Button>
            </div>
          )}

          {step === 2 && (
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <div className="flex justify-between mt-3">
                <Button type="button" onClick={() => setStep(1)}>Back</Button>
                <Button type="button" onClick={() => setStep(3)}>Next</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswordReq(!showPasswordReq)}
                className="flex items-center text-xs text-blue-400 mt-2 focus:outline-none"
              >
                {showPasswordReq ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                <span className="ml-1">Password requirements</span>
              </button>
              {showPasswordReq && (
                <ul className="list-disc list-inside mt-2 text-gray-400 text-xs space-y-1 bg-gray-700 p-2 rounded-lg">
                  <li>6-100 characters long</li>
                  <li>At least one lowercase letter</li>
                  <li>At least one uppercase letter</li>
                  <li>At least one number</li>
                </ul>
              )}
              <div className="flex justify-between mt-3">
                <Button type="button" onClick={() => setStep(2)}>Back</Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Signing up...' : 'Sign Up'}
                </Button>
              </div>
            </div>
          )}
        </form>

        <p className="text-center text-gray-400 mt-4 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
