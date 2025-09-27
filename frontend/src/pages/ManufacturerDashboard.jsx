import { useState, useEffect } from 'react';
import api from '../api';

function ManufacturerDashboard() {
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVerifiedHarvests = async () => {
      try {
        setLoading(true);
        // This endpoint returns all harvests with 'Verified' status
        const res = await api.get('/harvests/verified');
        setHarvests(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch verified harvests.');
      } finally {
        setLoading(false);
      }
    };

    fetchVerifiedHarvests();
  }, []);

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Harvest Marketplace</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Browse all harvests that have been verified and are ready for sourcing.</p>
        </div>

        {loading && <p className="text-gray-600 dark:text-gray-400">Loading available harvests...</p>}
        {error && <div className="p-3 text-center text-red-800 ...">{error}</div>}

        {/* Responsive grid for the harvest cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {harvests.length > 0 ? (
              harvests.map((harvest) => <HarvestCard key={harvest._id} harvest={harvest} />)
            ) : (
              <p className="text-gray-600 dark:text-gray-400 col-span-full">No verified harvests are available at the moment.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// A dedicated component for each card to keep the code clean
const HarvestCard = ({ harvest }) => (
  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-5 flex flex-col">
    <div className="flex-grow">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{harvest.herb.commonName}</h3>
        <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-500/20 text-green-300">
          {harvest.status}
        </span>
      </div>
      <p className="text-lg font-semibold text-green-600 dark:text-green-400 mt-1">{harvest.herb.quantityKg} Kg</p>
      <div className="mt-4 border-t dark:border-gray-700 pt-3 text-sm space-y-2 text-gray-700 dark:text-gray-300">
        <p><span className="font-semibold">Farmer:</span> {harvest.farmer.name}</p>
        <p><span className="font-semibold">Location:</span> {harvest.location.village}, {harvest.location.state}</p>
        <p><span className="font-semibold">Harvested:</span> {new Date(harvest.harvest.date).toLocaleDateString()}</p>
      </div>
    </div>
    <button className="w-full mt-4 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
      View Details
    </button>
  </div>
);

export default ManufacturerDashboard;