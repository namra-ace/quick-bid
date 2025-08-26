import { Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateAuction from './pages/CreateAuction';

import './index.css';

// A placeholder Home component for now
const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <h1 className="text-4xl text-indigo-700 font-bold mb-4">Welcome to QuickBid!</h1>
    <p className="text-xl text-gray-600 mb-6">The auction has not started yet.</p>
    <Link to="/auctions/create" className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-indigo-700 transition duration-300">
        Create an Auction
    </Link>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} /> 
      <Route path="/auctions/create" element={<CreateAuction />} />
    </Routes>
  );
}

export default App;