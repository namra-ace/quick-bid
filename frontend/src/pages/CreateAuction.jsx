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
    if (e.target.files.length > 5) {
      setError('You can only upload a maximum of 5 images.');
      e.target.value = null; // Clear the file input
    } else {
      setImages(Array.from(e.target.files));
      setError('');
    }
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
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">
          Create a New Auction
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              id="title" type="text" placeholder="e.g., Antique Wooden Chair"
              value={title} onChange={(e) => setTitle(e.target.value)} required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description" placeholder="Describe the item's condition, history, etc."
              value={description} onChange={(e) => setDescription(e.target.value)} required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              rows="4"
            />
          </div>
          <div>
            <label htmlFor="startingPrice" className="block text-sm font-medium text-gray-700">Starting Price (₹)</label>
            <input
              id="startingPrice" type="number" step="0.01" placeholder="e.g., 500.00"
              value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} required min="0"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                id="startTime" type="datetime-local"
                value={startTime} onChange={(e) => setStartTime(e.target.value)} required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                id="endTime" type="datetime-local"
                value={endTime} onChange={(e) => setEndTime(e.target.value)} required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700">Images (up to 5)</label>
            <input
              id="images" type="file" multiple accept="image/png, image/jpeg"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              List Item
            </button>
          </div>
        </form>
        {message && <div className="mt-4 p-3 bg-green-100 text-green-700 border border-green-200 rounded text-sm">{message}</div>}
        {error && <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-200 rounded text-sm">{error}</div>}
      </div>
    </div>
  );
};

export default CreateAuction;
