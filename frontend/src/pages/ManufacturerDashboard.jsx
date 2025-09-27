import { useState, useEffect, useMemo } from 'react';
import api from '../api';

function ManufacturerDashboard() {
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHarvest, setSelectedHarvest] = useState(null);

  const manufacturerDashboardTitle = "Manufacturer Dashboard";
  const manufacturerDashboardSubtitle = "View and manage all verified harvests";
  const searchPlaceholder = "Search herbs by name...";

  useEffect(() => {
    const fetchVerifiedHarvests = async () => {
      try {
        setLoading(true);
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

  const filteredHarvests = useMemo(() => {
    if (!harvests) return [];
    return harvests.filter(h => (h.herb?.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
  }, [harvests, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">{manufacturerDashboardTitle}</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">{manufacturerDashboardSubtitle}</p>
        </div>

        <div className="mb-6 relative w-full max-w-lg mx-auto sm:mx-0">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-4 pr-10 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:border-green-500 focus:ring focus:ring-green-200 dark:focus:ring-green-700"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {loading && <p className="text-gray-600 dark:text-gray-400">Loading harvests...</p>}
        {error && <div className="p-3 text-center text-red-800 bg-red-200 dark:bg-red-500/20 dark:text-red-300 rounded-md">{error}</div>}

        {!loading && (
          filteredHarvests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHarvests.map(h => (
                <HarvestCard key={h._id} harvest={h} onDetailsClick={() => setSelectedHarvest(h)} />
              ))}
            </div>
          ) : (
            <EmptyState onClear={() => setSearchTerm('')} />
          )
        )}
      </main>

      {selectedHarvest && (
        <HarvestDetailModal harvest={selectedHarvest} onClose={() => setSelectedHarvest(null)} />
      )}
    </div>
  );
}

const HarvestCard = ({ harvest, onDetailsClick }) => (
  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-5 flex flex-col transform hover:-translate-y-1 transition-transform duration-300">
    <div className="flex-grow">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{harvest.herb?.name || 'Unknown Herb'}</h3>
        <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-500/20 text-green-700 dark:text-green-300">{harvest.status}</span>
      </div>
      <p className="text-lg font-semibold text-green-600 dark:text-green-400 mt-1">{harvest.quantity?.value} {harvest.quantity?.unit}</p>
    </div>
    <button onClick={onDetailsClick} className="w-full mt-4 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
      Details
    </button>
  </div>
);

const EmptyState = ({ onClear }) => (
  <div className="text-center py-16 px-4 col-span-full bg-white/80 dark:bg-gray-800/80 rounded-lg">
    <h3 className="mt-2 text-lg font-semibold text-gray-800 dark:text-white">No harvests found</h3>
    <button onClick={onClear} className="mt-4 py-2 px-4 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">Clear Search</button>
  </div>
);

const HarvestDetailModal = ({ harvest, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{harvest.herb?.name || 'Unknown Herb'}</h2>

        {/* Only show essential details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <p><span className="font-semibold">Farmer:</span> {harvest.farmer?.name || 'Deleted User'}</p>
          <p><span className="font-semibold">Quantity:</span> {harvest.quantity?.value} {harvest.quantity?.unit}</p>
          <p><span className="font-semibold">Status:</span> {harvest.status}</p>
          <p><span className="font-semibold">Harvest Date:</span> {new Date(harvest.harvestDate).toLocaleDateString()}</p>
          <p><span className="font-semibold">Location:</span> {harvest.location?.description}</p>
        </div>

        <button onClick={onClose} className="mt-6 w-full py-2 font-semibold text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition-colors">
          Close
        </button>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
