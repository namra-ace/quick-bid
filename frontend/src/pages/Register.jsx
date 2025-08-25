import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('bidder');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setMessage('Registration successful!');
      console.log('User registered:', data);
      
      // Redirect to homepage after successful registration
      navigate('/');

    } catch (err) {
      setError(err.message);
      console.error('Registration error:', err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-10">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full md:flex md:max-w-4xl">
        {/* Left Side: Gradient Background with QuickBid Logo */}
        <div className="md:w-1/2 bg-gradient-to-br from-indigo-700 to-purple-800 text-white p-6 md:p-10 flex flex-col justify-center items-center">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-2 md:mb-4">QuickBid</h1>
            <p className="text-sm md:text-lg font-light opacity-80">Your ultimate destination for online auctions.</p>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="md:w-1/2 p-6 sm:p-8 md:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-4 md:mb-6">Create Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-600 font-medium mb-1">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 font-medium mb-1">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-600 font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">Password must be at least 6 characters long.</p>
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-600 font-medium mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div className="mb-6">
              <span className="block text-gray-600 font-medium mb-2">I am a:</span>
              <div className="flex flex-col sm:flex-row sm:justify-around">
                <label className="inline-flex items-center mb-2 sm:mb-0">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600"
                    name="role"
                    value="bidder"
                    checked={role === 'bidder'}
                    onChange={() => setRole('bidder')}
                  />
                  <span className="ml-2 text-gray-700">Buyer (Bidder)</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600"
                    name="role"
                    value="seller"
                    checked={role === 'seller'}
                    onChange={() => setRole('seller')}
                  />
                  <span className="ml-2 text-gray-700">Seller</span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-indigo-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Sign Up
            </button>
          </form>
          {message && <p className="mt-4 p-3 bg-green-100 text-green-700 border border-green-200 rounded">{message}</p>}
          {error && <p className="mt-4 p-3 bg-red-100 text-red-700 border border-red-200 rounded">{error}</p>}
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-200">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;