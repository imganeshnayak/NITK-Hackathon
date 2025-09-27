import { useState, useEffect } from 'react';
import api from '../api';

function AdminDashboard() {
  const [pendingHarvests, setPendingHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPendingHarvests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/harvests/pending');
      setPendingHarvests(res.data);
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
      // Call the backend to update the status
      await api.put(`/harvests/${id}/status`, { status });
      // For an instant UI update, remove the item from the list
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Review and approve new harvest registrations.</p>
        </div>

        {loading && <p className="text-gray-600 dark:text-gray-400">Loading pending harvests...</p>}
        {error && <div className="p-3 text-center text-red-800 ...">{error}</div>}

        <div className="bg-white/80 dark:bg-gray-800/80 ... shadow-lg overflow-hidden">
          {/* --- DESKTOP TABLE --- */}
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/60">
                <tr>
                  <th className="px-6 py-3 text-left ...">Harvest Details</th>
                  <th className="px-6 py-3 text-left ...">Farmer Details</th>
                  <th className="px-6 py-3 text-left ...">Date Submitted</th>
                  <th className="px-6 py-3 text-left ...">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {pendingHarvests.map((harvest) => (
                  <tr key={harvest._id}>
                    <td className="px-6 py-4 ...">
                      <div className="font-semibold ...">{harvest.herb.commonName}</div>
                      <div className="text-gray-500 ...">{harvest.herb.quantityKg} Kg</div>
                    </td>
                    <td className="px-6 py-4 ...">
                      <div className="font-semibold ...">{harvest.farmer.name}</div>
                      <div className="text-gray-500 ...">{harvest.farmer.email}</div>
                    </td>
                    <td className="px-6 py-4 ...">{new Date(harvest.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 ... space-x-2">
                      <button onClick={() => handleUpdateStatus(harvest._id, 'Verified')} className="text-green-500 hover:text-green-400">Approve</button>
                      <button onClick={() => handleUpdateStatus(harvest._id, 'Rejected')} className="text-red-500 hover:text-red-400">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- MOBILE CARD LIST --- */}
          <div className="md:hidden p-4 space-y-4">
            {pendingHarvests.map((harvest) => (
              <div key={harvest._id} className="bg-white dark:bg-gray-700/50 p-4 rounded-lg shadow">
                <div className="font-bold text-gray-800 dark:text-white text-lg">{harvest.herb.commonName} - {harvest.herb.quantityKg} Kg</div>
                <div className="mt-2 border-t dark:border-gray-600 pt-2 text-sm">
                  <p><span className="font-semibold">Farmer:</span> {harvest.farmer.name}</p>
                  <p className="truncate"><span className="font-semibold">Email:</span> {harvest.farmer.email}</p>
                  <p><span className="font-semibold">Date:</span> {new Date(harvest.createdAt).toLocaleString()}</p>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button onClick={() => handleUpdateStatus(harvest._id, 'Rejected')} className="px-3 py-1 ... bg-red-500/20 text-red-300 rounded-md">Reject</button>
                  <button onClick={() => handleUpdateStatus(harvest._id, 'Verified')} className="px-3 py-1 ... bg-green-500/20 text-green-300 rounded-md">Approve</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;