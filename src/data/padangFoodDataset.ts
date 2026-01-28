import { FoodItem } from '../types/food';

/**
 * Padang Food Dataset
 * Aligned with trained model classes (9 categories from Kaggle padangfood dataset)
 */
export const padangFoodDataset: FoodItem[] = [
  // === MODEL CLASS: ayam_goreng (index 0) ===
  {
    id: 'ayam-goreng',
    name: 'Ayam Goreng',
    nameEn: 'Fried Chicken',
    description: 'Ayam yang dibumbui dengan rempah-rempah khas kemudian digoreng hingga kecokelatan. Bumbu meresap sempurna dengan kulit yang renyah.',
    ingredients: ['ayam kampung', 'bawang putih', 'bawang merah', 'ketumbar', 'kunyit', 'jahe', 'garam', 'minyak goreng'],
    image: 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg',
    category: 'main-dish',
    region: 'Sumatera Barat',
    spiceLevel: 'mild',
    cookingTime: '45 minutes',
    nutritionalInfo: {
      calories: 290,
      protein: 28,
      carbs: 5,
      fat: 18
    }
  },

  // === MODEL CLASS: ayam_pop (index 1) ===
  {
    id: 'ayam-pop',
    name: 'Ayam Pop',
    nameEn: 'Pop Chicken',
    description: 'Ayam yang direbus dengan bumbu kemudian digoreng hingga kulit berwarna putih keemasan. Ciri khas dari masakan ini adalah warna putih pada kulitnya.',
    ingredients: ['ayam kampung', 'bawang putih', 'jahe', 'kunyit', 'garam', 'air jeruk nipis', 'daun salam', 'serai'],
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
    category: 'main-dish',
    region: 'Sumatera Barat',
    spiceLevel: 'mild',
    cookingTime: '1.5 hours',
    nutritionalInfo: {
      calories: 280,
      protein: 32,
      carbs: 2,
      fat: 16
    }
  },

  // === MODEL CLASS: daging_rendang (index 2) ===
  {
    id: 'rendang',
    name: 'Rendang',
    nameEn: 'Rendang Beef',
    description: 'Daging sapi yang dimasak dengan santan dan rempah-rempah hingga mengering. Masakan khas Minangkabau yang telah diakui UNESCO sebagai masakan terlezat di dunia.',
    ingredients: ['daging sapi', 'santan kelapa', 'cabai merah', 'bawang merah', 'bawang putih', 'jahe', 'kunyit', 'serai', 'daun jeruk', 'kelapa sangrai'],
    image: 'https://images.pexels.com/photos/4113725/pexels-photo-4113725.jpeg',
    category: 'main-dish',
    region: 'Sumatera Barat',
    spiceLevel: 'medium',
    cookingTime: '4-6 hours',
    nutritionalInfo: {
      calories: 350,
      protein: 25,
      carbs: 8,
      fat: 24
    }
  },

  // === MODEL CLASS: dendeng_batokok (index 3) ===
  {
    id: 'dendeng-batokok',
    name: 'Dendeng Batokok',
    nameEn: 'Pounded Beef Jerky',
    description: 'Daging sapi yang dipukul-pukul dan digoreng kering, kemudian dibaluri dengan sambal balado. Teksturnya renyah di luar dan masih lembut di dalam.',
    ingredients: ['daging sapi', 'cabai merah keriting', 'cabai rawit', 'bawang merah', 'bawang putih', 'tomat', 'gula merah', 'garam'],
    image: 'https://images.pexels.com/photos/5409764/pexels-photo-5409764.jpeg',
    category: 'main-dish',
    region: 'Sumatera Barat',
    spiceLevel: 'hot',
    cookingTime: '45 minutes',
    nutritionalInfo: {
      calories: 320,
      protein: 28,
      carbs: 12,
      fat: 18
    }
  },

  // === MODEL CLASS: gulai_ikan (index 4) ===
  {
    id: 'gulai-ikan',
    name: 'Gulai Ikan',
    nameEn: 'Fish Curry',
    description: 'Ikan yang dimasak dengan santan dan bumbu gulai khas Padang. Biasanya menggunakan ikan kakap atau ikan mas dengan kuah santan yang gurih.',
    ingredients: ['ikan kakap', 'santan kelapa', 'cabai merah', 'kunyit', 'jahe', 'serai', 'daun jeruk', 'asam kandis', 'garam'],
    image: 'https://images.pexels.com/photos/4113724/pexels-photo-4113724.jpeg',
    category: 'main-dish',
    region: 'Sumatera Barat',
    spiceLevel: 'medium',
    cookingTime: '45 minutes',
    nutritionalInfo: {
      calories: 250,
      protein: 30,
      carbs: 6,
      fat: 12
    }
  },

  // === MODEL CLASS: gulai_tambusu (index 5) ===
  {
    id: 'gulai-tambusu',
    name: 'Gulai Tambusu',
    nameEn: 'Intestine Curry',
    description: 'Usus sapi yang diisi dengan telur dan tahu, kemudian dimasak dengan bumbu gulai santan. Memiliki rasa gurih dan tekstur yang unik.',
    ingredients: ['usus sapi', 'telur', 'tahu', 'santan kelapa', 'cabai merah', 'kunyit', 'jahe', 'lengkuas', 'serai', 'daun salam'],
    image: 'https://images.pexels.com/photos/5409748/pexels-photo-5409748.jpeg',
    category: 'main-dish',
    region: 'Sumatera Barat',
    spiceLevel: 'medium',
    cookingTime: '2 hours',
    nutritionalInfo: {
      calories: 310,
      protein: 20,
      carbs: 8,
      fat: 22
    }
  },

  // === MODEL CLASS: gulai_tunjang (index 6) ===
  {
    id: 'gulai-tunjang',
    name: 'Gulai Tunjang',
    nameEn: 'Beef Tendon Curry',
    description: 'Kaki sapi yang dimasak dengan bumbu gulai hingga empuk. Memiliki tekstur kenyal dan rasa yang gurih dengan kuah santan yang kental.',
    ingredients: ['tunjang sapi', 'santan kelapa', 'cabai merah', 'bawang merah', 'kunyit', 'jahe', 'lengkuas', 'daun salam', 'serai'],
    image: 'https://images.pexels.com/photos/5409751/pexels-photo-5409751.jpeg',
    category: 'main-dish',
    region: 'Sumatera Barat',
    spiceLevel: 'medium',
    cookingTime: '3 hours',
    nutritionalInfo: {
      calories: 380,
      protein: 22,
      carbs: 8,
      fat: 28
    }
  },

  // === MODEL CLASS: telur_balado (index 7) ===
  {
    id: 'telur-balado',
    name: 'Telur Balado',
    nameEn: 'Spicy Egg',
    description: 'Telur rebus yang digoreng kemudian disiram dengan sambal balado merah. Perpaduan gurih telur dengan pedas manis sambal yang menggugah selera.',
    ingredients: ['telur ayam', 'cabai merah keriting', 'cabai rawit', 'bawang merah', 'bawang putih', 'tomat', 'gula', 'garam'],
    image: 'https://images.pexels.com/photos/5409759/pexels-photo-5409759.jpeg',
    category: 'main-dish',
    region: 'Sumatera Barat',
    spiceLevel: 'hot',
    cookingTime: '25 minutes',
    nutritionalInfo: {
      calories: 180,
      protein: 12,
      carbs: 8,
      fat: 12
    }
  },

  // === MODEL CLASS: telur_dadar (index 8) ===
  {
    id: 'telur-dadar',
    name: 'Telur Dadar Padang',
    nameEn: 'Padang Omelette',
    description: 'Telur dadar tebal khas Padang dengan campuran daun bawang dan bumbu. Dibuat tebal dan dipotong-potong, disajikan sebagai lauk pendamping nasi.',
    ingredients: ['telur ayam', 'daun bawang', 'bawang merah', 'bawang putih', 'garam', 'merica', 'minyak goreng'],
    image: 'https://images.pexels.com/photos/6406505/pexels-photo-6406505.jpeg',
    category: 'main-dish',
    region: 'Sumatera Barat',
    spiceLevel: 'mild',
    cookingTime: '15 minutes',
    nutritionalInfo: {
      calories: 160,
      protein: 10,
      carbs: 2,
      fat: 12
    }
  }
];

// Helper to get food by model class index
export const getFoodByClassIndex = (index: number): FoodItem | undefined => {
  const classIdMap: { [key: number]: string } = {
    0: 'ayam-goreng',
    1: 'ayam-pop',
    2: 'rendang',
    3: 'dendeng-batokok',
    4: 'gulai-ikan',
    5: 'gulai-tambusu',
    6: 'gulai-tunjang',
    7: 'telur-balado',
    8: 'telur-dadar'
  };

  const id = classIdMap[index];
  return padangFoodDataset.find(food => food.id === id);
};

// Export class names for model
export const modelClassNames = [
  'ayam_goreng',
  'ayam_pop',
  'daging_rendang',
  'dendeng_batokok',
  'gulai_ikan',
  'gulai_tambusu',
  'gulai_tunjang',
  'telur_balado',
  'telur_dadar'
];