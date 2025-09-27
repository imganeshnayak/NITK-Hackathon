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

  // Function to handle QR code display
  const handleShowQR = (harvest) => {
    // Create a clean object for the QR code data
    const qrHarvest = {
      ...harvest,
      // Create a clean QR data object if it doesn't exist
      qrData: harvest.qrCodeData || JSON.stringify({
        harvestId: harvest._id,
        herbName: harvest.herbName,
        location: harvest.location?.description || 'Not specified',
        harvestDate: new Date(harvest.harvestDate).toLocaleDateString(),
        status: harvest.status,
        verifyUrl: `${window.location.origin}/verify/${harvest._id}`
      })
    };
    
    setSelectedHarvest(qrHarvest);
    setShowQR(true);
  };

  // Function to handle viewing harvest details
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

  // Function to handle navigation to new batch registration
  const handleNewBatch = () => {
    navigate('/herb-selection');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="w-64 fixed h-full bg-gray-900 border-r border-gray-800 p-5">
        <h1 className="text-2xl font-bold mb-1 text-green-400">HerbChain</h1>
        <p className="text-sm text-gray-400 mb-8">Ayurvedic Traceability</p>
        
        <button 
          onClick={handleNewBatch}
          className="flex items-center w-full p-3 bg-green-600 text-white rounded-lg mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Batch
        </button>
        
        <button className="flex items-center w-full p-3 text-gray-300 hover:bg-gray-800 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          My Batches
        </button>
      </div>

      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Farmer Dashboard</h1>
          <p className="text-gray-400 mb-8">Manage your Ayurvedic herb batches and track verification status.</p>

          {/* Stats Section */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">Total Batches</h3>
                <p className="text-3xl font-bold">{harvests.length}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">Verified</h3>
                <p className="text-3xl font-bold">{harvests.filter(h => h.status === 'Verified').length}</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">Pending</h3>
                <p className="text-3xl font-bold">{harvests.filter(h => h.status === 'Pending Verification').length}</p>
              </div>
            </div>
          )}

          {/* Recent Batches Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Recent Batches</h2>
              <button 
                onClick={handleNewBatch}
                className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Register New Batch
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {harvests.map((harvest) => (
                  <div key={harvest._id} className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">{harvest.herbName}</h3>
                    <div className="flex items-center mb-3">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                        harvest.status === 'Verified' ? 'bg-green-400' : 
                        harvest.status === 'Pending Verification' ? 'bg-yellow-400' : 'bg-red-400'
                      }`}></span>
                      <span className="text-gray-300">{harvest.status}</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      Location: {harvest.location?.description || 'Not specified'}
                    </p>
                    <p className="text-sm text-gray-400 mb-2">
                      Quantity: {harvest.quantity?.value} {harvest.quantity?.unit}
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                      Registered on {new Date(harvest.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewDetails(harvest._id)}
                        className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => handleShowQR(harvest)}
                        className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                      >
                        Show QR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Empty state when no batches */}
          {!loading && !error && harvests.length === 0 && (
            <div className="text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-400 mb-2">No Batches Registered</h3>
              <p className="text-gray-500 mb-6">Start by registering your first herb batch</p>
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
      
      {/* QR Code Modal */}
      {showQR && selectedHarvest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{selectedHarvest.herbName} QR Code</h3>
              <button 
                onClick={() => setShowQR(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="bg-white p-3 rounded-md flex justify-center mb-4">
              <QRCodeSVG value={selectedHarvest.qrData} size={240} />
            </div>
            <p className="text-gray-300 mb-2">Status: <span className={
              selectedHarvest.status === 'Verified' ? 'text-green-400' : 
              selectedHarvest.status === 'Pending Verification' ? 'text-yellow-400' : 'text-red-400'
            }>{selectedHarvest.status}</span></p>
            <p className="text-gray-400 text-sm mb-4">Scan this QR code to verify authenticity and track the journey of this herb batch.</p>
            <button 
              onClick={() => {
                // Use a simpler approach - prompt user to save the QR code
                // In a real app, we'd use a proper download solution
                alert("QR Code ready for verification. In a production app, this would download the QR code image.");
              }}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Download QR Code
            </button>
          </div>
        </div>
      )}
      
      <footer className="ml-64 p-4 text-center text-gray-500 text-xs">
        © 2025 HerbChain
      </footer>
      
      {/* Harvest Details Modal */}
      {showDetails && selectedHarvest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">{selectedHarvest.herbName} Details</h3>
              <button 
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {detailsLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {selectedHarvest.photoUrl && (
                  <div>
                    <img 
                      src={selectedHarvest.photoUrl} 
                      alt={selectedHarvest.herbName} 
                      className="w-full h-48 object-cover rounded-lg mb-4" 
                    />
                  </div>
                )}
                
                <div className="flex items-center bg-gray-700 p-4 rounded-lg">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    selectedHarvest.status === 'Verified' ? 'bg-green-400' : 
                    selectedHarvest.status === 'Pending Verification' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}></div>
                  <div>
                    <h4 className="text-lg font-medium">Status</h4>
                    <p className="text-gray-300">{selectedHarvest.status}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-lg font-medium mb-2">Harvest Details</h4>
                    <p className="text-gray-300 mb-1">Quantity: {selectedHarvest.quantity?.value} {selectedHarvest.quantity?.unit}</p>
                    <p className="text-gray-300 mb-1">Harvest Date: {new Date(selectedHarvest.harvestDate).toLocaleDateString()}</p>
                    <p className="text-gray-300">Registered: {new Date(selectedHarvest.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-lg font-medium mb-2">Location</h4>
                    <p className="text-gray-300 mb-1">{selectedHarvest.location?.description || 'Not specified'}</p>
                    {selectedHarvest.location?.latitude && selectedHarvest.location?.longitude && (
                      <p className="text-gray-300">
                        Coordinates: {selectedHarvest.location.latitude}, {selectedHarvest.location.longitude}
                      </p>
                    )}
                  </div>
                </div>
                
                {selectedHarvest.certifications && selectedHarvest.certifications.length > 0 && (
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-lg font-medium mb-2">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedHarvest.certifications.map(cert => (
                        <span key={cert} className="px-3 py-1 bg-gray-600 rounded-full text-sm">{cert}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedHarvest.additionalInfo && (
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-lg font-medium mb-2">Additional Information</h4>
                    <p className="text-gray-300">{selectedHarvest.additionalInfo}</p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button 
                    onClick={() => {
                      setShowDetails(false);
                      handleShowQR(selectedHarvest);
                    }}
                    className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded-lg text-white"
                  >
                    Show QR Code
                  </button>
                  <button 
                    onClick={() => setShowDetails(false)}
                    className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
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