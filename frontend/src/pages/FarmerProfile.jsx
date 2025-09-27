import { useState, useEffect } from 'react';
import api from '../api';

function FarmerProfile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccess(false);
    try {
      const res = await api.put('/farmer/profile', formData);
      setProfile(res.data);
      setEditMode(false);
      setSuccess(true);
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-800 dark:text-gray-200">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  // --- Common input and label styling ---
  const inputClass = "w-full px-4 py-2 rounded border text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-green-500 focus:border-green-500 transition-colors";
  const labelClass = "text-gray-600 dark:text-gray-400 font-semibold text-sm";
  const contentClass = "text-gray-800 dark:text-gray-200";

  return (
    // Increased max-width and improved responsive padding
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-green-700 dark:text-green-400">Farmer Profile</h2>
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg font-medium transition-opacity duration-300">
            Profile updated successfully!
          </div>
        )}
        
        {/* --- VIEW MODE --- */}
        {!editMode ? (
          <div>
            <img 
              src={profile.photoUrl || '/default-avatar.png'} 
              alt="Profile" 
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-6 border-4 border-green-500 object-cover shadow-lg" 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              
              {/* Name */}
              <div><span className={labelClass}>Name:</span> <div className={contentClass}>{profile.name}</div></div>
              
              {/* Email (fixed field, cannot be changed here) */}
              <div><span className={labelClass}>Email:</span> <div className={contentClass}>{profile.email}</div></div>
              
              {/* Phone */}
              <div><span className={labelClass}>Phone:</span> <div className={contentClass}>{profile.phone || '-'}</div></div>
              
              {/* Address */}
              <div><span className={labelClass}>Address:</span> <div className={contentClass}>{profile.address || '-'}</div></div>
              
              {/* Farm Name */}
              <div><span className={labelClass}>Farm Name:</span> <div className={contentClass}>{profile.farmName || '-'}</div></div>
              
              {/* Farm Size */}
              <div><span className={labelClass}>Farm Size:</span> <div className={contentClass}>{profile.farmSize || '-'}</div></div>
              
              {/* Certifications */}
              <div className="md:col-span-2">
                <span className={labelClass}>Certifications:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(profile.certifications?.length > 0 ? profile.certifications : ['-']).map((cert, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-xs">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <span className={labelClass}>Bio:</span>
                <p className={contentClass}>{profile.bio || '-'}</p>
              </div>
              
              {/* Location */}
              <div className="md:col-span-2">
                <span className={labelClass}>Location:</span>
                <div className={contentClass}>
                  {profile.location?.latitude || '-'}, {profile.location?.longitude || '-'}
                </div>
              </div>
              
            </div>
            
            <button 
              onClick={() => setEditMode(true)} 
              className="mt-8 w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          /* --- EDIT MODE (Form) --- */
          <form onSubmit={handleSave} className="space-y-4">
            
            {/* Photo URL */}
            <div>
              <label className={labelClass} htmlFor="photoUrl">Photo URL (Link)</label>
              <input 
                id="photoUrl" 
                name="photoUrl" 
                type="text" 
                value={formData.photoUrl || ''} 
                onChange={handleChange} 
                placeholder="Enter image link" 
                className={inputClass} 
              />
            </div>

            {/* Name */}
            <div>
              <label className={labelClass} htmlFor="name">Full Name</label>
              <input 
                id="name" 
                name="name" 
                type="text" 
                value={formData.name || ''} 
                onChange={handleChange} 
                placeholder="Your Name" 
                className={inputClass} 
                required
              />
            </div>
            
            {/* Phone */}
            <div>
              <label className={labelClass} htmlFor="phone">Phone Number</label>
              <input 
                id="phone" 
                name="phone" 
                type="text" 
                value={formData.phone || ''} 
                onChange={handleChange} 
                placeholder="e.g., +91 9876543210" 
                className={inputClass} 
              />
            </div>
            
            {/* Address */}
            <div>
              <label className={labelClass} htmlFor="address">Physical Address</label>
              <input 
                id="address" 
                name="address" 
                type="text" 
                value={formData.address || ''} 
                onChange={handleChange} 
                placeholder="Farm address" 
                className={inputClass} 
              />
            </div>
            
            {/* Bio */}
            <div>
              <label className={labelClass} htmlFor="bio">Bio / Short Description</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                placeholder="A short description of your farm and farming philosophy"
                className={`${inputClass} h-24 resize-none`} 
              />
            </div>
            
            {/* Farm Name */}
            <div>
              <label className={labelClass} htmlFor="farmName">Farm Name</label>
              <input 
                id="farmName" 
                name="farmName" 
                type="text" 
                value={formData.farmName || ''} 
                onChange={handleChange} 
                placeholder="e.g., Green Valley Herbs" 
                className={inputClass} 
              />
            </div>
            
            {/* Farm Size */}
            <div>
              <label className={labelClass} htmlFor="farmSize">Farm Size</label>
              <input 
                id="farmSize" 
                name="farmSize" 
                type="text" 
                value={formData.farmSize || ''} 
                onChange={handleChange} 
                placeholder="e.g., 10 acres" 
                className={inputClass} 
              />
            </div>
            
            {/* Certifications */}
            <div>
              <label className={labelClass} htmlFor="certifications">Certifications (comma separated)</label>
              <input 
                id="certifications" 
                name="certifications" 
                type="text" 
                value={formData.certifications?.join(', ') || ''} 
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  certifications: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                }))} 
                placeholder="Organic, Fair Trade, AyurTrust" 
                className={inputClass} 
              />
            </div>
            
            {/* Location Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="latitude">Latitude</label>
                <input 
                  id="latitude" 
                  name="location.latitude" 
                  type="text" 
                  value={formData.location?.latitude || ''} 
                  onChange={e => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, latitude: e.target.value } 
                  }))} 
                  placeholder="e.g., 12.9716" 
                  className={inputClass} 
                />
              </div>
              
              <div>
                <label className={labelClass} htmlFor="longitude">Longitude</label>
                <input 
                  id="longitude" 
                  name="location.longitude" 
                  type="text" 
                  value={formData.location?.longitude || ''} 
                  onChange={e => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, longitude: e.target.value } 
                  }))} 
                  placeholder="e.g., 77.5946" 
                  className={inputClass} 
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                type="submit" 
                className="w-full sm:w-1/2 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md"
              >
                Save Changes
              </button>
              <button 
                type="button" 
                onClick={() => { setEditMode(false); setFormData(profile); setError(null); }} 
                className="w-full sm:w-1/2 py-3 bg-gray-400 dark:bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default FarmerProfile;