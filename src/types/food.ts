export interface FoodItem {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  ingredients: string[];
  image: string;
  category: string;
  region: string;
  spiceLevel: 'mild' | 'medium' | 'hot' | 'very-hot';
  cookingTime: string;
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface PredictionResult {
  food: FoodItem;
  confidence: number;
  matchScore: number;
}

export interface CameraState {
  isActive: boolean;
  stream: MediaStream | null;
  error: string | null;
}