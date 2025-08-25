import { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setMessage('Login successful!');
      console.log('User logged in:', data);

    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden md:flex md:max-w-4xl w-full">
        {/* Left Side: Gradient Background with QuickBid Logo */}
        <div className="md:w-1/2 bg-gradient-to-br from-indigo-700 to-purple-800 text-white p-10 flex flex-col justify-center items-center">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold tracking-tight mb-4">QuickBid</h1>
            <p className="text-lg font-light opacity-80">Your ultimate destination for online auctions.</p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Welcome Back</h2>
          <form onSubmit={handleSubmit}>
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
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-600 font-medium mb-1">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-indigo-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Log In
            </button>
          </form>
          {message && <p className="mt-4 p-3 bg-green-100 text-green-700 border border-green-200 rounded">{message}</p>}
          {error && <p className="mt-4 p-3 bg-red-100 text-red-700 border border-red-200 rounded">{error}</p>}
          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-200">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;