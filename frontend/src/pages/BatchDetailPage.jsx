
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
  // Hardcoded batch data
  const [expanded, setExpanded] = useState({});
  const batch = {
    herbName: 'Tulsi',
    farmer: { name: 'Ganesh Nayak', email: 'ganesh@example.com' },
    location: {
      description: 'Farm near Udupi',
      village: 'Kalsanka',
      city: 'Udupi',
      pincode: '576101',
      state: 'Karnataka',
    },
    quantity: { value: 100, unit: 'kg' },
    harvestDate: '2025-09-20T00:00:00.000Z',
    certifications: ['Organic', 'Fair Trade'],
    additionalInfo: 'Harvested in ideal conditions.',
    status: 'Processed',
    adminRemarks: 'Batch verified and approved.',
    approvedBy: { name: 'GANESH', email: 'itisganeshnayak@gmail.com' },
    collectedBy: { name: 'Ravi Kumar', email: 'ravi@example.com' },
    manufacturerUpdate: {
      processingDetails: 'Washed, dried, and powdered.',
      remarks: 'Meets all quality standards.',
      storageLocation: 'Warehouse 3',
      batchNumber: 'MFG-2025-001',
    },
    blockchainTx: {
      hash: '0xabc123...',
      blockNumber: 123456,
      timestamp: 1695168000,
    },
  };
  // Add a verified badge and certification badges to the top of the page
  const VerifiedBadge = () => (
    <span className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-full text-sm font-semibold mr-2">
      <span className="mr-1">✔️</span> Verified
    </span>
  );
  const CertificationBadges = ({ certifications }) => (
    <span>
      {certifications.map(c => (
        <span key={c} className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded mr-1 text-xs font-semibold border border-blue-400">{c}</span>
      ))}
    </span>
  );
  // Sample lab certificate image (replace with your own image if needed)
  const LabCertificateImage = () => (
    <div className="mt-4 flex flex-col items-center">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Certificate_Template.png/600px-Certificate_Template.png" alt="Lab Certificate" className="w-64 h-auto rounded shadow border" />
      <span className="mt-2 text-xs text-gray-500">Lab Certificate</span>
    </div>
  );
  const steps = [
    {
      key: 'harvested',
      title: 'Harvested',
      icon: '🌱',
      content: (
        <div>
          <p><strong>Herb Name:</strong> {batch.herbName}</p>
          <p><strong>Farmer:</strong> {batch.farmer?.name || 'Deleted User'} ({batch.farmer?.email || 'N/A'})</p>
          <p><strong>Location:</strong> {batch.location?.description || 'N/A'}</p>
          <p><strong>Village:</strong> {batch.location?.village || 'N/A'}</p>
          <p><strong>City:</strong> {batch.location?.city || 'N/A'}</p>
          <p><strong>Pincode:</strong> {batch.location?.pincode || 'N/A'}</p>
          <p><strong>State:</strong> {batch.location?.state || 'N/A'}</p>
          <p><strong>Quantity:</strong> {batch.quantity?.value} {batch.quantity?.unit}</p>
          <p><strong>Harvest Date:</strong> {batch.harvestDate ? new Date(batch.harvestDate).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Certifications:</strong> {batch.certifications?.map(c => <span key={c} className="inline-block bg-green-200 text-green-800 px-2 py-1 rounded mr-1 text-xs">{c}</span>) || 'None'}</p>
          <button className="mt-2 text-green-700 underline" onClick={() => setExpanded(e => ({ ...e, harvested: !e.harvested }))}>{expanded.harvested ? 'Hide' : 'Show'} More</button>
          {expanded.harvested && <p className="mt-2"><strong>Additional Info:</strong> {batch.additionalInfo || 'None'}</p>}
        </div>
      ),
      completed: true,
      active: batch.status === 'Harvested',
    },
    {
      key: 'verified',
      title: 'Verified',
      icon: '✅',
      content: (
        <div>
          <p><strong>Status:</strong> {batch.status}</p>
          <p><strong>Admin:</strong> {batch.approvedBy?.name || 'N/A'} ({batch.approvedBy?.email || 'N/A'})</p>
          <button className="mt-2 text-green-700 underline" onClick={() => setExpanded(e => ({ ...e, verified: !e.verified }))}>{expanded.verified ? 'Hide' : 'Show'} More</button>
          {expanded.verified && <p className="mt-2"><strong>Admin Remarks:</strong> {batch.adminRemarks || 'None'}</p>}
        </div>
      ),
      completed: ['Verified', 'Collected', 'Processed'].includes(batch.status),
      active: batch.status === 'Verified',
    },
    {
      key: 'collected',
      title: 'Collected by Manufacturer',
      icon: '🏭',
      content: (
        <div>
          <p><strong>Collected By:</strong> {batch.collectedBy?.name || 'Manufacturer'} ({batch.collectedBy?.email || 'N/A'})</p>
          <button className="mt-2 text-green-700 underline" onClick={() => setExpanded(e => ({ ...e, collected: !e.collected }))}>{expanded.collected ? 'Hide' : 'Show'} More</button>
          {expanded.collected && <p className="mt-2"><strong>Collection Status:</strong> {batch.status}</p>}
        </div>
      ),
      completed: ['Collected', 'Processed'].includes(batch.status),
      active: batch.status === 'Collected',
    },
    {
      key: 'processed',
      title: 'Processing & Formulation',
      icon: '🧪',
      content: (
        <div>
          {batch.manufacturerUpdate ? (
            <>
              <p><strong>Processing:</strong> {batch.manufacturerUpdate.processingDetails || 'N/A'}</p>
              <p><strong>Remarks:</strong> {batch.manufacturerUpdate.remarks || 'N/A'}</p>
              <p><strong>Storage:</strong> {batch.manufacturerUpdate.storageLocation || 'N/A'}</p>
              <p><strong>Batch No:</strong> {batch.manufacturerUpdate.batchNumber || 'N/A'}</p>
            </>
          ) : <p>No manufacturer update yet.</p>}
          <button className="mt-2 text-green-700 underline" onClick={() => setExpanded(e => ({ ...e, processed: !e.processed }))}>{expanded.processed ? 'Hide' : 'Show'} More</button>
          {expanded.processed && <p className="mt-2">Further lab records and formulation details can be added here.</p>}
        </div>
      ),
      completed: batch.manufacturerUpdate != null,
      active: batch.status === 'Processed',
    },
    {
      key: 'blockchain',
      title: 'Blockchain Record',
      icon: '🔗',
      content: (
        <div>
          <p><strong>Transaction Hash:</strong> {batch.blockchainTx?.hash || 'N/A'}</p>
          <p><strong>Block Number:</strong> {batch.blockchainTx?.blockNumber || 'N/A'}</p>
          <p><strong>Timestamp:</strong> {batch.blockchainTx?.timestamp ? new Date(batch.blockchainTx.timestamp * 1000).toLocaleString() : 'N/A'}</p>
        </div>
      ),
      completed: !!batch.blockchainTx,
      active: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center mb-4">
          <VerifiedBadge />
          <CertificationBadges certifications={batch.certifications} />
          <LabCertificateImage />
        </div>
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
