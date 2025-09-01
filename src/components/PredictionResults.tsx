import React from 'react';
import { Trophy, Clock, MapPin, Flame, Brain, Target } from 'lucide-react';
import { PredictionResult } from '../types/food';

interface PredictionResultsProps {
  predictions: PredictionResult[];
  isLoading: boolean;
}

export const PredictionResults: React.FC<PredictionResultsProps> = ({ predictions, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
        <div className="flex items-center justify-center space-x-4">
          <div className="relative">
            <Brain className="text-orange-400 animate-pulse" size={32} />
            <div className="absolute inset-0 animate-ping">
              <Brain className="text-orange-300/50" size={32} />
            </div>
          </div>
          <div>
            <p className="text-white font-bold text-lg">Analyzing image...</p>
            <p className="text-gray-300">Processing with neural networks</p>
          </div>
        </div>
      </div>
    );
  }

  if (predictions.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-center">
        <Target className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-300 text-lg">Take a photo to identify Padang food dishes</p>
        <p className="text-gray-400 text-sm mt-2">AI analysis will begin automatically after capture</p>
      </div>
    );
  }

  const getSpiceLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'mild': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hot': return 'text-orange-400';
      case 'very-hot': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSpiceLevelIcon = (level: string) => {
    const count = level.toLowerCase() === 'mild' ? 1 : 
                  level.toLowerCase() === 'medium' ? 2 : 
                  level.toLowerCase() === 'hot' ? 3 : 4;
    return Array(count).fill(0).map((_, i) => (
      <Flame key={i} className={`w-3 h-3 ${getSpiceLevelColor(level)}`} />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h3 className="text-white font-bold text-xl">🎯 Recognition Results</h3>
      </div>
      
      {predictions.map((prediction, index) => (
        <div
          key={index}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-xl"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-white font-bold text-xl mb-1">{prediction.food.name}</h4>
              <p className="text-orange-300 font-medium">{prediction.food.nameEn}</p>
            </div>
            <div className="text-right">
              <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                {Math.round(prediction.confidence * 100)}%
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Match: {Math.round(prediction.matchScore * 100)}%
              </div>
            </div>
          </div>

          <p className="text-gray-300 mb-4 leading-relaxed">{prediction.food.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300 text-sm">{prediction.food.region}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="text-gray-300 text-sm">{prediction.food.cookingTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-300 text-sm">Spice:</span>
              <div className="flex space-x-1">
                {getSpiceLevelIcon(prediction.food.spiceLevel)}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h5 className="text-white font-semibold mb-2">Main Ingredients:</h5>
            <div className="flex flex-wrap gap-2">
              {prediction.food.ingredients.slice(0, 6).map((ingredient, i) => (
                <span
                  key={i}
                  className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-sm border border-white/20"
                >
                  {ingredient}
                </span>
              ))}
              {prediction.food.ingredients.length > 6 && (
                <span className="text-gray-400 text-sm">+{prediction.food.ingredients.length - 6} more</span>
              )}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <h5 className="text-white font-semibold mb-3">Nutritional Information (per serving):</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="text-center">
                <div className="text-orange-300 font-bold text-lg">{prediction.food.nutritionalInfo.calories}</div>
                <div className="text-gray-400">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-blue-300 font-bold text-lg">{prediction.food.nutritionalInfo.protein}g</div>
                <div className="text-gray-400">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-green-300 font-bold text-lg">{prediction.food.nutritionalInfo.carbs}g</div>
                <div className="text-gray-400">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-300 font-bold text-lg">{prediction.food.nutritionalInfo.fat}g</div>
                <div className="text-gray-400">Fat</div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h5 className="text-white font-semibold mb-3 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
          Pro Tips for Better Recognition:
        </h5>
        <ul className="text-gray-300 text-sm space-y-2">
          <li>• Ensure good lighting when taking photos</li>
          <li>• Center the dish in the frame</li>
          <li>• Avoid shadows and reflections</li>
          <li>• Take photos from a slight angle above the dish</li>
          <li>• Use clean, contrasting backgrounds</li>
        </ul>
      </div>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 rounded-3xl mt-8">
        <div className="p-6">
          <div className="text-center text-gray-300">
            <p className="text-gray-500">
              © 2025. Created with 💖 by Rachdian
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};