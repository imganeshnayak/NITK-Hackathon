import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function HerbSelectionPage() {
  const [herbs, setHerbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHerbs = async () => {
      try {
        const response = await api.get('/herbs');
        setHerbs(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching herbs:', err);
        setError('Failed to load herbs. Please try again.');
        setLoading(false);
      }
    };

    fetchHerbs();
  }, []);

  const handleSelectHerb = (herb) => {
    navigate('/batch-registration', { state: { herb } });
  };

  const handleBack = () => {
    navigate('/farmer');
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-4 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={handleBack}
            className="mr-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">Select a Herb</h1>
        </div>
        
        <p className="text-gray-400 mb-8">Choose the herb you harvested to register a new batch.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {herbs.map((herb) => (
            <div
              key={herb._id}
              className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img 
                src={herb.imageUrl} 
                alt={herb.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium text-lg text-white mb-2">{herb.name}</h3>
                <p className="text-sm text-gray-300">Ayurvedic herb with medicinal properties</p>
                <button 
                  onClick={() => handleSelectHerb(herb)}
                  className="mt-3 w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Select Herb
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HerbSelectionPage;