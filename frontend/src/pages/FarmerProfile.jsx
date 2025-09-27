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

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg mt-8">
      <h2 className="text-3xl font-bold mb-4 text-green-700 dark:text-green-400">Farmer Profile</h2>
      {success && <div className="mb-4 text-green-600">Profile updated successfully!</div>}
      {!editMode ? (
        <div>
          <img src={profile.photoUrl || '/default-avatar.png'} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
          <div className="mb-2"><strong>Name:</strong> {profile.name}</div>
          <div className="mb-2"><strong>Email:</strong> {profile.email}</div>
          <div className="mb-2"><strong>Phone:</strong> {profile.phone || '-'}</div>
          <div className="mb-2"><strong>Address:</strong> {profile.address || '-'}</div>
          <div className="mb-2"><strong>Bio:</strong> {profile.bio || '-'}</div>
          <div className="mb-2"><strong>Farm Name:</strong> {profile.farmName || '-'}</div>
          <div className="mb-2"><strong>Farm Size:</strong> {profile.farmSize || '-'}</div>
          <div className="mb-2"><strong>Certifications:</strong> {profile.certifications?.join(', ') || '-'}</div>
          <div className="mb-2"><strong>Location:</strong> {profile.location?.latitude}, {profile.location?.longitude}</div>
          <button onClick={() => setEditMode(true)} className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Edit Profile</button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <input name="photoUrl" type="text" value={formData.photoUrl || ''} onChange={handleChange} placeholder="Photo URL" className="w-full px-4 py-2 rounded border" />
          <input name="name" type="text" value={formData.name || ''} onChange={handleChange} placeholder="Name" className="w-full px-4 py-2 rounded border" />
          <input name="phone" type="text" value={formData.phone || ''} onChange={handleChange} placeholder="Phone" className="w-full px-4 py-2 rounded border" />
          <input name="address" type="text" value={formData.address || ''} onChange={handleChange} placeholder="Address" className="w-full px-4 py-2 rounded border" />
          <input name="bio" type="text" value={formData.bio || ''} onChange={handleChange} placeholder="Bio" className="w-full px-4 py-2 rounded border" />
          <input name="farmName" type="text" value={formData.farmName || ''} onChange={handleChange} placeholder="Farm Name" className="w-full px-4 py-2 rounded border" />
          <input name="farmSize" type="text" value={formData.farmSize || ''} onChange={handleChange} placeholder="Farm Size" className="w-full px-4 py-2 rounded border" />
          <input name="certifications" type="text" value={formData.certifications?.join(', ') || ''} onChange={e => setFormData(prev => ({ ...prev, certifications: e.target.value.split(',').map(s => s.trim()) }))} placeholder="Certifications (comma separated)" className="w-full px-4 py-2 rounded border" />
          <input name="location.latitude" type="text" value={formData.location?.latitude || ''} onChange={e => setFormData(prev => ({ ...prev, location: { ...prev.location, latitude: e.target.value } }))} placeholder="Latitude" className="w-full px-4 py-2 rounded border" />
          <input name="location.longitude" type="text" value={formData.location?.longitude || ''} onChange={e => setFormData(prev => ({ ...prev, location: { ...prev.location, longitude: e.target.value } }))} placeholder="Longitude" className="w-full px-4 py-2 rounded border" />
          <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">Save</button>
          <button type="button" onClick={() => setEditMode(false)} className="w-full py-3 mt-2 bg-gray-400 text-white rounded-lg">Cancel</button>
        </form>
      )}
    </div>
  );
}

export default FarmerProfile;
