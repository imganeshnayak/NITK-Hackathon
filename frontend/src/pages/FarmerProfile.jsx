import { useState, useEffect } from 'react';
import api from '../api';

function FarmerProfile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/farmer/profile');
        setProfile(res.data);
        setFormData(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile.');
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    const field = name.split('.')[1];
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, [field]: value }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);
    try {
      const res = await api.put('/farmer/profile', formData);
      setProfile(res.data);
      setEditMode(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      const res = await api.post('/farmer/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setFormData(prev => ({ ...prev, photoUrl: res.data.photoUrl }));
      setProfile(prev => ({ ...prev, photoUrl: res.data.photoUrl }));
      setSuccess('Profile photo updated successfully!');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditMode(false);
    setError(null);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );

  if (error && !profile) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Farmer Profile
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage your profile information and farm details
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 rounded-lg">
            {typeof success === 'string' ? success : 'Profile updated successfully!'}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header with Photo */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center overflow-hidden">
                  {profile?.photoUrl ? (
                    <img 
                      src={profile.photoUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-12 h-12 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  )}
                </div>
                {editMode && (
                  <label className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2 cursor-pointer hover:bg-green-600 transition-colors">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </label>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold">{profile?.name || 'Farmer'}</h2>
                <p className="text-green-100">{profile?.farmName || 'Farm Name'}</p>
                <p className="text-green-100 text-sm">{profile?.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {!editMode ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                    Personal Information
                  </h3>
                  <InfoField label="Name" value={profile?.name} />
                  <InfoField label="Email" value={profile?.email} />
                  <InfoField label="Phone" value={profile?.phone} />
                  <InfoField label="Bio" value={profile?.bio} multiline />
                </div>

                {/* Farm Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                    Farm Information
                  </h3>
                  <InfoField label="Farm Name" value={profile?.farmName} />
                  <InfoField label="Farm Size" value={profile?.farmSize} />
                  <InfoField label="Certifications" value={profile?.certifications?.join(', ')} />
                  <InfoField label="Address" value={profile?.address} multiline />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Location</h4>
                    <InfoField label="Village" value={profile?.location?.village} />
                    <InfoField label="City" value={profile?.location?.city} />
                    <InfoField label="State" value={profile?.location?.state} />
                    <InfoField label="Pincode" value={profile?.location?.pincode} />
                  </div>
                </div>

                <div className="md:col-span-2 pt-4">
                  <button 
                    onClick={() => setEditMode(true)}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information Form */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
                    <FormField
                      label="Name"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      required
                    />
                    <FormField
                      label="Phone"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      type="tel"
                    />
                    <FormField
                      label="Bio"
                      name="bio"
                      value={formData.bio || ''}
                      onChange={handleChange}
                      multiline
                      placeholder="Tell us about yourself and your farming experience..."
                    />
                  </div>

                  {/* Farm Information Form */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Farm Information</h3>
                    <FormField
                      label="Farm Name"
                      name="farmName"
                      value={formData.farmName || ''}
                      onChange={handleChange}
                    />
                    <FormField
                      label="Farm Size"
                      name="farmSize"
                      value={formData.farmSize || ''}
                      onChange={handleChange}
                      placeholder="e.g., 5 acres"
                    />
                    <FormField
                      label="Certifications"
                      name="certifications"
                      value={formData.certifications?.join(', ') || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        certifications: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                      }))}
                      placeholder="Organic, GAP, etc. (comma separated)"
                    />
                    <FormField
                      label="Address"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleChange}
                      multiline
                    />
                  </div>

                  {/* Location Information */}
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Location Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <FormField
                        label="Village"
                        name="location.village"
                        value={formData.location?.village || ''}
                        onChange={handleLocationChange}
                      />
                      <FormField
                        label="City"
                        name="location.city"
                        value={formData.location?.city || ''}
                        onChange={handleLocationChange}
                      />
                      <FormField
                        label="State"
                        name="location.state"
                        value={formData.location?.state || ''}
                        onChange={handleLocationChange}
                      />
                      <FormField
                        label="Pincode"
                        name="location.pincode"
                        value={formData.location?.pincode || ''}
                        onChange={handleLocationChange}
                        type="number"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button 
                    type="submit" 
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    className="flex-1 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
const InfoField = ({ label, value, multiline = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
      {label}
    </label>
    <div className={`text-gray-900 dark:text-white ${multiline ? 'whitespace-pre-wrap' : ''}`}>
      {value || <span className="text-gray-400 dark:text-gray-500">Not provided</span>}
    </div>
  </div>
);

const FormField = ({ label, name, value, onChange, type = 'text', multiline = false, required = false, placeholder = '' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {multiline ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
      />
    )}
  </div>
);

export default FarmerProfile;