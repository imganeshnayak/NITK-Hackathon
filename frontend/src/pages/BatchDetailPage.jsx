
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

function TimelineStep({ title, icon, children, active, completed }) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <div className="flex flex-col items-center">
        <div className={`rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold border-2 ${active ? 'border-green-600 bg-green-100 text-green-700' : completed ? 'border-green-400 bg-green-50 text-green-400' : 'border-gray-300 bg-gray-100 text-gray-400'}`}>{icon}</div>
        <div className="w-1 h-16 bg-gray-300 dark:bg-gray-700" />
      </div>
      <div className="flex-1">
        <h3 className={`text-lg font-bold mb-2 ${active ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>{title}</h3>
        <div className="text-gray-800 dark:text-gray-100">{children}</div>
      </div>
    </div>
  );
}

function BatchDetailPage() {
  const { id } = useParams();
  const [harvest, setHarvest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchHarvest = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/harvests/${id}`);
        setHarvest(res.data);
      } catch (err) {
        setError('Failed to fetch batch details.');
      } finally {
        setLoading(false);
      }
    };
    fetchHarvest();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!harvest) return null;

  // Timeline steps
  const steps = [
    {
      key: 'harvested',
      title: 'Harvested',
      icon: '🌱',
      content: (
        <div>
          <p><strong>Herb Name:</strong> {harvest.herbName}</p>
          <p><strong>Farmer:</strong> {harvest.farmer?.name || 'Deleted User'} ({harvest.farmer?.email || 'N/A'})</p>
          <p><strong>Location:</strong> {harvest.location?.description || 'N/A'}</p>
          <p><strong>Village:</strong> {harvest.location?.village || 'N/A'}</p>
          <p><strong>City:</strong> {harvest.location?.city || 'N/A'}</p>
          <p><strong>Pincode:</strong> {harvest.location?.pincode || 'N/A'}</p>
          <p><strong>State:</strong> {harvest.location?.state || 'N/A'}</p>
          <p><strong>Quantity:</strong> {harvest.quantity?.value} {harvest.quantity?.unit}</p>
          <p><strong>Harvest Date:</strong> {new Date(harvest.harvestDate).toLocaleDateString()}</p>
          <p><strong>Certifications:</strong> {harvest.certifications?.map(c => <span key={c} className="inline-block bg-green-200 text-green-800 px-2 py-1 rounded mr-1 text-xs">{c}</span>) || 'None'}</p>
          <button className="mt-2 text-green-700 underline" onClick={() => setExpanded(e => ({ ...e, harvested: !e.harvested }))}>{expanded.harvested ? 'Hide' : 'Show'} More</button>
          {expanded.harvested && <p className="mt-2"><strong>Additional Info:</strong> {harvest.additionalInfo || 'None'}</p>}
        </div>
      ),
      completed: true,
      active: harvest.status === 'Harvested',
    },
    {
      key: 'verified',
      title: 'Verified',
      icon: '✅',
      content: (
        <div>
          <p><strong>Status:</strong> {harvest.status}</p>
          <button className="mt-2 text-green-700 underline" onClick={() => setExpanded(e => ({ ...e, verified: !e.verified }))}>{expanded.verified ? 'Hide' : 'Show'} More</button>
          {expanded.verified && <p className="mt-2"><strong>Admin Remarks:</strong> {harvest.adminRemarks || 'None'}</p>}
        </div>
      ),
      completed: ['Verified', 'Collected', 'Processed'].includes(harvest.status),
      active: harvest.status === 'Verified',
    },
    {
      key: 'collected',
      title: 'Collected by Manufacturer',
      icon: '🏭',
      content: (
        <div>
          <p><strong>Collected By:</strong> {harvest.collectedBy ? 'Manufacturer' : 'Not yet collected'}</p>
          <button className="mt-2 text-green-700 underline" onClick={() => setExpanded(e => ({ ...e, collected: !e.collected }))}>{expanded.collected ? 'Hide' : 'Show'} More</button>
          {expanded.collected && <p className="mt-2"><strong>Collection Status:</strong> {harvest.status}</p>}
        </div>
      ),
      completed: ['Collected', 'Processed'].includes(harvest.status),
      active: harvest.status === 'Collected',
    },
    {
      key: 'processed',
      title: 'Processing & Formulation',
      icon: '🧪',
      content: (
        <div>
          {harvest.manufacturerUpdate ? (
            <>
              <p><strong>Processing:</strong> {harvest.manufacturerUpdate.processingDetails || 'N/A'}</p>
              <p><strong>Remarks:</strong> {harvest.manufacturerUpdate.remarks || 'N/A'}</p>
              <p><strong>Storage:</strong> {harvest.manufacturerUpdate.storageLocation || 'N/A'}</p>
              <p><strong>Batch No:</strong> {harvest.manufacturerUpdate.batchNumber || 'N/A'}</p>
            </>
          ) : <p>No manufacturer update yet.</p>}
          <button className="mt-2 text-green-700 underline" onClick={() => setExpanded(e => ({ ...e, processed: !e.processed }))}>{expanded.processed ? 'Hide' : 'Show'} More</button>
          {expanded.processed && <p className="mt-2">Further lab records and formulation details can be added here.</p>}
        </div>
      ),
      completed: harvest.manufacturerUpdate != null,
      active: harvest.status === 'Processed',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-green-700 dark:text-green-400 text-center">Herb Batch Lifecycle</h1>
        <div className="relative">
          {steps.map((step, idx) => (
            <TimelineStep
              key={step.key}
              title={step.title}
              icon={step.icon}
              active={step.active}
              completed={step.completed}
            >
              {step.content}
            </TimelineStep>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BatchDetailPage;
