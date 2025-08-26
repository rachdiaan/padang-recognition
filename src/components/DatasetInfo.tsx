import React, { useState } from 'react';
import { Database, Utensils, MapPin, Clock, Flame, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { padangFoodDataset } from '../data/padangFoodDataset';

export const DatasetInfo: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const categories = [...new Set(padangFoodDataset.map(food => food.category))];
  const totalIngredients = [...new Set(padangFoodDataset.flatMap(food => food.ingredients))].length;
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
      case 'mild': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hot': return 'text-orange-600 bg-orange-100';
      case 'very-hot': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Dataset Overview */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        <div className="p-8 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600">
          <h1 className="text-4xl font-bold text-white mb-4">Dataset Information</h1>
          <p className="text-emerald-100 text-lg">Comprehensive Padang Food Recognition Database</p>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl">
              <Database className="mx-auto text-emerald-500 mb-3" size={40} />
              <div className="text-3xl font-bold text-gray-900">{padangFoodDataset.length}</div>
              <div className="text-sm text-gray-600 font-medium">Food Items</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl">
              <Utensils className="mx-auto text-orange-500 mb-3" size={40} />
              <div className="text-3xl font-bold text-gray-900">{categories.length}</div>
              <div className="text-sm text-gray-600 font-medium">Categories</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
              <MapPin className="mx-auto text-blue-500 mb-3" size={40} />
              <div className="text-3xl font-bold text-gray-900">{regions.length}</div>
              <div className="text-sm text-gray-600 font-medium">Regions</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
              <Flame className="mx-auto text-purple-500 mb-3" size={40} />
              <div className="text-3xl font-bold text-gray-900">{spiceLevels.length}</div>
              <div className="text-sm text-gray-600 font-medium">Spice Levels</div>
            </div>
          </div>
        </div>
      </div>

      {/* Food Items Grid */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <Info className="text-blue-500 mr-3" size={32} />
            Available Dishes
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {padangFoodDataset.map((food) => {
              const isExpanded = expandedItems.has(food.id);
              
              return (
                <div key={food.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start space-x-4 p-6">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-20 h-20 rounded-xl object-cover shadow-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{food.name}</h3>
                          <p className="text-sm text-gray-600">{food.nameEn}</p>
                        </div>
                        <button
                          onClick={() => toggleExpanded(food.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                          {food.category}
                        </span>
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getSpiceLevelColor(food.spiceLevel)}`}>
                          {food.spiceLevel}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium flex items-center">
                          <Clock size={12} className="mr-1" />
                          {food.cookingTime}
                        </span>
                      </div>
                      
                      {isExpanded && (
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {food.description}
                          </p>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2 text-sm">Ingredients:</h4>
                            <div className="flex flex-wrap gap-1">
                              {food.ingredients.map((ingredient) => (
                                <span
                                  key={ingredient}
                                  className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-md"
                                >
                                  {ingredient}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-3 pt-2">
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900">{food.nutritionalInfo.calories}</div>
                              <div className="text-xs text-gray-600">Calories</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900">{food.nutritionalInfo.protein}g</div>
                              <div className="text-xs text-gray-600">Protein</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900">{food.nutritionalInfo.carbs}g</div>
                              <div className="text-xs text-gray-600">Carbs</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900">{food.nutritionalInfo.fat}g</div>
                              <div className="text-xs text-gray-600">Fat</div>
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
    </div>
  );
};