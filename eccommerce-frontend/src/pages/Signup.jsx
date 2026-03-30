import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      // After successful registration, redirect to login
      navigate('/login', { state: { message: 'Account created! Please sign in.' } });
    } catch (err) {
      console.error('Signup error:', err, err.response);
      if (!err.response) {
        setError(`Network error: ${err.message}`);
      } else {
        setError(err.response?.data?.message || err.response?.data?.error || `Server error: ${err.response.status}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#fafafa]">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tighter text-gray-900 mb-3">Create account</h1>
          <p className="text-gray-500">Join Style J and explore premium collections</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-[0_4px_40px_rgba(0,0,0,0.07)] border border-gray-100 p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">First name</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-[#f4f4f4] text-gray-900 px-4 py-3.5 rounded-xl border-none focus:ring-2 focus:ring-black outline-none transition-shadow text-sm"
                placeholder="John"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-[#f4f4f4] text-gray-900 px-4 py-3.5 rounded-xl border-none focus:ring-2 focus:ring-black outline-none transition-shadow text-sm"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#f4f4f4] text-gray-900 px-4 py-3.5 rounded-xl border-none focus:ring-2 focus:ring-black outline-none transition-shadow text-sm"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-[#f4f4f4] text-gray-900 px-4 py-3.5 rounded-xl border-none focus:ring-2 focus:ring-black outline-none transition-shadow text-sm"
              placeholder="Min. 6 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-[#f4f4f4] text-gray-900 px-4 py-3.5 rounded-xl border-none focus:ring-2 focus:ring-black outline-none transition-shadow text-sm"
              placeholder="Repeat password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-semibold text-base hover:bg-gray-800 transition-colors disabled:bg-gray-400 mt-2"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="text-center text-sm text-gray-500 pt-2">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-black hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
