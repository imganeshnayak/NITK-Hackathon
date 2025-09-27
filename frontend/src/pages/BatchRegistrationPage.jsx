import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
    
function BatchRegistrationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedHerb = location.state?.herb;
  
  // Camera functionality
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [imageCaptured, setImageCaptured] = useState(false);
  const [image, setImage] = useState('');
  
  // Form data state
  const [formData, setFormData] = useState({
    herbName: selectedHerb?.name || '',
    quantity: '',
    unit: 'kg',
    harvestDate: new Date().toISOString().split('T')[0],
    location: '',
    certifications: [],
    additionalInfo: ''
  });

  // Farmer profile state
  const [farmerProfile, setFarmerProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/farmer/profile');
        setFarmerProfile(res.data);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchProfile();
  }, []);
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleCertificationChange = (certification) => {
    setFormData(prev => {
      const certifications = [...prev.certifications];
      if (certifications.includes(certification)) {
        return { ...prev, certifications: certifications.filter(c => c !== certification) };
      } else {
        return { ...prev, certifications: [...certifications, certification] };
      }
    });
  };
  
  // Camera functions
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access the camera. Please check permissions.');
    }
  };
  
  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };
  
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setImage(imageDataUrl);
      setImageCaptured(true);
      closeCamera();
    }
  };
  
  // Geolocation function
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get your location. Please check permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.herbName) newErrors.herbName = 'Herb name is required';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    if (!formData.harvestDate) newErrors.harvestDate = 'Harvest date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setLoading(true);

  try {
    // Prepare API payload
    const harvestData = {
      herbName: formData.herbName,    // Only send herb name
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      harvestDate: formData.harvestDate,
      location: {
        description: formData.location,
        village: farmerProfile?.location?.village || '',
        city: farmerProfile?.location?.city || '',
        pincode: farmerProfile?.location?.pincode || '',
        state: farmerProfile?.location?.state || ''
      },
      certifications: formData.certifications,
      additionalInfo: formData.additionalInfo,
      photoUrl: image                  // Base64 image
    };

    const response = await api.post('/harvests', harvestData);

    console.log('Harvest created:', response.data);
    setSuccess(true);

    // Redirect after success
    setTimeout(() => {
      navigate('/farmer');
    }, 2000);

  } catch (error) {
    console.error('Error submitting form:', error);
    alert(
      error.response?.data?.message ||
      'Failed to submit harvest data. Please try again.'
    );
  } finally {
    setLoading(false);
  }
};

  if (!selectedHerb) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">No Herb Selected</h2>
          <p className="text-gray-300 mb-6">Please select a herb first before proceeding with registration.</p>
          <button 
            onClick={() => navigate('/herb-selection')}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Go to Herb Selection
          </button>
        </div>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-2xl font-bold mb-4">Batch Registered Successfully!</h2>
          <p className="text-gray-300 mb-6">Your batch has been submitted for verification.</p>
          <p className="text-sm text-gray-400 mb-4">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Register New Herb Batch</h1>
        
        <div className="mb-6 bg-gray-700 p-5 rounded-lg border-l-4 border-green-500 shadow-lg">
          <div className="flex items-center mb-4">
            {selectedHerb?.imageUrl && (
              <img 
                src={selectedHerb.imageUrl} 
                alt={selectedHerb.name} 
                className="w-20 h-20 object-cover rounded-lg mr-4"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjM0Y0QTU1Ii8+CjxwYXRoIGQ9Ik01MCAzMEM1My4zMTM3IDMwIDU2IDMyLjY4NjMgNTYgMzZDNTYgMzkuMzEzNyA1My4zMTM3IDQyIDUwIDQyQzQ2LjY4NjMgNDIgNDQgMzkuMzEzNyA0NCAzNkM0NCAzMi42ODYzIDQ2LjY4NjMgMzAgNTAgMzBaTTY2IDY2VjYwQzY2IDU2LjY4NjMgNjMuMzEzNyA1NCA2MCA1NEg0MEMzNi42ODYzIDU0IDM0IDU2LjY4NjMgMzQgNjBWNjZIMzZWNjBINjRWNjZINjZaIiBmaWxsPSIjMDk4NTU0Ii8+Cjwvc3ZnPgo=';
                }}
              />
            )}
            <div>
              <h2 className="font-bold text-xl text-green-400">{selectedHerb?.name}</h2>
              {selectedHerb?.sanskritName && (
                <p className="text-gray-300 text-sm mb-1">{selectedHerb.sanskritName} (Sanskrit)</p>
              )}
              <div className="flex items-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300 text-sm">Selected for batch registration</span>
              </div>
            </div>
          </div>
          {selectedHerb?.description && (
            <div className="mt-2 text-sm text-gray-300 bg-gray-800 p-3 rounded-lg">
              <span className="block font-medium text-white mb-1">About this herb:</span>
              {selectedHerb.description}
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-300 mb-2">Herb Name</label>
              <input
                type="text"
                name="herbName"
                value={formData.herbName}
                onChange={handleChange}
                className={`w-full bg-gray-700 border ${errors.herbName ? 'border-red-500' : 'border-gray-600'} rounded-lg p-3 text-white`}
                placeholder="Herb name"
                readOnly
              />
              {errors.herbName && <p className="text-red-500 text-sm mt-1">{errors.herbName}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className={`w-full bg-gray-700 border ${errors.quantity ? 'border-red-500' : 'border-gray-600'} rounded-lg p-3 text-white`}
                  placeholder="Amount"
                />
                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Unit</label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="g">Grams (g)</option>
                  <option value="lb">Pounds (lb)</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Harvest Date</label>
              <input
                type="date"
                name="harvestDate"
                value={formData.harvestDate}
                onChange={handleChange}
                className={`w-full bg-gray-700 border ${errors.harvestDate ? 'border-red-500' : 'border-gray-600'} rounded-lg p-3 text-white`}
              />
              {errors.harvestDate && <p className="text-red-500 text-sm mt-1">{errors.harvestDate}</p>}
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Location Description</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
                placeholder="Farm or field name"
              />
            </div>
            
            {/* Location fields are now auto-filled from farmer profile and not shown in the form */}
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 mb-3">Certifications</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['Organic', 'Fair Trade', 'Non-GMO', 'Vegan', 'Sustainable', 'Traditional'].map((cert) => (
                <div key={cert} className="flex items-center">
                  <input
                    type="checkbox"
                    id={cert}
                    checked={formData.certifications.includes(cert)}
                    onChange={() => handleCertificationChange(cert)}
                    className="w-5 h-5 mr-2"
                  />
                  <label htmlFor={cert} className="text-gray-300">{cert}</label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <label className="block text-gray-300 mb-2">Additional Information</label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              rows="3"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
              placeholder="Additional information about the batch..."
            ></textarea>
          </div>
          
          <div className="mb-8">
            <label className="block text-gray-300 mb-3">Upload Photo of Harvest</label>
            
            {!imageCaptured ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                
                <button
                  type="button"
                  onClick={openCamera}
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white mb-2"
                >
                  Take Photo
                </button>
                <p className="text-sm text-gray-400">Or</p>
                <label className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white cursor-pointer mt-2">
                  Upload File
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImage(reader.result);
                          setImageCaptured(true);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            ) : (
              <div className="relative">
                <img 
                  src={image} 
                  alt="Captured harvest" 
                  className="w-full max-h-64 object-contain rounded-lg mb-3" 
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageCaptured(false);
                    setImage('');
                  }}
                  className="absolute top-2 right-2 bg-red-600 p-2 rounded-full hover:bg-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/herb-selection')}
              className="py-3 px-6 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`py-3 px-8 bg-green-600 hover:bg-green-700 rounded-lg text-white flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Register Batch'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Hidden video for camera */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Take Photo</h3>
              <button 
                onClick={closeCamera}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg mb-4"
            ></video>
            <button
              onClick={captureImage}
              className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white"
            >
              Capture
            </button>
          </div>
        </div>
      )}
      
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}

export default BatchRegistrationPage;