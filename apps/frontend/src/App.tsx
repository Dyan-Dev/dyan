import { useEffect, useState } from 'react';
import './App.css'

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="text-center mt-20 text-3xl font-bold animate-fade-in">
      {message || 'Loading...'}
    </div>
  );
}

export default App
