// In frontend/src/App.jsx
import { Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateAuction from './pages/CreateAuction';
import AuctionDetails from './pages/AuctionDetails'; // Import the new component

// ... (Home component)

function App() {
  return (
    <Routes>
      <Route path="/" />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auctions/create" element={<CreateAuction />} />
      {/* Add this new route */}
      <Route path="/auctions/:id" element={<AuctionDetails />} />
    </Routes>
  );
}

export default App;