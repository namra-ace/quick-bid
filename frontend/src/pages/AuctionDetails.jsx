import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const AuctionDetails = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');

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

    const socket = io(import.meta.env.VITE_BASE_URL);
    socket.emit('joinAuction', id);
    
    socket.on('newBid', (data) => {
      // The user who made the bid will have their name populated by the API call in handleBidSubmit.
      // This socket event is for everyone else watching the page.
      setAuction(prevAuction => ({
        ...prevAuction,
        // FIX: Use data.currentPrice, which is sent from the original backend code
        currentPrice: data.currentPrice, 
        // We don't have the bidder's name here, so we just update the price
        // The name will appear on the next refresh for other users
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setBidError('');
    setBidSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setBidError('You must be logged in to place a bid.');
      return;
    }

    if (Number(bidAmount) <= auction.currentPrice) {
      setBidError(`Your bid must be higher than the current price of ₹${auction.currentPrice.toFixed(2)}.`);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auctions/${id}/bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: Number(bidAmount) }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to place bid');
      }
      setBidSuccess('Bid placed successfully!');
      
      // After successfully placing a bid, refetch the data to get the populated bidder name
      const updatedAuctionResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auctions/${id}`);
      const updatedAuctionData = await updatedAuctionResponse.json();
      setAuction(updatedAuctionData);

      setBidAmount('');
    } catch (err) {
      setBidError(err.message);
    }
  };

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-4">
            {auction.images && auction.images.length > 0 ? (
              <img src={auction.images[0].url} alt={auction.title} className="w-full h-auto object-cover rounded-lg shadow-md" />
            ) : (
              <div className="w-full h-80 bg-gray-200 flex items-center justify-center rounded-lg">
                <p className="text-gray-500">No Image Available</p>
              </div>
            )}
          </div>

          <div className="p-6 md:p-8 flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">{auction.title}</h1>
            {auction.seller && (
              <p className="text-sm text-gray-500 mb-4">Sold by: <span className="font-semibold text-gray-700">{auction.seller.name}</span></p>
            )}
            <p className="text-gray-600 mb-6">{auction.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6 text-center">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 font-medium">Starting Price</p>
                <p className="text-2xl font-bold text-gray-800">₹{(auction.startingPrice || 0).toFixed(2)}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-600 font-medium">Current Bid</p>
                <p className="text-2xl font-bold text-green-700">₹{(auction.currentPrice || 0).toFixed(2)}</p>
                {auction.highestBidder ? (
                  <p className="text-xs text-gray-500 mt-1">by {auction.highestBidder.name}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">No bids yet</p>
                )}
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-4 mb-6 space-y-2">
              <p className="text-gray-700"><span className="font-semibold">Auction Starts:</span> {formatDate(auction.startTime)}</p>
              <p className="text-red-700"><span className="font-semibold">Auction Ends:</span> {formatDate(auction.endTime)}</p>
              <p className="text-indigo-700"><span className="font-semibold">Status:</span> <span className="capitalize font-medium">{auction.status}</span></p>
            </div>

            <div className="mt-auto">
              <h3 className="text-lg font-semibold mb-2">Place Your Bid</h3>
              <form onSubmit={handleBidSubmit}>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    placeholder={`> ₹${(auction.currentPrice || 0).toFixed(2)}`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    required
                    min={(auction.currentPrice || 0) + 0.01}
                  />
                  <button type="submit" className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-indigo-700">
                    Place Bid
                  </button>
                </div>
              </form>
              {bidSuccess && <p className="mt-2 text-green-600">{bidSuccess}</p>}
              {bidError && <p className="mt-2 text-red-600">{bidError}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;