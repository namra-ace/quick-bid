import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        setError('');
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (status) params.append('status', status);
        
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auctions?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch auctions');
        
        const data = await response.json();
        setAuctions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timerId = setTimeout(() => fetchAuctions(), 500);
    return () => clearTimeout(timerId);
  }, [keyword, status]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      case 'ended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Find Your Next Treasure
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Browse our collection of live and upcoming auctions.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white rounded-lg shadow">
          <input
            type="text"
            placeholder="Search for items..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="ended">Ended</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center p-10">Loading...</div>
        ) : error ? (
          <div className="text-center p-10 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {auctions.length > 0 ? (
              auctions.map((auction) => (
                <Link to={`/auctions/${auction._id}`} key={auction._id} className="group block bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
                  <div className="relative">
                    <img
                      className="w-full h-48 object-cover"
                      src={auction.images[0]?.url || 'https://via.placeholder.com/400'}
                      alt={auction.title}
                    />
                    <div className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(auction.status)}`}>
                      {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-bold text-gray-800 truncate group-hover:text-indigo-600 transition-colors duration-200">
                      {auction.title}
                    </h2>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Current Bid</p>
                      <p className="text-xl font-bold text-gray-900">
                        ₹{(auction.currentPrice || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-10">No auctions found matching your criteria.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;