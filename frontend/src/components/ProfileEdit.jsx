import { useState, useEffect } from 'react';
import api from '../api';

function ProfileEdit({ userId, initialData, onSave }) {
  const [form, setForm] = useState(initialData || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
  const res = await api.put(`/auth/users/${userId}`, form);
      setSuccess('Profile updated successfully!');
      if (onSave) onSave(res.data);
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label className="block font-semibold mb-1 text-gray-800 dark:text-gray-100">Name</label>
        <input name="name" value={form.name || ''} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-800 dark:text-gray-100">Email</label>
        <input name="email" value={form.email || ''} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-800 dark:text-gray-100">Phone</label>
        <input name="phone" value={form.phone || ''} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-800 dark:text-gray-100">Address</label>
        <input name="address" value={form.address || ''} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-800 dark:text-gray-100">Department</label>
        <input name="department" value={form.department || ''} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-800 dark:text-gray-100">Office Location</label>
        <input name="officeLocation" value={form.officeLocation || ''} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-800 dark:text-gray-100">Admin Notes</label>
        <textarea name="adminNotes" value={form.adminNotes || ''} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-800 dark:text-gray-100">Access Level</label>
        <input name="accessLevel" value={form.accessLevel || ''} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
      {error && <div className="text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900 mt-2 px-2 py-1 rounded">{error}</div>}
      {success && <div className="text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900 mt-2 px-2 py-1 rounded">{success}</div>}
    </form>
  );
}

export default ProfileEdit;
