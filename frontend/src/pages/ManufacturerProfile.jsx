import { useState, useEffect } from 'react';
import api from '../api';
import ProfileEdit from '../components/ProfileEdit';

function ManufacturerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
  const res = await api.get(`/auth/users/${userId}`);
        setProfile(res.data);
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!profile) return <div>No profile found.</div>;

  return (
    <div className="max-w-xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Manufacturer Profile</h2>
      <ProfileEdit userId={userId} initialData={profile} onSave={setProfile} />
    </div>
  );
}

export default ManufacturerProfile;
