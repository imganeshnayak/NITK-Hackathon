import Navbar from '../components/Navbar';

// Mock data for the batches needing approval.
const pendingBatches = [
  {
    id: 'VC-95147',
    herbName: 'Tulsi',
    farmer: '0x1a2b...c3d4', // A sample wallet address
    location: 'Mudhol, Karnataka',
    date: '2025-09-27',
  },
  {
    id: 'VC-68321',
    herbName: 'Neem',
    farmer: '0x5e6f...g7h8',
    location: 'Jaipur, Rajasthan',
    date: '2025-09-26',
  },
  {
    id: 'VC-41235',
    herbName: 'Ashwagandha',
    farmer: '0x9i0j...k1l2',
    location: 'Nashik, Maharashtra',
    date: '2025-09-25',
  },
];

function AdminDashboard() {

  const handleApprove = (batchId) => {
    // This function will eventually call the API to approve a batch
    alert(`Batch ${batchId} has been approved!`);
  };

  const handleReject = (batchId) => {
    // This function will call the API to reject a batch
    alert(`Batch ${batchId} has been rejected.`);
  };

  return (
    <div className="min-h-screen bg-gray-900">

      <main className="max-w-7xl mx-auto py-8 px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="mt-1 text-gray-400">Review and approve new herb batch registrations.</p>
        </div>

        {/* This container holds our responsive table/card list */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg overflow-hidden">
          {/* --- DESKTOP TABLE (hidden on small screens) --- */}
          {/* The `hidden md:block` classes are the key: it's hidden by default, but becomes a 'block' on medium screens and up. */}
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800/60">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Batch ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Herb / Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Farmer Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {pendingBatches.map((batch) => (
                  <tr key={batch.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-400">{batch.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="font-semibold text-white">{batch.herbName}</div>
                      <div className="text-gray-400">{batch.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-400">{batch.farmer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button onClick={() => handleApprove(batch.id)} className="text-green-400 hover:text-green-300">Approve</button>
                      <button onClick={() => handleReject(batch.id)} className="text-red-400 hover:text-red-300">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- MOBILE CARD LIST (only shows on small screens) --- */}
          {/* The `md:hidden` class does the opposite: it's visible by default and becomes 'hidden' on medium screens and up. */}
          <div className="md:hidden p-4 space-y-4">
            {pendingBatches.map((batch) => (
              <div key={batch.id} className="bg-gray-700/50 p-4 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-white text-lg">{batch.herbName}</p>
                    <p className="text-sm text-gray-400">{batch.location}</p>
                    <p className="text-xs font-mono text-gray-500 pt-1">{batch.id}</p>
                  </div>
                </div>
                <div className="mt-4 border-t border-gray-600 pt-2">
                  <p className="text-xs text-gray-400">Farmer:</p>
                  <p className="font-mono text-xs text-gray-300 truncate">{batch.farmer}</p>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button onClick={() => handleReject(batch.id)} className="px-3 py-1 text-sm bg-red-500/20 text-red-300 rounded-md">Reject</button>
                  <button onClick={() => handleApprove(batch.id)} className="px-3 py-1 text-sm bg-green-500/20 text-green-300 rounded-md">Approve</button>
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