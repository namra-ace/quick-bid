import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAuction = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('startingPrice', startingPrice);
    formData.append('startTime', startTime);
    formData.append('endTime', endTime);
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      // Assuming a token is stored in localStorage after login
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to create an auction.');
        return;
      }
      
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auctions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create auction');
      }

      setMessage('Auction created successfully!');
      setTimeout(() => {
        navigate(`/auctions/${data._id}`); 
      }, 2000);

    } catch (err) {
      setError(err.message);
      console.error('Error creating auction:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full md:max-w-4xl p-6 sm:p-8 md:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-4 md:mb-6">Create New Auction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-gray-600 font-medium mb-1">Title</label>
            <input
              id="title"
              type="text"
              placeholder="Enter auction title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-600 font-medium mb-1">Description</label>
            <textarea
              id="description"
              placeholder="Enter auction description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              rows="4"
            />
          </div>
          <div>
            <label htmlFor="startingPrice" className="block text-gray-600 font-medium mb-1">Starting Price</label>
            <input
              id="startingPrice"
              type="number"
              step="0.01"
              placeholder="Enter starting price"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-gray-600 font-medium mb-1">Start Time</label>
              <input
                id="startTime"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-gray-600 font-medium mb-1">End Time</label>
              <input
                id="endTime"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div>
            <label htmlFor="images" className="block text-gray-600 font-medium mb-1">Images (up to 5)</label>
            <input
              id="images"
              type="file"
              multiple
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-indigo-700"
          >
            Create Auction
          </button>
        </form>
        {message && <p className="mt-4 p-3 bg-green-100 text-green-700 border border-green-200 rounded">{message}</p>}
        {error && <p className="mt-4 p-3 bg-red-100 text-red-700 border border-red-200 rounded">{error}</p>}
      </div>
    </div>
  );
};

export default CreateAuction;