import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const AuctionDetails = () => {
  const { id } = useParams(); // Get the auction ID from the URL
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auctions/${id}`);
        if (!response.ok) {
          throw new Error('Auction not found');
        }
        const data = await response.json();
        setAuction(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionDetails();
  }, [id]); // Re-run the effect if the ID changes

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Loading auction details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="mt-4 p-4 bg-red-100 text-red-700 border border-red-200 rounded">{error}</p>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">No auction data available.</p>
      </div>
    );
  }

  // Helper to format dates for better readability
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Gallery */}
          <div className="p-4">
            {auction.images && auction.images.length > 0 ? (
              <img
                src={auction.images[0].url}
                alt={auction.title}
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full h-80 bg-gray-200 flex items-center justify-center rounded-lg">
                <p className="text-gray-500">No Image Available</p>
              </div>
            )}
            {/* TODO: Add thumbnail support for multiple images */}
          </div>

          {/* Auction Details & Bidding */}
          <div className="p-6 md:p-8 flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">{auction.title}</h1>
            <p className="text-gray-600 mb-6">{auction.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6 text-center">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 font-medium">Starting Price</p>
                <p className="text-2xl font-bold text-gray-800">${auction.startingPrice.toFixed(2)}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-600 font-medium">Current Bid</p>
                <p className="text-2xl font-bold text-green-700">${auction.currentPrice.toFixed(2)}</p>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-4 mb-6 space-y-2">
              <p className="text-gray-700"><span className="font-semibold">Auction Starts:</span> {formatDate(auction.startTime)}</p>
              <p className="text-red-700"><span className="font-semibold">Auction Ends:</span> {formatDate(auction.endTime)}</p>
              <p className="text-indigo-700"><span className="font-semibold">Status:</span> <span className="capitalize font-medium">{auction.status}</span></p>
            </div>

            {/* Bidding form will go here */}
            <div className="mt-auto">
              <h3 className="text-lg font-semibold mb-2">Place Your Bid</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder={`> $${auction.currentPrice.toFixed(2)}`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md"
                />
                <button
                  className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-indigo-700"
                >
                  Place Bid
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;