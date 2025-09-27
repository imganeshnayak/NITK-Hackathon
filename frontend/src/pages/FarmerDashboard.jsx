import { useState, useEffect } from 'react';
import api from '../api';

function FarmerDashboard() {
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Default location changed to Manglore
  const [formData, setFormData] = useState({
    location: { geoCoordinates: '12.9141, 74.8560', village: 'Manglore', state: 'Karnataka' },
    herb: { commonName: '', botanicalName: '', partUsed: '', quantityKg: '' },
    harvest: { date: '', method: 'Cultivated' },
    initialQuality: { moisturePercent: '', grading: 'A', photoUrl: '' },
    sustainability: { organicCertified: false, fairTrade: false }
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const [section, field] = name.split('.');

    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const fetchHarvests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/harvests/myharvests');
      setHarvests(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch harvests.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchHarvests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/harvests', formData);
      fetchHarvests(); // Refresh the list
      // Optionally reset the form here
    } catch (err) {
      console.error(err);
      setError('Failed to create harvest. Please check all fields.');
    }
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Farmer Dashboard</h1>
        {error && <div className="p-3 mb-4 text-center text-sm text-red-800 bg-red-200 dark:bg-red-500/20 dark:text-red-300 rounded-md">{error}</div>}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: New Detailed Registration Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Register New Harvest</h2>
              
              {/* Herb Details Section */}
              <div className="p-4 border rounded-lg dark:border-gray-700">
                <h3 className="font-medium mb-2 text-gray-800 dark:text-white">Herb Details</h3>
                <input name="herb.commonName" value={formData.herb.commonName} onChange={handleInputChange} placeholder="Common Name (e.g., Ashwagandha)" required className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:border-green-500 focus:ring-green-500"/>
                <input name="herb.quantityKg" value={formData.herb.quantityKg} onChange={handleInputChange} type="number" placeholder="Quantity (Kg)" required className="w-full mt-2 px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:border-green-500 focus:ring-green-500"/>
              </div>

              {/* Harvest & Quality Section */}
              <div className="p-4 border rounded-lg dark:border-gray-700">
                <h3 className="font-medium mb-2 text-gray-800 dark:text-white">Harvest & Quality</h3>
                <input name="harvest.date" value={formData.harvest.date} onChange={handleInputChange} type="date" required className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:border-green-500 focus:ring-green-500"/>
                <input name="initialQuality.moisturePercent" value={formData.initialQuality.moisturePercent} onChange={handleInputChange} type="number" placeholder="Moisture %" className="w-full mt-2 px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:border-green-500 focus:ring-green-500"/>
              </div>

              {/* Sustainability Section */}
              <div className="p-4 border rounded-lg dark:border-gray-700 space-y-2">
                <h3 className="font-medium mb-2 text-gray-800 dark:text-white">Sustainability</h3>
                <label className="flex items-center text-gray-800 dark:text-white">
                  <input name="sustainability.organicCertified" checked={formData.sustainability.organicCertified} onChange={handleInputChange} type="checkbox" className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"/>
                  <span className="ml-2">Organic Certified</span>
                </label>
                <label className="flex items-center text-gray-800 dark:text-white">
                  <input name="sustainability.fairTrade" checked={formData.sustainability.fairTrade} onChange={handleInputChange} type="checkbox" className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"/>
                  <span className="ml-2">Fair Trade</span>
                </label>
              </div>

              <button type="submit" className="w-full py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">Register Harvest</button>
            </form>
          </div>

          {/* Right Column: List of Harvests */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Registered Harvests</h2>
              {loading ? (
                <p className="text-gray-600 dark:text-gray-400">Loading harvests...</p>
              ) : (
                <ul className="space-y-3">
                  {harvests.length > 0 ? harvests.map((harvest) => (
                    <HarvestItem key={harvest._id} harvest={harvest} />
                  )) : (
                    <p className="text-gray-600 dark:text-gray-400">You haven't registered any harvests yet.</p>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const HarvestItem = ({ harvest }) => {
  const getStatusColor = (status) => {
    if (status === 'Verified') return 'bg-green-500/20 text-green-300';
    if (status === 'Rejected') return 'bg-red-500/20 text-red-300';
    if (status === 'Sold') return 'bg-blue-500/20 text-blue-300';
    return 'bg-yellow-500/20 text-yellow-300'; // PendingVerification
  };

  return (
    <li className="bg-white dark:bg-gray-700/50 p-3 rounded-md flex justify-between items-center">
      <div>
        <p className="font-semibold text-gray-900 dark:text-white">{harvest.herb.commonName}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(harvest.createdAt).toLocaleDateString()}</p>
      </div>
      <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(harvest.status)}`}>
        {harvest.status}
      </span>
    </li>
  );
};

export default FarmerDashboard;