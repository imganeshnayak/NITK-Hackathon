import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api';

function AdminDashboard() {
  const { t } = useTranslation();
  const [pendingHarvests, setPendingHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedHarvest, setSelectedHarvest] = useState(null);

  const fetchPendingHarvests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/harvests/pending');
      setPendingHarvests(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch pending harvests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingHarvests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/harvests/${id}/status`, { status });
      setPendingHarvests(pendingHarvests.filter((harvest) => harvest._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('adminDashboardTitle')}</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">{t('adminDashboardSubtitle')}</p>
        </div>

        {loading && <p className="text-gray-600 dark:text-gray-400">Loading pending harvests...</p>}
        {error && <div className="p-3 my-4 text-center text-sm text-red-800 bg-red-200 dark:bg-red-500/20 dark:text-red-300 rounded-md">{error}</div>}
        
        {!loading && (
          <>
            {pendingHarvests.length > 0 ? (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                <div className="hidden md:block">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800/60">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('harvestDetails')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('farmerDetails')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('dateSubmitted')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {pendingHarvests.map((harvest) => (
                        <tr key={harvest._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="font-semibold text-gray-900 dark:text-white">{harvest.herbName}</div>
                            <div className="text-gray-500 dark:text-gray-400">{harvest.quantity?.value} {harvest.quantity?.unit}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="font-semibold text-gray-900 dark:text-white">{harvest.farmer?.name || 'Deleted User'}</div>
                            <div className="text-gray-500 dark:text-gray-400">{harvest.farmer?.email || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(harvest.createdAt).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                            <button onClick={() => setSelectedHarvest(harvest)} className="text-blue-500 hover:text-blue-400">{t('details')}</button>
                            <button onClick={() => handleUpdateStatus(harvest._id, 'Verified')} className="text-green-500 hover:text-green-400">{t('approve')}</button>
                            <button onClick={() => handleUpdateStatus(harvest._id, 'Rejected')} className="text-red-500 hover:text-red-400">{t('reject')}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden p-4 space-y-4">
                  {pendingHarvests.map((harvest) => (
                    <div key={harvest._id} className="bg-white dark:bg-gray-700/50 p-4 rounded-lg shadow">
                      <div className="font-bold text-gray-800 dark:text-white text-lg">{harvest.herbName} - {harvest.quantity?.value} {harvest.quantity?.unit}</div>
                      <div className="mt-2 border-t dark:border-gray-600 pt-2 text-sm">
                        <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Farmer:</span> {harvest.farmer?.name || 'Deleted User'}</p>
                        <p className="truncate text-gray-700 dark:text-gray-300"><span className="font-semibold">Email:</span> {harvest.farmer?.email || 'N/A'}</p>
                        <p className="text-gray-500 dark:text-gray-400"><span className="font-semibold">Date:</span> {new Date(harvest.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="mt-4 flex justify-end space-x-3">
                        <button onClick={() => setSelectedHarvest(harvest)} className="px-3 py-1 text-sm bg-blue-500/20 text-blue-300 rounded-md">Details</button>
                        <button onClick={() => handleUpdateStatus(harvest._id, 'Rejected')} className="px-3 py-1 text-sm bg-red-500/20 text-red-300 rounded-md">Reject</button>
                        <button onClick={() => handleUpdateStatus(harvest._id, 'Verified')} className="px-3 py-1 text-sm bg-green-500/20 text-green-300 rounded-md">Approve</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState />
            )}
          </>
        )}
      </main>
      
      {selectedHarvest && (
        <HarvestDetailModal harvest={selectedHarvest} onClose={() => setSelectedHarvest(null)} />
      )}
    </div>
  );
} 

const EmptyState = () => {
    const { t } = useTranslation();
    return (
        <div className="text-center py-16 px-4 col-span-full bg-white/80 dark:bg-gray-800/80 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h3 className="mt-2 text-lg font-semibold text-gray-800 dark:text-white">{t('noPendingHarvests')}</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">{t('noPendingHarvestsSubtitle')}</p>
        </div>
    );
};

const HarvestDetailModal = ({ harvest, onClose }) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{harvest.herbName}</h2>
          <div className="border-t dark:border-gray-700 pt-4 text-gray-700 dark:text-gray-300 space-y-2">
              <p><span className="font-semibold">Farmer:</span> {harvest.farmer?.name || 'Deleted User'} ({harvest.farmer?.email || 'N/A'})</p>
              <p><span className="font-semibold">Location:</span> {harvest.location?.description || 'N/A'}</p>
              <p><span className="font-semibold">Quantity:</span> {harvest.quantity?.value} {harvest.quantity?.unit}</p>
              <p><span className="font-semibold">Harvest Date:</span> {new Date(harvest.harvestDate).toLocaleDateString()}</p>
              <p><span className="font-semibold">Certifications:</span> {harvest.certifications?.join(', ') || 'None'}</p>
          </div>
          <button onClick={onClose} className="w-full mt-4 py-2 font-semibold text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition-colors">Close</button>
      </div>
    </div>
  );
};

export default AdminDashboard;