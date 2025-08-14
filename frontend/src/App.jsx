import { useEffect, useState } from 'react';
import api from './api/axios';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/')
      .then(res => setMessage(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>QuickBid Frontend</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

export default App;
