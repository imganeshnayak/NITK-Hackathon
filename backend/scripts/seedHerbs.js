// scripts/seedHerbs.js
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Herb = require('../models/Herb');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample herb data
const herbs = [
  {
    name: 'Ashwagandha',
    botanicalName: 'Withania somnifera',
    description: 'An ancient medicinal herb with multiple health benefits. It can reduce anxiety and stress, help fight depression, boost fertility and testosterone in men, and even boost brain function.',
    imageUrl: 'https://images.unsplash.com/photo-1579684947554-1be96ebc25f3?w=300&h=200&fit=crop',
    uses: ['Stress reduction', 'Anxiety relief', 'Immunity boost'],
    parts: ['Root', 'Leaves', 'Berries'],
    properties: ['Adaptogenic', 'Anti-inflammatory', 'Antioxidant'],
    sustainabilityInfo: 'Traditionally grown in India, often using organic farming methods.'
  },
  {
    name: 'Turmeric',
    botanicalName: 'Curcuma longa',
    description: 'A spice that contains curcumin, a substance with powerful anti-inflammatory and antioxidant properties. It has been used in India for thousands of years as both a spice and medicinal herb.',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
    uses: ['Anti-inflammatory', 'Pain relief', 'Digestive aid'],
    parts: ['Rhizome'],
    properties: ['Anti-inflammatory', 'Antioxidant', 'Antimicrobial'],
    sustainabilityInfo: 'Grown in tropical regions, can be cultivated with sustainable practices.'
  },
  {
    name: 'Tulsi',
    botanicalName: 'Ocimum sanctum',
    description: 'Holy Basil or Tulsi has been used for thousands of years in Ayurveda for its healing properties. It is known for its adaptogenic effects, helping the body adapt to stress.',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop',
    uses: ['Stress relief', 'Respiratory health', 'Immune support'],
    parts: ['Leaves', 'Seeds', 'Root'],
    properties: ['Adaptogenic', 'Antioxidant', 'Antimicrobial'],
    sustainabilityInfo: 'Easy to grow and can be cultivated in home gardens with minimal resources.'
  },
  {
    name: 'Triphala',
    botanicalName: 'Combination of three fruits',
    description: 'A traditional Ayurvedic herbal formula consisting of equal parts of three fruits: Amalaki, Bibhitaki, and Haritaki. Known for its digestive benefits.',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop',
    uses: ['Digestive health', 'Detoxification', 'Eye health'],
    parts: ['Fruit'],
    properties: ['Laxative', 'Anti-inflammatory', 'Antioxidant'],
    sustainabilityInfo: 'Harvested from trees that are part of traditional agroforestry systems.'
  },
  {
    name: 'Brahmi',
    botanicalName: 'Bacopa monnieri',
    description: 'A staple herb in Ayurvedic medicine, known for its cognitive-enhancing effects. It helps improve memory, reduce anxiety, and treat epilepsy.',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=200&fit=crop',
    uses: ['Cognitive enhancement', 'Memory improvement', 'Anxiety reduction'],
    parts: ['Whole plant'],
    properties: ['Nootropic', 'Anxiolytic', 'Adaptogenic'],
    sustainabilityInfo: 'Grows in wet, damp, and marshy areas, often cultivated in controlled conditions.'
  },
  {
    name: 'Neem',
    botanicalName: 'Azadirachta indica',
    description: 'Known for its medicinal properties, every part of the neem tree has been used in traditional remedies. It has antibacterial, antifungal, and blood-purifying properties.',
    imageUrl: 'https://images.unsplash.com/photo-1594736797936-d0b9d21faa13?w=300&h=200&fit=crop',
    uses: ['Skin disorders', 'Dental care', 'Blood purification'],
    parts: ['Leaves', 'Bark', 'Seeds'],
    properties: ['Antimicrobial', 'Anti-inflammatory', 'Antioxidant'],
    sustainabilityInfo: 'The neem tree is drought-resistant and requires minimal care, making it environmentally sustainable.'
  },
  {
    name: 'Amla',
    botanicalName: 'Emblica officinalis',
    description: 'Indian Gooseberry or Amla is one of the richest natural sources of Vitamin C. It has been used in Ayurvedic medicine to treat common cold and fever.',
    imageUrl: 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=300&h=200&fit=crop',
    uses: ['Immune support', 'Digestion', 'Hair care'],
    parts: ['Fruit'],
    properties: ['Antioxidant', 'Anti-inflammatory', 'Immunomodulatory'],
    sustainabilityInfo: 'Amla trees are part of traditional Indian agroforestry systems and provide multiple benefits.'
  },
  {
    name: 'Shatavari',
    botanicalName: 'Asparagus racemosus',
    description: 'Known as the "Queen of Herbs" in Ayurveda, it is primarily used for women\'s health issues and as a female reproductive tonic.',
    imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop',
    uses: ['Women\'s health', 'Fertility support', 'Immune enhancement'],
    parts: ['Root'],
    properties: ['Adaptogenic', 'Galactagogue', 'Demulcent'],
    sustainabilityInfo: 'Wild harvesting can lead to overexploitation, so sustainable cultivation is encouraged.'
  },
  {
    name: 'Ginger',
    botanicalName: 'Zingiber officinale',
    description: 'Used for thousands of years for its medicinal properties, particularly as a digestive aid and for reducing nausea. It also has anti-inflammatory and antioxidant effects.',
    imageUrl: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=300&h=200&fit=crop',
    uses: ['Digestive aid', 'Nausea relief', 'Anti-inflammatory'],
    parts: ['Rhizome'],
    properties: ['Anti-inflammatory', 'Antiemetic', 'Carminative'],
    sustainabilityInfo: 'Can be grown with sustainable agricultural practices.'
  },
  {
    name: 'Cinnamon',
    botanicalName: 'Cinnamomum verum',
    description: 'A spice obtained from the inner bark of several tree species from the genus Cinnamomum. It has been used for its medicinal properties for thousands of years.',
    imageUrl: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=300&h=200&fit=crop',
    uses: ['Blood sugar control', 'Heart health', 'Anti-inflammatory'],
    parts: ['Bark'],
    properties: ['Antioxidant', 'Anti-inflammatory', 'Antimicrobial'],
    sustainabilityInfo: 'Traditional cinnamon harvesting involves sustainable bark collection without killing the tree.'
  },
  {
    name: 'Cardamom',
    botanicalName: 'Elettaria cardamomum',
    description: 'Known as the "Queen of Spices," cardamom is used in both sweet and savory dishes. It has digestive and detoxifying properties in Ayurveda.',
    imageUrl: 'https://images.unsplash.com/photo-1597688648517-6a51b6d4dc81?w=300&h=200&fit=crop',
    uses: ['Digestive aid', 'Breath freshener', 'Detoxification'],
    parts: ['Seeds', 'Pods'],
    properties: ['Carminative', 'Stimulant', 'Antimicrobial'],
    sustainabilityInfo: 'Can be shade-grown in forest systems, promoting biodiversity.'
  },
  {
    name: 'Licorice',
    botanicalName: 'Glycyrrhiza glabra',
    description: 'Used in Ayurveda and traditional Chinese medicine, licorice root is known for its soothing effects on the digestive system and as a respiratory aid.',
    imageUrl: 'https://images.unsplash.com/photo-1592318315249-0436ab15bb15?w=300&h=200&fit=crop',
    uses: ['Digestive health', 'Respiratory support', 'Adrenal support'],
    parts: ['Root'],
    properties: ['Demulcent', 'Expectorant', 'Anti-inflammatory'],
    sustainabilityInfo: 'Sustainable harvesting practices include rotating harvest areas and replanting.'
  }
];

// Function to seed herbs
const seedHerbs = async () => {
  try {
    // Clear existing herbs
    await Herb.deleteMany({});
    console.log('Cleared existing herbs');
    
    // Insert new herbs
    await Herb.insertMany(herbs);
    console.log(`Successfully seeded ${herbs.length} herbs`);
    
    // Disconnect from MongoDB
    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding herbs:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

// Run the seeder
seedHerbs();