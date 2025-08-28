import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom'; // Import Outlet

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* Use Outlet instead of children */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;