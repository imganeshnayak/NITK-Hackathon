import { useReducer, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// --- DATA & STATE LOGIC (can be moved to another file if it grows) ---

// New herb data with '_id'
const herbs = [
    { _id: "6514e2b2c2a1f2b3d4e5f6a1", name: "Ashwagandha", sanskritName: "अश्वगंधा", imageUrl: "https://images.unsplash.com/photo-1579684947554-1be96ebc25f3?w=400&h=300&fit=crop" },
    { _id: "6514e2b2c2a1f2b3d4e5f6a2", name: "Turmeric", sanskritName: "हरिद्रा", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop" },
    { _id: "6514e2b2c2a1f2b3d4e5f6a3", name: "Tulsi (Holy Basil)", sanskritName: "तुलसी", imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop" },
    { _id: "6514e2b2c2a1f2b3d4e5f6a4", name: "Triphala", sanskritName: "त्रिफला", imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop" },
];

// Reformat the data to match the component's expected structure
const recentHerbs = herbs.slice(0, 4).map((herb, index) => ({
    id: herb._id,
    name: herb.name,
    image: herb.imageUrl,
    batch: `Batch ID: ${herb.name.substring(0, 4).toUpperCase()}-24-00${index + 1}`,
}));

// State management with useReducer
const initialState = {
  batchId: '',
  favorites: [],
  isLoading: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_BATCH_ID':
      return { ...state, batchId: action.payload, error: null };
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.includes(action.payload)
          ? state.favorites.filter((id) => id !== action.payload)
          : [...state.favorites, action.payload],
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};


// --- THE MAIN HOME PAGE COMPONENT ---

function HomePage() {
  // Like in RegisterPage, use the hook at the top level of the component
  const { t } = useTranslation();
  
  const [state, dispatch] = useReducer(reducer, initialState);
  const { batchId, favorites, isLoading, error } = state;

  const toggleFavorite = useCallback((id) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: id });
  }, []);

  // This logic is now moved directly into the HomePage component from the old HeroSection
  const handleTrack = useCallback(() => {
    if (!batchId.trim()) {
      dispatch({ type: 'SET_ERROR', payload: t('batchIdError') });
      return;
    }
    dispatch({ type: 'SET_LOADING', payload: true });
    // Simulate API call
    setTimeout(() => {
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 1000);
  }, [batchId, t]); // Add t to dependency array

  // Data for filters, now translated directly here
  const filters = [
    { key: 'filterHerbType', label: t('filterHerbType') },
    { key: 'filterOrigin', label: t('filterOrigin'), active: true },
    { key: 'filterCertifications', label: t('filterCertifications') }
  ];

  const processingSteps = [
    t('stepHarvesting'), 
    t('stepDrying'), 
    t('stepQualityCheck')
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* ===== START: Hero Section JSX ===== */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 dark:text-white leading-tight">
          {t('heroTitle')} <span className="text-green-600 dark:text-green-400">{t('heroTitleTrust')}</span>.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          {t('heroSubtitle')}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-lg">
          <input
            type="text"
            placeholder={t('batchIdPlaceholder')}
            value={batchId}
            onChange={(e) => dispatch({ type: 'SET_BATCH_ID', payload: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:border-green-500 focus:ring-green-500"
            aria-label="Batch ID input"
            disabled={isLoading}
          />
          <button
            onClick={handleTrack}
            className="py-3 px-6 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            disabled={isLoading}
            aria-label="Track harvest button"
          >
            {isLoading ? t('trackingButton') : t('trackHarvestButton')}
          </button>
        </div>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </section>
      {/* ===== END: Hero Section JSX ===== */}

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* ===== START: Filter Section JSX ===== */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{t('filterByTitle')}</h2>
            <div className="flex gap-2 flex-wrap">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  className={`px-4 py-1 rounded-full text-sm ${
                    filter.active
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-gray-600'
                  }`}
                  aria-label={`Filter by ${filter.label}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center">
            <button
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              aria-label="Clear all filters"
            >
              {t('clearAllButton')}
            </button>
            <button className="ml-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
              {t('sortByButton')} <span className="ml-1">▼</span>
            </button>
          </div>
        </div>
        {/* ===== END: Filter Section JSX ===== */}

        {/* ===== START: Recently Viewed Section with Herb Cards ===== */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('recentlyViewedTitle')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentHerbs.map((herb) => {
                const isFavorite = favorites.includes(herb.id);
                return (
                    // This is the HerbCard JSX, directly inside the map loop
                    <div key={herb.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
                        <div className="relative p-4 flex justify-center">
                            <div className="w-24 h-24 rounded-full bg-green-50 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                <img src={herb.image} alt={herb.name} className="w-full h-full object-cover" loading="lazy" />
                            </div>
                            <button
                                onClick={() => toggleFavorite(herb.id)}
                                className="absolute top-2 right-2 text-yellow-400 hover:text-yellow-500"
                                aria-label={isFavorite ? `Remove ${herb.name} from favorites` : `Add ${herb.name} to favorites`}
                            >
                                {isFavorite ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-current" viewBox="0 0 20 20" aria-hidden="true"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
                            </button>
                        </div>
                        <div className="p-4 text-center">
                            <h3 className="font-semibold text-gray-800 dark:text-white">{herb.name}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{herb.batch}</p>
                            <Link
                                to={`/verify/${herb.id}`}
                                className="mt-3 inline-block px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg w-full transition-colors"
                                aria-label={`View details for ${herb.name}`}
                            >
                                {t('viewDetailsButton')}
                            </Link>
                        </div>
                    </div>
                )
            })}
          </div>
        </section>
        {/* ===== END: Recently Viewed Section ===== */}
        
        {/* ===== START: Scan Section JSX ===== */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            {t('scanTitle')}
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=800&fit=crop" alt="Map view for scanning QR code" className="w-full h-full object-cover opacity-70" loading="lazy" />
              <div className="absolute inset-0 border-4 border-dashed border-yellow-400 m-8 flex items-center justify-center">
                <div className="text-center text-yellow-600 dark:text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                  <p className="font-semibold">{t('scanAreaText')}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-md transition-colors"
                aria-label="Scan QR code"
              >
                {t('scanNowButton')}
              </button>
            </div>
          </div>
        </section>
        {/* ===== END: Scan Section JSX ===== */}

        {/* ===== START: Provenance Card JSX ===== */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('provenanceTitle')}</h2>
            <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              {t('verifiedBadge')}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">{t('provenanceSubtitle')}</p>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
              <img src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&h=600&fit=crop" alt="Product origin map" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div className="text-sm">
                <p className="text-gray-500 dark:text-gray-400">Haveli, India</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{t('harvestLocationLabel')}</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-500 dark:text-gray-400">2025-09-27</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{t('harvestDateLabel')}</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-500 dark:text-gray-400">Ayurtrust</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{t('verifiedByLabel')}</p>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">{t('processingStepsTitle')}</h3>
              {processingSteps.map((step, index) => (
                <div key={step} className="mb-2">
                  <div className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs mr-3">{index + 1}</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{step}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">{t('labResultsTitle')}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 dark:text-gray-400">
                      <th className="pb-2">{t('tableTestType')}</th>
                      <th className="pb-2">{t('tableDate')}</th>
                      <th className="pb-2">{t('tablePurityLevel')}</th>
                      <th className="pb-2">{t('tableContaminants')}</th>
                      <th className="pb-2">{t('tableNotes')}</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-2">{t('testPurity')}</td>
                      <td>2025-09-01</td>
                      <td>98.2%</td>
                      <td>{t('resultNoneDetected')}</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td className="py-2">{t('testPotency')}</td>
                      <td>2025-09-01</td>
                      <td>-</td>
                      <td>-</td>
                      <td>{t('resultPassesStandards')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 text-center">
                <button
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                  aria-label="View on Blockchain Explorer"
                >
                  {t('viewOnBlockchainButton')}
                </button>
              </div>
            </div>
          </div>
        </section>
        {/* ===== END: Provenance Card JSX ===== */}

      </div>
    </div>
  );
}

export default HomePage;