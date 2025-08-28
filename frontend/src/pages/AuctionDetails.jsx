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
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="text-center p-10">Loading Details...</div>;
  }
  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }
  if (!auction) {
    return <div className="text-center p-10">Auction not found.</div>;
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-4">
            <img 
              src={auction.images[0]?.url || 'https://via.placeholder.com/800'} 
              alt={auction.title} 
              className="w-full h-auto object-cover rounded-lg" 
            />
          </div>
          <div className="p-6 md:p-8 flex flex-col space-y-6">
            <div>
              {auction.seller && (
                <p className="text-sm text-gray-500 mb-1">
                  Listed by: <span className="font-semibold text-gray-700">{auction.seller.name}</span>
                </p>
              )}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{auction.title}</h1>
              <p className="text-gray-600 mt-2">{auction.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500 font-medium">Starting Price</p>
                <p className="text-2xl font-bold text-gray-800">₹{(auction.startingPrice || 0).toFixed(2)}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                <p className="text-sm text-green-700 font-medium">Current Bid</p>
                <p className="text-2xl font-bold text-green-800">₹{(auction.currentPrice || 0).toFixed(2)}</p>
                {auction.highestBidder ? (
                  <p className="text-xs text-gray-500 mt-1">by {auction.highestBidder.name}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">No bids yet</p>
                )}
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-4 space-y-2">
              <p className="text-gray-700 flex justify-between">
                <span className="font-semibold">Auction Starts:</span> 
                <span>{formatDate(auction.startTime)}</span>
              </p>
              <p className="text-red-700 flex justify-between">
                <span className="font-semibold">Auction Ends:</span> 
                <span>{formatDate(auction.endTime)}</span>
              </p>
              <p className="text-indigo-700 flex justify-between">
                <span className="font-semibold">Status:</span> 
                <span className="capitalize font-medium">{auction.status}</span>
              </p>
            </div>

            <div className="mt-auto bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Place Your Bid</h3>
              <form onSubmit={handleBidSubmit}>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.01"
                    placeholder={`> ₹${(auction.currentPrice || 0).toFixed(2)}`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    required
                    min={(auction.currentPrice || 0) + 0.01}
                  />
                  <button type="submit" className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors duration-300 flex-shrink-0">
                    Bid Now
                  </button>
                </div>
              </form>
              {bidSuccess && <p className="mt-2 text-sm text-green-600">{bidSuccess}</p>}
              {bidError && <p className="mt-2 text-sm text-red-600">{bidError}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;
