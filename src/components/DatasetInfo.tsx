import React, { useState } from 'react';
import { Database, Utensils, MapPin, Clock, Flame, Info, ChevronDown, ChevronUp, ChefHat } from 'lucide-react';
import { padangFoodDataset } from '../data/padangFoodDataset';

export const DatasetInfo: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const categories = [...new Set(padangFoodDataset.map(food => food.category))];
  // Total unique ingredients across all dishes
  const regions = [...new Set(padangFoodDataset.map(food => food.region))];
  const spiceLevels = [...new Set(padangFoodDataset.map(food => food.spiceLevel))];

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getSpiceLevelColor = (level: string) => {
    switch (level) {
      case 'mild': return 'text-green-400 bg-green-500/10 border-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-400/20';
      case 'hot': return 'text-orange-400 bg-orange-500/10 border-orange-400/20';
      case 'very-hot': return 'text-red-400 bg-red-500/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-400/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* Dataset Overview */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        <div className="p-8 bg-gradient-to-br from-emerald-600/80 via-teal-600/80 to-cyan-600/80 backdrop-blur-sm">
          <h1 className="text-4xl font-bold text-white mb-4">🗄️ Dataset Information</h1>
          <p className="text-emerald-100 text-lg">Comprehensive Padang Food Recognition Database</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 bg-emerald-500/10 backdrop-blur-sm rounded-2xl border border-emerald-400/20">
              <Database className="mx-auto text-emerald-400 mb-3" size={40} />
              <div className="text-3xl font-bold text-white">{padangFoodDataset.length}</div>
              <div className="text-sm text-gray-300 font-medium">Food Items</div>
            </div>

            <div className="text-center p-6 bg-orange-500/10 backdrop-blur-sm rounded-2xl border border-orange-400/20">
              <Utensils className="mx-auto text-orange-400 mb-3" size={40} />
              <div className="text-3xl font-bold text-white">{categories.length}</div>
              <div className="text-sm text-gray-300 font-medium">Categories</div>
            </div>

            <div className="text-center p-6 bg-blue-500/10 backdrop-blur-sm rounded-2xl border border-blue-400/20">
              <MapPin className="mx-auto text-blue-400 mb-3" size={40} />
              <div className="text-3xl font-bold text-white">{regions.length}</div>
              <div className="text-sm text-gray-300 font-medium">Regions</div>
            </div>

            <div className="text-center p-6 bg-purple-500/10 backdrop-blur-sm rounded-2xl border border-purple-400/20">
              <Flame className="mx-auto text-purple-400 mb-3" size={40} />
              <div className="text-3xl font-bold text-white">{spiceLevels.length}</div>
              <div className="text-sm text-gray-300 font-medium">Spice Levels</div>
            </div>
          </div>
        </div>
      </div>

      {/* Food Items Grid */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <Info className="text-blue-400 mr-3" size={32} />
            Available Dishes
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {padangFoodDataset.map((food) => {
              const isExpanded = expandedItems.has(food.id);

              return (
                <div key={food.id} className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-start space-x-4 p-6">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-20 h-20 rounded-xl object-cover shadow-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-white text-lg">{food.name}</h3>
                          <p className="text-sm text-gray-400">{food.nameEn}</p>
                        </div>
                        <button
                          onClick={() => toggleExpanded(food.id)}
                          className="text-gray-400 hover:text-white transition-colors p-1"
                        >
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full font-medium border border-blue-400/20">
                          {food.category}
                        </span>
                        <span className={`px-3 py-1 text-xs rounded-full font-medium border ${getSpiceLevelColor(food.spiceLevel)}`}>
                          {food.spiceLevel}
                        </span>
                        <span className="px-3 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full font-medium flex items-center border border-gray-400/20">
                          <Clock size={12} className="mr-1" />
                          {food.cookingTime}
                        </span>
                      </div>

                      {isExpanded && (
                        <div className="space-y-4 pt-4 border-t border-white/10">
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {food.description}
                          </p>

                          <div>
                            <h4 className="font-semibold text-white mb-2 text-sm">Ingredients:</h4>
                            <div className="flex flex-wrap gap-1">
                              {food.ingredients.map((ingredient) => (
                                <span
                                  key={ingredient}
                                  className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-md border border-orange-400/20"
                                >
                                  {ingredient}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-3 pt-2">
                            <div className="text-center">
                              <div className="text-lg font-bold text-white">{food.nutritionalInfo.calories}</div>
                              <div className="text-xs text-gray-400">Calories</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-white">{food.nutritionalInfo.protein}g</div>
                              <div className="text-xs text-gray-400">Protein</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-white">{food.nutritionalInfo.carbs}g</div>
                              <div className="text-xs text-gray-400">Carbs</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-white">{food.nutritionalInfo.fat}g</div>
                              <div className="text-xs text-gray-400">Fat</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 rounded-3xl mt-8">
        <div className="p-8">
          <div className="text-center text-gray-300">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <ChefHat className="text-orange-400" size={24} />
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Padang Food Recognition
              </span>
            </div>
            <p className="text-gray-400 font-medium mb-2">
              Powered by TensorFlow.js and modern web technologies
            </p>
            <p className="text-gray-500">
              © 2025. Created with 💖 by Rachdian
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};