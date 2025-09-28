
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

function ConsumerPortal() {
  const { batchId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBatch() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/batches/${batchId}`);
        if (!res.ok) throw new Error('Batch not found');
        const result = await res.json();
        setData(result.batchData);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchBatch();
  }, [batchId]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl">Loading...</h1>
        <p className="text-gray-500">Fetching batch details from blockchain...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl">Batch Not Found</h1>
        <p className="text-gray-500">{error || `The batch ID "${batchId}" does not exist in our system.`}</p>
      </div>
    );
  }

  // Build timeline from all available batch data
  const timeline = [
    {
      title: 'Batch Registered by Farmer',
      date: data.harvestDate ? new Date(data.harvestDate * 1000).toLocaleString() : '',
      details: `Herb: ${data.herbName}\nQuantity: ${data.quantity} ${data.unit}\nCertifications: ${(data.certifications || []).join(', ') || 'None'}\nAdditional Info: ${data.additionalInfo || 'N/A'}`
    },
    data.manufacturerUpdate ? {
      title: 'Manufacturer Updated',
      date: '',
      details: `Processing: ${data.manufacturerUpdate.processingDetails || 'N/A'}\nRemarks: ${data.manufacturerUpdate.remarks || 'N/A'}\nStorage: ${data.manufacturerUpdate.storageLocation || 'N/A'}\nBatch #: ${data.manufacturerUpdate.batchNumber || 'N/A'}`
    } : null,
    data.status ? {
      title: 'Status Updated',
      date: '',
      details: `Status: ${data.status}\nAdmin Remarks: ${data.adminRemarks || 'N/A'}`
    } : null,
    data.blockchainTx ? {
      title: 'Blockchain Recorded',
      date: '',
      details: `Transaction Hash: ${data.blockchainTx}`
    } : null
  ].filter(Boolean);

  return (
    <div>
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6 md:p-8">
          {/* Header */}
          <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-green-800 bg-green-200 dark:bg-green-500/20 dark:text-green-300 rounded-full">
              ✓ {data.status || 'Unknown'}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900 dark:text-white">{data.herbName}</h1>
            <p className="text-sm font-mono text-gray-500 dark:text-gray-400 mt-1">Batch ID: {batchId}</p>
          </div>

          {/* Core Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm">
            <div><strong className="text-gray-600 dark:text-gray-300">Origin:</strong> {data.farmer?.village}, {data.farmer?.state}</div>
            <div><strong className="text-gray-600 dark:text-gray-300">Farmer:</strong> <span className="font-mono">{data.farmer?.name}</span></div>
            <div><strong className="text-gray-600 dark:text-gray-300">Batch ID:</strong> <span className="font-mono">{data.batchId}</span></div>
            <div><strong className="text-gray-600 dark:text-gray-300">Herb:</strong> <span className="font-mono">{data.herbName}</span></div>
            <div><strong className="text-gray-600 dark:text-gray-300">Quantity:</strong> <span className="font-mono">{data.quantity} {data.unit}</span></div>
            <div><strong className="text-gray-600 dark:text-gray-300">Harvest Date:</strong> <span className="font-mono">{data.harvestDate ? new Date(data.harvestDate * 1000).toLocaleDateString() : 'N/A'}</span></div>
            <div><strong className="text-gray-600 dark:text-gray-300">Certifications:</strong> <span className="font-mono">{(data.certifications || []).join(', ') || 'None'}</span></div>
            <div><strong className="text-gray-600 dark:text-gray-300">Additional Info:</strong> <span className="font-mono">{data.additionalInfo || 'N/A'}</span></div>
            {data.manufacturerUpdate && (
              <div className="col-span-2">
                <strong className="text-gray-600 dark:text-gray-300">Manufacturer Update:</strong>
                <ul className="list-disc ml-6">
                  <li>Processing: {data.manufacturerUpdate.processingDetails || 'N/A'}</li>
                  <li>Remarks: {data.manufacturerUpdate.remarks || 'N/A'}</li>
                  <li>Storage: {data.manufacturerUpdate.storageLocation || 'N/A'}</li>
                  <li>Batch #: {data.manufacturerUpdate.batchNumber || 'N/A'}</li>
                </ul>
              </div>
            )}
            {data.status && (
              <div><strong className="text-gray-600 dark:text-gray-300">Status:</strong> <span className="font-mono">{data.status}</span></div>
            )}
            {data.adminRemarks && (
              <div><strong className="text-gray-600 dark:text-gray-300">Admin Remarks:</strong> <span className="font-mono">{data.adminRemarks}</span></div>
            )}
            {data.blockchainTx && (
              <div className="col-span-2">
                <strong className="text-gray-600 dark:text-gray-300">Blockchain Transaction Hash:</strong>
                <span className="font-mono break-all">{data.blockchainTx}</span>
              </div>
            )}
          </div>

          {/* Timeline Feature */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Provenance Timeline</h2>
            <div className="relative border-l-2 border-green-500/30 ml-3">
              {timeline.map((event, index) => (
                <div key={index} className="mb-8 ml-8">
                  <div className="absolute -left-3.5 mt-1.5 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-800"></div>
                  <time className="text-sm font-normal text-gray-500 dark:text-gray-400">{event.date}</time>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                  <p className="text-base font-normal text-gray-600 dark:text-gray-300">{event.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Etherscan Button */}
          {data.blockchainTx && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <a
                href={`https://sepolia.etherscan.io/tx/${data.blockchainTx}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full md:w-auto py-3 px-6 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Verify on Etherscan
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ConsumerPortal;
