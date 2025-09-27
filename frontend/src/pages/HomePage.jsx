// src/pages/HomePage.jsx
function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4" style={{ height: 'calc(100vh - 4rem)' }}>
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 dark:text-white leading-tight">
        Traceability You Can <span className="text-green-600 dark:text-green-400">Trust</span>.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
        VibeChain brings transparency to the Ayurvedic supply chain. Scan a QR code or enter a batch ID to see the complete journey of your herbal products, from farm to you.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-lg">
        <input
          type="text"
          placeholder="Enter Batch ID to Track..."
          className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:border-green-500 focus:ring-green-500"
        />
        <button className="py-3 px-6 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
          Track Harvest
        </button>
      </div>
    </div>
  );
}

export default HomePage;