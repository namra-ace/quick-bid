import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateAuction from './pages/CreateAuction';
import AuctionDetails from './pages/AuctionDetails';
import Home from './pages/Home';
import Layout from './components/Layout';

function App() {
  return (
    <Routes>
      {/* Routes with the main layout (Navbar and Footer) */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/auctions/create" element={<CreateAuction />} />
        <Route path="/auctions/:id" element={<AuctionDetails />} />
      </Route>

      {/* Standalone routes without the main layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;