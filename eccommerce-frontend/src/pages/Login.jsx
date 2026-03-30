import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error('Login error details:', err, err.response);
      if (!err.response) {
        // This is usually a Network Error, such as CORS
        setError(`Network error: ${err.message}. (Is CORS enabled on the backend?)`);
      } else {
        // Backend returned a response with an error
        setError(err.response?.data?.message || err.response?.data?.error || `Server error: ${err.response.status}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#fafafa]">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tighter text-gray-900 mb-3">Welcome back</h1>
          <p className="text-gray-500 text-sm">Sign in to your Style J account</p>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_4px_40px_rgba(0,0,0,0.07)] border border-gray-100 p-8 space-y-5">
          {successMessage && (
            <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm font-medium border border-green-100">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f4f4f4] text-gray-900 px-4 py-3.5 rounded-xl border-none focus:ring-2 focus:ring-black outline-none transition-shadow text-sm"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#f4f4f4] text-gray-900 px-4 py-3.5 rounded-xl border-none focus:ring-2 focus:ring-black outline-none transition-shadow text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-xl font-semibold text-base hover:bg-gray-800 transition-colors disabled:bg-gray-400 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-gray-400 text-xs font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Create account button */}
          <Link
            to="/signup"
            className="block w-full text-center bg-[#f4f4f4] text-gray-800 py-4 rounded-xl font-semibold text-base hover:bg-gray-200 transition-colors"
          >
            Create new account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
