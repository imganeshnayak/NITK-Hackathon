import { useState, useEffect } from 'react';
import { QRCodeCanvas } from "qrcode.react";
import { useTranslation } from 'react-i18next';
import api from '../api';
import { useState as useUserState } from 'react';

function AdminDashboard() {
  const { t } = useTranslation('adminDashboard');
  const [pendingHarvests, setPendingHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedHarvest, setSelectedHarvest] = useState(null);

  const fetchPendingHarvests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/harvests/pending');
  setPendingHarvests(Array.isArray(res.data) ? res.data : []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch pending harvests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingHarvests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/harvests/${id}/status`, { status });
      setPendingHarvests(pendingHarvests.filter((harvest) => harvest._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('adminDashboardTitle')}</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">{t('adminDashboardSubtitle')}</p>
        </div>

        {loading && <p className="text-gray-600 dark:text-gray-400">Loading pending harvests...</p>}
        {error && <div className="p-3 my-4 text-center text-sm text-red-800 bg-red-200 dark:bg-red-500/20 dark:text-red-300 rounded-md">{error}</div>}
        
        {!loading && (
          <>
            {pendingHarvests.length > 0 ? (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                <div className="hidden md:grid grid-cols-1 gap-6 p-6">
                  {pendingHarvests.map((harvest) => (
                    <div key={harvest._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="inline-block px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-bold">{harvest.herbName}</span>
                          <span className="inline-block px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs">{harvest.quantity?.value} {harvest.quantity?.unit}</span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1"><span className="font-semibold">Location:</span> {harvest.location?.description || 'N/A'}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1"><span className="font-semibold">Farmer:</span> {harvest.farmer?.name || 'Deleted User'} ({harvest.farmer?.email || 'N/A'})</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1"><span className="font-semibold">Date:</span> {new Date(harvest.createdAt).toLocaleString()}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1"><span className="font-semibold">Blockchain Tx:</span> <span className="break-all text-blue-700 dark:text-blue-300 font-mono">{harvest.blockchainTx || 'N/A'}</span></div>
                        <div className="mt-2">
                          <span className="font-semibold text-xs">QR Code:</span>
                          {harvest.qrCodeData ? (
                            <div className="inline-block ml-2 align-middle bg-white p-1 rounded shadow">
                              <QRCodeCanvas value={harvest.qrCodeData} size={64} />
                            </div>
                          ) : 'N/A'}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 md:items-end">
                        <button onClick={() => setSelectedHarvest(harvest)} className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">{t('details')}</button>
                        <button onClick={() => handleUpdateStatus(harvest._id, 'Verified')} className="px-4 py-2 text-sm font-semibold bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">{t('approve')}</button>
                        <button onClick={() => handleUpdateStatus(harvest._id, 'Rejected')} className="px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">{t('reject')}</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="md:hidden p-4 space-y-4">
                  {pendingHarvests.map((harvest) => (
                    <div key={harvest._id} className="bg-white dark:bg-gray-700/50 p-4 rounded-lg shadow">
                      <div className="font-bold text-gray-800 dark:text-white text-lg">{harvest.herbName} - {harvest.quantity?.value} {harvest.quantity?.unit}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Blockchain Tx: {harvest.blockchainTx ? harvest.blockchainTx : 'N/A'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Location: {harvest.location?.description || 'N/A'}</div>
                      <div className="mt-2 border-t dark:border-gray-600 pt-2 text-sm">
                        <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Farmer:</span> {harvest.farmer?.name || 'Deleted User'}</p>
                        <p className="truncate text-gray-700 dark:text-gray-300"><span className="font-semibold">Email:</span> {harvest.farmer?.email || 'N/A'}</p>
                        <p className="text-gray-500 dark:text-gray-400"><span className="font-semibold">Date:</span> {new Date(harvest.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="mt-4 flex justify-end space-x-3">
                        <button onClick={() => setSelectedHarvest(harvest)} className="px-3 py-1 text-sm bg-blue-500/20 text-blue-300 rounded-md">Details</button>
                        <button onClick={() => handleUpdateStatus(harvest._id, 'Rejected')} className="px-3 py-1 text-sm bg-red-500/20 text-red-300 rounded-md">Reject</button>
                        <button onClick={() => handleUpdateStatus(harvest._id, 'Verified')} className="px-3 py-1 text-sm bg-green-500/20 text-green-300 rounded-md">Approve</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState />
            )}
          </>
        )}
      </main>
      
      {selectedHarvest && (
        <HarvestDetailModal harvest={selectedHarvest} onClose={() => setSelectedHarvest(null)} />
      )}
    </div>
  );
} 

const EmptyState = () => {
    const { t } = useTranslation();
    return (
        <div className="text-center py-16 px-4 col-span-full bg-white/80 dark:bg-gray-800/80 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h3 className="mt-2 text-lg font-semibold text-gray-800 dark:text-white">{t('noPendingHarvests')}</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">{t('noPendingHarvestsSubtitle')}</p>
        </div>
    );
};

const HarvestDetailModal = ({ harvest, onClose }) => {
  const [approver, setApprover] = useState(null);
  const [rejector, setRejector] = useState(null);
  useEffect(() => {
    async function fetchUser(userId, setter) {
      if (!userId) return setter(null);
      try {
        const res = await api.get(`/users/${userId}`);
        setter(res.data);
      } catch {
        setter(null);
      }
    }
    fetchUser(harvest.approvedBy, setApprover);
    fetchUser(harvest.rejectedBy, setRejector);
  }, [harvest.approvedBy, harvest.rejectedBy]);
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{harvest.herbName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t dark:border-gray-700 pt-4 text-gray-700 dark:text-gray-300">
            <div>
              <p className="mb-2"><span className="font-semibold">Farmer:</span> {harvest.farmer?.name || 'Deleted User'} ({harvest.farmer?.email || 'N/A'})</p>
              <p className="mb-2"><span className="font-semibold">Location:</span> {harvest.location?.description || 'N/A'}</p>
              <p className="mb-2"><span className="font-semibold">Village:</span> {harvest.location?.village || 'N/A'}</p>
              <p className="mb-2"><span className="font-semibold">City:</span> {harvest.location?.city || 'N/A'}</p>
              <p className="mb-2"><span className="font-semibold">Pincode:</span> {harvest.location?.pincode || 'N/A'}</p>
              <p className="mb-2"><span className="font-semibold">State:</span> {harvest.location?.state || 'N/A'}</p>
              <p className="mb-2"><span className="font-semibold">Quantity:</span> {harvest.quantity?.value} {harvest.quantity?.unit}</p>
              <p className="mb-2"><span className="font-semibold">Harvest Date:</span> {new Date(harvest.harvestDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="mb-2"><span className="font-semibold">Certifications:</span> {harvest.certifications?.join(', ') || 'None'}</p>
              <p className="mb-2"><span className="font-semibold">Additional Info:</span> {harvest.additionalInfo || 'None'}</p>
              <p className="mb-2"><span className="font-semibold">Manufacturer Update:</span> {harvest.manufacturerUpdate ? (
                <span>
                  <br />Processing: {harvest.manufacturerUpdate.processingDetails || 'N/A'}
                  <br />Remarks: {harvest.manufacturerUpdate.remarks || 'N/A'}
                  <br />Storage: {harvest.manufacturerUpdate.storageLocation || 'N/A'}
                  <br />Batch No: {harvest.manufacturerUpdate.batchNumber || 'N/A'}
                </span>
              ) : 'None'}</p>
              <p className="mb-2"><span className="font-semibold">Admin Remarks:</span> {harvest.adminRemarks || 'None'}</p>
              {harvest.approvedBy && approver && (
                <p className="mb-2"><span className="font-semibold">Approved By:</span> {approver.name} ({approver.email})</p>
              )}
              {harvest.rejectedBy && rejector && (
                <p className="mb-2"><span className="font-semibold">Rejected By:</span> {rejector.name} ({rejector.email})</p>
              )}
              <p className="mb-2"><span className="font-semibold">Blockchain Tx Hash:</span> <span className="break-all text-blue-700 dark:text-blue-300 font-mono">{harvest.blockchainTx || 'N/A'}</span></p>
              <div className="mb-2">
                <span className="font-semibold">QR Code:</span>
                {harvest.qrCodeData ? (
                  <div className="inline-block ml-2 align-middle bg-white p-1 rounded shadow">
                    <QRCodeCanvas value={harvest.qrCodeData} size={96} />
                  </div>
                ) : 'N/A'}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-full mt-4 py-2 font-semibold text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition-colors">Close</button>
      </div>
    </div>
  );
};

export default AdminDashboard;