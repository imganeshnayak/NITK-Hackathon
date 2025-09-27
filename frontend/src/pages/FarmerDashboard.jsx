import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import api from '../api';

function FarmerDashboard() {
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedHarvest, setSelectedHarvest] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchHarvests = async () => {
      try {
        const response = await api.get('/harvests/myharvests');
        setHarvests(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching harvests:', err);
        setError('Failed to load harvests. Please try again.');
        setLoading(false);
      }
    };
    fetchHarvests();
  }, []);

  const handleShowQR = (harvest) => {
    const qrHarvest = {
      ...harvest,
      qrData:
        harvest.qrCodeData ||
        JSON.stringify({
          harvestId: harvest._id,
          herbName: harvest.herbName,
          location: harvest.location?.description || 'Not specified',
          harvestDate: new Date(harvest.harvestDate).toLocaleDateString(),
          status: harvest.status,
          verifyUrl: `${window.location.origin}/verify/${harvest._id}`,
        }),
    };
    setSelectedHarvest(qrHarvest);
    setShowQR(true);
  };

  const handleViewDetails = async (harvestId) => {
    setDetailsLoading(true);
    try {
      const response = await api.get(`/harvests/${harvestId}`);
      setSelectedHarvest(response.data);
      setShowDetails(true);
    } catch (err) {
      console.error('Error fetching harvest details:', err);
      alert('Failed to load harvest details. Please try again.');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleNewBatch = () => {
    navigate('/herb-selection');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
      {/* Sidebar for desktop */}
      <div className="hidden md:block w-64 fixed h-full bg-gray-900 border-r border-gray-800 p-5">
        <h1 className="text-2xl font-bold mb-1 text-green-400">HerbChain</h1>
        <p className="text-sm text-gray-400 mb-8">Ayurvedic Traceability</p>

        <button
          onClick={handleNewBatch}
          className="flex items-center w-full p-3 bg-green-600 text-white rounded-lg mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          New Batch
        </button>

        <button className="flex items-center w-full p-3 text-gray-300 hover:bg-gray-800 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
              clipRule="evenodd"
            />
          </svg>
          My Batches
        </button>
      </div>

      {/* Mobile Top Nav */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <h1 className="text-xl font-bold text-green-400">HerbChain</h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-300 focus:outline-none"
        >
          {mobileMenuOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-b border-gray-800 p-4 space-y-3">
          <button
            onClick={handleNewBatch}
            className="flex items-center w-full p-3 bg-green-600 text-white rounded-lg"
          >
            + New Batch
          </button>
          <button className="flex items-center w-full p-3 text-gray-300 hover:bg-gray-800 rounded-lg">
            My Batches
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Farmer Dashboard</h1>
          <p className="text-gray-400 mb-6 md:mb-8 text-sm md:text-base">
            Manage your Ayurvedic herb batches and track verification status.
          </p>

          {/* Stats */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 md:p-6 rounded-lg shadow-lg">
                <h3 className="text-lg md:text-xl font-semibold mb-2">Total Batches</h3>
                <p className="text-2xl md:text-3xl font-bold">{harvests.length}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 md:p-6 rounded-lg shadow-lg">
                <h3 className="text-lg md:text-xl font-semibold mb-2">Verified</h3>
                <p className="text-2xl md:text-3xl font-bold">
                  {harvests.filter((h) => h.status === 'Verified').length}
                </p>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 md:p-6 rounded-lg shadow-lg">
                <h3 className="text-lg md:text-xl font-semibold mb-2">Pending</h3>
                <p className="text-2xl md:text-3xl font-bold">
                  {harvests.filter((h) => h.status === 'Pending Verification').length}
                </p>
              </div>
            </div>
          )}

          {/* Recent Batches */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
              <h2 className="text-xl md:text-2xl font-bold">Your Recent Batches</h2>
              <button
                onClick={handleNewBatch}
                className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm md:text-base"
              >
                + Register New Batch
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {harvests.map((harvest) => (
                  <div key={harvest._id} className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-md">
                    <h3 className="text-lg md:text-xl font-semibold mb-2">{harvest.herbName}</h3>
                    <div className="flex items-center mb-3">
                      <span
                        className={`inline-block w-3 h-3 rounded-full mr-2 ${
                          harvest.status === 'Verified'
                            ? 'bg-green-400'
                            : harvest.status === 'Pending Verification'
                            ? 'bg-yellow-400'
                            : 'bg-red-400'
                        }`}
                      ></span>
                      <span className="text-gray-300 text-sm md:text-base">{harvest.status}</span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-400 mb-2">
                      Location: {harvest.location?.description || 'Not specified'}
                    </p>
                    <p className="text-xs md:text-sm text-gray-400 mb-2">
                      Quantity: {harvest.quantity?.value} {harvest.quantity?.unit}
                    </p>
                    <p className="text-xs md:text-sm text-gray-400 mb-4">
                      Registered on {new Date(harvest.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleViewDetails(harvest._id)}
                        className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 rounded text-xs md:text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleShowQR(harvest)}
                        className="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded text-xs md:text-sm"
                      >
                        Show QR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Empty state */}
          {!loading && !error && harvests.length === 0 && (
            <div className="text-center py-16">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 md:h-16 md:w-16 mx-auto text-gray-600 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg md:text-xl font-medium text-gray-400 mb-2">
                No Batches Registered
              </h3>
              <p className="text-gray-500 mb-6 text-sm md:text-base">
                Start by registering your first herb batch
              </p>
              <button
                onClick={handleNewBatch}
                className="py-2 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Register New Batch
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="p-4 text-center text-gray-500 text-xs md:ml-64">
        © 2025 HerbChain
      </footer>

      {/* QR Modal */}
      {showQR && selectedHarvest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 px-4">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-bold">{selectedHarvest.herbName} QR Code</h3>
              <button
                onClick={() => setShowQR(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="bg-white p-3 rounded-md flex justify-center mb-4">
              <QRCodeSVG value={selectedHarvest.qrData} size={200} />
            </div>
            <p className="text-gray-300 mb-2 text-sm md:text-base">
              Status:{' '}
              <span
                className={
                  selectedHarvest.status === 'Verified'
                    ? 'text-green-400'
                    : selectedHarvest.status === 'Pending Verification'
                    ? 'text-yellow-400'
                    : 'text-red-400'
                }
              >
                {selectedHarvest.status}
              </span>
            </p>
            <p className="text-gray-400 text-xs md:text-sm mb-4">
              Scan this QR code to verify authenticity and track the journey of this herb batch.
            </p>
            <button
              onClick={() => {
                alert('QR Code ready for verification. In production, this downloads the QR image.');
              }}
              className="w-full py-2 md:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm md:text-base"
            >
              Download QR Code
            </button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedHarvest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 px-4">
          <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg w-full max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-2xl font-bold">{selectedHarvest.herbName} Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {detailsLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {selectedHarvest.photoUrl && (
                  <img
                    src={selectedHarvest.photoUrl}
                    alt={selectedHarvest.herbName}
                    className="w-full h-40 md:h-48 object-cover rounded-lg mb-4"
                  />
                )}

                <div className="flex items-center bg-gray-700 p-3 md:p-4 rounded-lg">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      selectedHarvest.status === 'Verified'
                        ? 'bg-green-400'
                        : selectedHarvest.status === 'Pending Verification'
                        ? 'bg-yellow-400'
                        : 'bg-red-400'
                    }`}
                  ></div>
                  <div>
                    <h4 className="text-base md:text-lg font-medium">Status</h4>
                    <p className="text-gray-300 text-sm md:text-base">{selectedHarvest.status}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700 p-3 md:p-4 rounded-lg">
                    <h4 className="text-base md:text-lg font-medium mb-2">Harvest Details</h4>
                    <p className="text-gray-300 text-sm md:text-base">
                      Quantity: {selectedHarvest.quantity?.value} {selectedHarvest.quantity?.unit}
                    </p>
                    <p className="text-gray-300 text-sm md:text-base">
                      Harvest Date: {new Date(selectedHarvest.harvestDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-300 text-sm md:text-base">
                      Registered: {new Date(selectedHarvest.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="bg-gray-700 p-3 md:p-4 rounded-lg">
                    <h4 className="text-base md:text-lg font-medium mb-2">Location</h4>
                    <p className="text-gray-300 text-sm md:text-base mb-1">
                      {selectedHarvest.location?.description || 'Not specified'}
                    </p>
                    {selectedHarvest.location?.latitude && selectedHarvest.location?.longitude && (
                      <p className="text-gray-300 text-sm md:text-base">
                        Coordinates: {selectedHarvest.location.latitude},{' '}
                        {selectedHarvest.location.longitude}
                      </p>
                    )}
                  </div>
                </div>

                {selectedHarvest.certifications && selectedHarvest.certifications.length > 0 && (
                  <div className="bg-gray-700 p-3 md:p-4 rounded-lg">
                    <h4 className="text-base md:text-lg font-medium mb-2">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedHarvest.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="px-3 py-1 bg-gray-600 rounded-full text-xs md:text-sm"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedHarvest.additionalInfo && (
                  <div className="bg-gray-700 p-3 md:p-4 rounded-lg">
                    <h4 className="text-base md:text-lg font-medium mb-2">Additional Information</h4>
                    <p className="text-gray-300 text-sm md:text-base">
                      {selectedHarvest.additionalInfo}
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      handleShowQR(selectedHarvest);
                    }}
                    className="w-full sm:w-auto py-2 px-4 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm md:text-base"
                  >
                    Show QR Code
                  </button>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="w-full sm:w-auto py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm md:text-base"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FarmerDashboard;