import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HerbSelectionPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Static herb data from user
  const herbs = [
    {
      _id: "6514e2b2c2a1f2b3d4e5f6a1",
      name: "Ashwagandha",
      sanskritName: "अश्वगंधा",
      imageUrl: "https://images.unsplash.com/photo-1579684947554-1be96ebc25f3?w=400&h=300&fit=crop",
      description: "Adaptogenic herb for stress relief and vitality",
      benefits: ["Reduces stress", "Improves energy", "Enhances cognitive function"],
      category: "adaptogen"
    },
    {
      _id: "6514e2b2c2a1f2b3d4e5f6a2",
      name: "Turmeric",
      sanskritName: "हरिद्रा",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      description: "Anti-inflammatory and antioxidant properties",
      benefits: ["Reduces inflammation", "Powerful antioxidant", "Supports joint health"],
      category: "anti-inflammatory"
    },
    {
      _id: "6514e2b2c2a1f2b3d4e5f6a3",
      name: "Tulsi (Holy Basil)",
      sanskritName: "तुलसी",
      imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
      description: "Sacred herb for immunity and respiratory health",
      benefits: ["Boosts immunity", "Respiratory support", "Stress reduction"],
      category: "immunity"
    },
    {
      _id: "6514e2b2c2a1f2b3d4e5f6a4",
      name: "Triphala",
      sanskritName: "त्रिफला",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
      description: "Traditional digestive formula",
      benefits: ["Digestive health", "Detoxification", "Antioxidant support"],
      category: "digestive"
    },
    {
      _id: "6514e2b2c2a1f2b3d4e5f6a5",
      name: "Brahmi",
      sanskritName: "ब्राह्मी",
      imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=300&fit=crop",
      description: "Brain tonic for memory and cognitive function",
      benefits: ["Improves memory", "Enhances learning", "Reduces anxiety"],
      category: "cognitive"
    },
    {
      _id: "6514e2b2c2a1f2b3d4e5f6a6",
      name: "Neem",
      sanskritName: "नीम",
      imageUrl: "https://images.unsplash.com/photo-1594736797936-d0b9d21faa13?w=400&h=300&fit=crop",
      description: "Blood purifier and skin health",
      benefits: ["Skin health", "Blood purification", "Antimicrobial properties"],
      category: "detox"
    },
    {
      _id: "6514e2b2c2a1f2b3d4e5f6a7",
      name: "Amla (Indian Gooseberry)",
      sanskritName: "आमला",
      imageUrl: "https://images.unsplash.com/photo-1582515073490-39981397c445?w=400&h=300&fit=crop",
      description: "Rich in Vitamin C for immunity",
      benefits: ["High in Vitamin C", "Immune booster", "Anti-aging properties"],
      category: "immunity"
    },
    {
      _id: "6514e2b2c2a1f2b3d4e5f6a8",
      name: "Shatavari",
      sanskritName: "शतावरी",
      imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
      description: "Women's health and rejuvenation",
      benefits: ["Hormonal balance", "Reproductive health", "Adaptogenic properties"],
      category: "women-health"
    },
    {
      _id: "6514e2b2c2a1f2b3d4e5f6a9",
      name: "Ginger",
      sanskritName: "आद्रक",
      imageUrl: "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=400&h=300&fit=crop",
      description: "Digestive aid and anti-inflammatory",
      benefits: ["Digestive support", "Anti-inflammatory", "Nausea relief"],
      category: "digestive"
    },
    {
      _id: "6514e2b2c2a1f2b3d4e5f6aa",
      name: "Cinnamon",
      sanskritName: "दालचीनी",
      imageUrl: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=300&fit=crop",
      description: "Blood sugar regulation and warmth",
      benefits: ["Blood sugar control", "Antioxidant", "Warming properties"],
      category: "metabolic"
    },
    {
      _id: "6514e2b2c2a1f2b3d4e5f6ab",
      name: "Cardamom",
      sanskritName: "एला",
      imageUrl: "https://images.unsplash.com/photo-1597688648517-6a51b6d4dc81?w=400&h=300&fit=crop",
      description: "Digestive spice and breath freshener",
      benefits: ["Digestive aid", "Breath freshener", "Antioxidant properties"],
      category: "digestive"
    },
    {
      _id: "6514e2b2c2a1f2b3d4e5f6ac",
      name: "Licorice (Mulethi)",
      sanskritName: "यष्टिमधु",
      imageUrl: "https://images.unsplash.com/photo-1592318315249-0436ab15bb15?w=400&h=300&fit=crop",
      description: "Respiratory health and throat soothing",
      benefits: ["Respiratory support", "Throat soothing", "Adrenal support"],
      category: "respiratory"
    },
    {
      _id: "6514e2b2c2a1f2b3d4e5f6ad",
      name: "Sandalwood",
      sanskritName: "चन्दन",
      imageUrl: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=400&h=300&fit=crop",
      description: "Cooling herb for skin and meditation",
      benefits: ["Skin care", "Cooling properties", "Meditation aid"],
      category: "skin-care"
    },
    {
      _id: "14",
      name: "Guggul",
      sanskritName: "गुग्गुलु",
      imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
      description: "Cholesterol management and anti-inflammatory",
      benefits: ["Cholesterol control", "Anti-inflammatory", "Thyroid support"],
      category: "metabolic"
    },
    {
      _id: "15",
      name: "Arjuna",
      sanskritName: "अर्जुन",
      imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=300&fit=crop",
      description: "Cardiac tonic and heart health",
      benefits: ["Heart health", "Cardiac tonic", "Blood pressure regulation"],
      category: "cardiac"
    },
    {
      _id: "16",
      name: "Bitter Melon (Karela)",
      sanskritName: "कारवेल्लक",
      imageUrl: "https://images.unsplash.com/photo-1582515073490-39981397c445?w=400&h=300&fit=crop",
      description: "Blood sugar regulation and detoxification",
      benefits: ["Blood sugar control", "Detoxification", "Liver health"],
      category: "metabolic"
    }
  ];

  // Filtering logic
  const categories = ['all', ...new Set(herbs.map(herb => herb.category))];
  const filteredHerbs = herbs.filter(herb => {
    const matchesCategory = selectedCategory === 'all' || herb.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      herb.name.toLowerCase().includes(query) ||
      (herb.description && herb.description.toLowerCase().includes(query)) ||
      (herb.sanskritName && herb.sanskritName.toLowerCase().includes(query)) ||
      (herb.benefits && herb.benefits.some(benefit => benefit.toLowerCase().includes(query)));
    return matchesCategory && matchesSearch;
  });

  const handleSelectHerb = (herb) => {
    navigate('/batch-registration', { state: { herb } });
  };

  const handleBack = () => {
    navigate('/farmer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={handleBack}
            className="mr-4 p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
            title="Back to Dashboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Ayurvedic Herb Library</h1>
            <p className="text-gray-400 text-lg">Select the herb you harvested to register a new batch</p>
          </div>
        </div>

        {/* No error state needed since data is static */}

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="mb-4">
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search herbs by name, description, or benefits..." 
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pl-12 text-white focus:outline-none focus:border-green-500"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-3">Filter by Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category === 'all' ? 'All Herbs' : category.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Herb Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredHerbs.map((herb) => (
            <div
              key={herb._id}
              onClick={() => handleSelectHerb(herb)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectHerb(herb);
                }
              }}
              tabIndex="0"
              role="button"
              aria-label={`Select ${herb.name}`}
              className="group bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 hover:border-green-500/30 overflow-hidden cursor-pointer relative focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              {/* Herb Image */}
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={herb.imageUrl} 
                  alt={herb.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjM0Y0QTU1Ii8+CjxwYXRoIGQ9Ik01MCAzMEM1My4zMTM3IDMwIDU2IDMyLjY4NjMgNTYgMzZDNTYgMzkuMzEzNyA1My4zMTM3IDQyIDUwIDQyQzQ2LjY4NjMgNDIgNDQgMzkuMzEzNyA0NCAzNkM0NCAzMi42ODYzIDQ2LjY4NjMgMzAgNTAgMzBaTTY2IDY2VjYwQzY2IDU2LjY4NjMgNjMuMzEzNyA1NCA2MCA1NEg0MEMzNi42ODYzIDU0IDM0IDU2LjY4NjMgMzQgNjBWNjZIMzZWNjBINjRWNjZINjZaIiBmaWxsPSIjMDk4NTU0Ii8+Cjwvc3ZnPgo=';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Herb Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-white group-hover:text-green-400 transition-colors duration-200">
                    {herb.name}
                  </h3>
                  {herb.sanskritName && (
                    <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded" title="Sanskrit Name">
                      {herb.sanskritName}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                  {herb.description || "Traditional Ayurvedic herb with medicinal properties"}
                </p>
                
                {herb.benefits && herb.benefits.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1 mt-2">
                      {herb.benefits.map((benefit, index) => (
                        <span 
                          key={index} 
                          className="text-xs bg-gray-700 text-green-400 px-2 py-1 rounded-full"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {herb.category && (
                  <p className="text-xs text-gray-400 mb-3">
                    Category: <span className="text-green-400">{herb.category.replace('-', ' ')}</span>
                  </p>
                )}
                
                <div 
                  className="w-full py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium flex items-center justify-center group/btn"
                >
                  <span>Select Herb</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-200" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                {/* Visual selection indicator */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-green-500 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {herbs.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="bg-gray-800 rounded-xl p-8 max-w-md mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-xl font-medium text-white mb-2">No Herbs Available</h3>
              <p className="text-gray-400 mb-6">Unable to load herb data. Please check your connection.</p>
              <button 
                onClick={() => window.location.reload()}
                className="py-2 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Showing {filteredHerbs.length} of {herbs.length} Ayurvedic herbs • Traditional medicinal plants for holistic wellness
          </p>
        </div>
      </div>
    </div>
  );
}

export default HerbSelectionPage;