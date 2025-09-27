import Navbar from '../components/Navbar';

// Mock data to simulate real batches. We'll replace this with API data later.
const recentBatches = [
  { id: 'VC-84512', herbName: 'Ashwagandha', status: 'Approved' },
  { id: 'VC-74923', herbName: 'Brahmi', status: 'Approved' },
  { id: 'VC-95147', herbName: 'Tulsi', status: 'Pending' },
];

function FarmerDashboard() {
  // Helper function to get the color for the status badge
  const getStatusColor = (status) => {
    if (status === 'Approved') return 'bg-green-500/20 text-green-300';
    if (status === 'Pending') return 'bg-yellow-500/20 text-yellow-300';
    return 'bg-gray-500/20 text-gray-300';
  };

  return (
    <div className="min-h-screen bg-gray-900">

      {/* Main content area */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Farmer Dashboard</h1>
          <p className="mt-1 text-gray-400">Register new herb batches and view your recent activity.</p>
        </div>

        {/* Grid for layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Registration Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Register New Herb Batch</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="herbName" className="block text-sm font-medium text-gray-300">Herb Name</label>
                  <input
                    type="text"
                    id="herbName"
                    className="w-full mt-1 px-3 py-2 text-gray-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Ashwagandha"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-300">Geo-Tag / Farm Location</label>
                  <input
                    type="text"
                    id="location"
                    className="w-full mt-1 px-3 py-2 text-gray-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Mudhol, Karnataka"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                >
                  Generate QR Code & Register Batch
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Recent Batches */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Batches</h2>
              <ul className="space-y-3">
                {recentBatches.map((batch) => (
                  <li key={batch.id} className="bg-gray-700/50 p-3 rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">{batch.herbName}</p>
                      <p className="text-sm text-gray-400">{batch.id}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(batch.status)}`}>
                      {batch.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default FarmerDashboard;