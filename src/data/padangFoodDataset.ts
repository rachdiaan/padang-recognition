import { FoodItem } from '../types/food';

export const padangFoodDataset: FoodItem[] = [
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
  {
    id: 'gulai-cubadak',
    name: 'Gulai Cubadak',
    nameEn: 'Jackfruit Curry',
    description: 'Nangka muda yang dimasak dengan santan dan bumbu gulai khas Padang. Memiliki rasa gurih dan sedikit pedas dengan tekstur nangka yang lembut.',
    ingredients: ['nangka muda', 'santan kelapa', 'cabai merah', 'bawang merah', 'kunyit', 'ketumbar', 'jintan', 'daun salam', 'serai'],
    image: 'https://images.pexels.com/photos/5409751/pexels-photo-5409751.jpeg',
    category: 'vegetable',
    region: 'Sumatera Barat',
    spiceLevel: 'mild',
    cookingTime: '45 minutes',
    nutritionalInfo: {
      calories: 180,
      protein: 4,
      carbs: 25,
      fat: 8
    }
  },
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
  {
    id: 'dendeng-balado',
    name: 'Dendeng Balado',
    nameEn: 'Spicy Dried Beef',
    description: 'Daging sapi kering yang dimasak dengan cabai dan bumbu balado. Memiliki rasa pedas manis yang khas dengan tekstur daging yang kenyal.',
    ingredients: ['dendeng sapi', 'cabai merah keriting', 'cabai rawit', 'bawang merah', 'tomat', 'gula merah', 'asam jawa', 'garam'],
    image: 'https://images.pexels.com/photos/5409764/pexels-photo-5409764.jpeg',
    category: 'main-dish',
    region: 'Sumatera Barat',
    spiceLevel: 'hot',
    cookingTime: '30 minutes',
    nutritionalInfo: {
      calories: 320,
      protein: 28,
      carbs: 12,
      fat: 18
    }
  },
  {
    id: 'sate-padang',
    name: 'Sate Padang',
    nameEn: 'Padang Satay',
    description: 'Sate daging dengan kuah kental berwarna kuning dari bumbu rempah. Kuahnya terbuat dari tepung beras dan rempah-rempah yang kaya rasa.',
    ingredients: ['daging sapi', 'tepung beras', 'kunyit', 'ketumbar', 'jintan', 'cabai merah', 'bawang merah', 'jahe', 'lengkuas'],
    image: 'https://images.pexels.com/photos/4113729/pexels-photo-4113729.jpeg',
    category: 'main-dish',
    region: 'Sumatera Barat',
    spiceLevel: 'medium',
    cookingTime: '2 hours',
    nutritionalInfo: {
      calories: 290,
      protein: 24,
      carbs: 15,
      fat: 16
    }
  },
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
  {
    id: 'gulai-tunjang',
    name: 'Gulai Tunjang',
    nameEn: 'Beef Tendon Curry',
    description: 'Kaki sapi yang dimasak dengan bumbu gulai hingga empuk. Memiliki tekstur kenyal dan rasa yang gurih dengan kuah santan yang kental.',
    ingredients: ['tunjang sapi', 'santan kelapa', 'cabai merah', 'bawang merah', 'kunyit', 'jahe', 'lengkuas', 'daun salam', 'serai'],
    image: 'https://images.pexels.com/photos/5409748/pexels-photo-5409748.jpeg',
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
  {
    id: 'perkedel-kentang',
    name: 'Perkedel Kentang',
    nameEn: 'Potato Fritters',
    description: 'Kentang yang dihaluskan, dibumbui, dan digoreng hingga kecokelatan. Sering disajikan sebagai pelengkap nasi Padang.',
    ingredients: ['kentang', 'bawang merah', 'bawang putih', 'telur', 'daun bawang', 'garam', 'merica', 'minyak goreng'],
    image: 'https://images.pexels.com/photos/4113726/pexels-photo-4113726.jpeg',
    category: 'side-dish',
    region: 'Sumatera Barat',
    spiceLevel: 'mild',
    cookingTime: '30 minutes',
    nutritionalInfo: {
      calories: 150,
      protein: 4,
      carbs: 20,
      fat: 6
    }
  },
  {
    id: 'sambal-lado-tanak',
    name: 'Sambal Lado Tanak',
    nameEn: 'Cooked Chili Sauce',
    description: 'Sambal khas Padang yang dimasak dengan cabai merah, bawang, dan rempah. Memiliki rasa pedas yang khas dan warna merah menyala.',
    ingredients: ['cabai merah keriting', 'cabai rawit', 'bawang merah', 'bawang putih', 'tomat', 'garam', 'gula', 'minyak'],
    image: 'https://images.pexels.com/photos/4113727/pexels-photo-4113727.jpeg',
    category: 'condiment',
    region: 'Sumatera Barat',
    spiceLevel: 'very-hot',
    cookingTime: '20 minutes',
    nutritionalInfo: {
      calories: 45,
      protein: 1,
      carbs: 8,
      fat: 2
    }
  },
  {
    id: 'gulai-daun-singkong',
    name: 'Gulai Daun Singkong',
    nameEn: 'Cassava Leaves Curry',
    description: 'Daun singkong muda yang dimasak dengan santan dan bumbu gulai. Memiliki rasa yang gurih dan sedikit pahit khas daun singkong.',
    ingredients: ['daun singkong muda', 'santan kelapa', 'ikan teri', 'cabai merah', 'bawang merah', 'kunyit', 'jahe', 'lengkuas'],
    image: 'https://images.pexels.com/photos/5409750/pexels-photo-5409750.jpeg',
    category: 'vegetable',
    region: 'Sumatera Barat',
    spiceLevel: 'mild',
    cookingTime: '40 minutes',
    nutritionalInfo: {
      calories: 120,
      protein: 6,
      carbs: 12,
      fat: 6
    }
  },
  {
    id: 'gulai-kepala-ikan',
    name: 'Gulai Kepala Ikan',
    nameEn: 'Fish Head Curry',
    description: 'Kepala ikan kakap yang dimasak dengan bumbu gulai dan sayuran. Hidangan yang kaya akan kolagen dan memiliki rasa yang gurih.',
    ingredients: ['kepala ikan kakap', 'santan kelapa', 'terong', 'okra', 'cabai hijau', 'kunyit', 'jahe', 'serai', 'daun jeruk'],
    image: 'https://images.pexels.com/photos/4113728/pexels-photo-4113728.jpeg',
    category: 'main-dish',
    region: 'Sumatera Barat',
    spiceLevel: 'medium',
    cookingTime: '1 hour',
    nutritionalInfo: {
      calories: 200,
      protein: 18,
      carbs: 10,
      fat: 10
    }
  },
  {
    id: 'kerupuk-jangek',
    name: 'Kerupuk Jangek',
    nameEn: 'Beef Skin Crackers',
    description: 'Kerupuk yang terbuat dari kulit sapi yang dikeringkan dan digoreng. Memiliki tekstur renyah dan rasa gurih yang khas.',
    ingredients: ['kulit sapi', 'garam', 'bumbu penyedap', 'minyak goreng'],
    image: 'https://images.pexels.com/photos/5409752/pexels-photo-5409752.jpeg',
    category: 'snack',
    region: 'Sumatera Barat',
    spiceLevel: 'mild',
    cookingTime: '15 minutes',
    nutritionalInfo: {
      calories: 180,
      protein: 12,
      carbs: 2,
      fat: 14
    }
  }
];