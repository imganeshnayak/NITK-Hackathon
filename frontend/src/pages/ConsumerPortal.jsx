import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Mock data for a single batch, simulating an API call
const batchData = {
  'VC-84512': {
    herbName: 'Ashwagandha',
    status: 'Verified',
    farmerAddress: '0x1a2b...c3d4',
    location: 'Mudhol, Karnataka',
    transactionHash: '0xabc...def123',
    timeline: [
      {
        title: 'Batch Registered by Farmer',
        date: '2025-09-26, 11:30 AM',
        details: 'Initial registration of raw herb batch on the farm.',
      },
      {
        title: 'Verified by VibeChain Admin',
        date: '2025-09-27, 10:15 AM',
        details: 'Compliance documents and origin data approved.',
      },
      {
        title: 'Ready for Consumer',
        date: '2025-09-27, 10:20 AM',
        details: 'Batch is now fully traceable and available in the supply chain.',
      },
    ],
  },
};

function ConsumerPortal() {
  // Get the batchId from the URL (e.g., "VC-84512")
  const { batchId } = useParams();
  const data = batchData[batchId] || null; // Find the data for this batch

  if (!data) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl">Batch Not Found</h1>
        <p className="text-gray-500">The batch ID "{batchId}" does not exist in our system.</p>
      </div>
    );
  }

  return (
    <div>
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6 md:p-8">

          {/* Header */}
          <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-green-800 bg-green-200 dark:bg-green-500/20 dark:text-green-300 rounded-full">
              ✓ {data.status}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900 dark:text-white">{data.herbName}</h1>
            <p className="text-sm font-mono text-gray-500 dark:text-gray-400 mt-1">Batch ID: {batchId}</p>
          </div>

          {/* Core Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm">
            <div><strong className="text-gray-600 dark:text-gray-300">Origin:</strong> {data.location}</div>
            <div><strong className="text-gray-600 dark:text-gray-300">Farmer:</strong> <span className="font-mono">{data.farmerAddress}</span></div>
          </div>

          {/* Timeline Feature */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Provenance Timeline</h2>
            <div className="relative border-l-2 border-green-500/30 ml-3">
              {data.timeline.map((event, index) => (
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
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
             <a 
               href={`https://sepolia.etherscan.io/tx/${data.transactionHash}`} // Placeholder link
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-block w-full md:w-auto py-3 px-6 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
             >
               Verify on Etherscan
             </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ConsumerPortal;
